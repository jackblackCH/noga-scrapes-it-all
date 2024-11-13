// app/api/extract-jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
import { z } from 'zod';

// Types
import { Job } from '@/app/types/job';

interface ExtractionResult {
  jobs: Job[];
  sourceUrl: string;
  company: string;
  success: boolean;
  error?: string;
}

// Request validation
const requestSchema = z.object({
  sources: z
    .array(
      z.object({
        url: z.string().url(),
        sourceCode: z.string().min(1),
        company: z.string().min(1),
      })
    )
    .min(1)
    .max(20),
});

class JobExtractor {
  private client: Mistral;

  constructor(apiKey: string) {
    this.client = new Mistral({
      apiKey: apiKey,
    });
  }

  async extractJobs(
    sourceCode: string,
    sourceUrl: string,
    company: string
  ): Promise<ExtractionResult> {
    try {
      const systemPrompt = `
        You are a job posting extraction expert. Find all job postings in the provided HTML or text.
        Return data in valid JSON format with an array of jobs. Fix unterminated strings.
        Each job must have these fields (use null if not found):
        - title: job title
        - company: company name
        - location: work location
        - experience: required experience
        - skills: array of required skills
        - salary: salary information
        - type: job type (full-time, part-time, contract)
        - description: brief description
        - url: the url of the job posting
        - tags: use tags from this list that match the job posting, apply Europe 🌍 if location is Europe (Europe 🌍, Big Food Company 🥫, Executive-level roles, Bioprocess & Process Engineers, Software Engineers, Software Engineering, Molecular Biology, Research, Technicians ⚒️, Culinary & Chefs 👩🏻‍🍳, Business Development 📈, Brand Ambassadors, Operations & Supply Chains, Manufacturing, Accounting, Food Science, Regulatory Affairs & Legal, Marketing & Sales, Finance, Mechanical Engineering, Senior / Director level, Good for Recent Grads, Chemists, HR & Administration, Food Safety & QA, Internships, Logistics 🚚, Research Associates 🔬, Web developers 🧑‍💻)
      `;

      const result = await this.client.chat.complete({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Extract all job postings from this source:\n\n${sourceCode}`,
          },
        ],
        temperature: 0.1,
        maxTokens: 5000,
        responseFormat: { type: 'json_object' },
      });

      const content = result.choices?.[0]?.message.content;
      if (!content) {
        throw new Error('Empty response from Mistral API');
      }

      const data = JSON.parse(content);

      return {
        sourceUrl,
        company,
        jobs: data.jobs,
        success: true,
      };
    } catch (error) {
      console.error(`Error processing ${sourceUrl}:`, error);
      return {
        sourceUrl,
        company,
        jobs: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processBatch(
    sources: Array<{ url: string; sourceCode: string; company: string }>
  ): Promise<ExtractionResult[]> {
    const results = await Promise.all(
      sources.map((source) => this.extractJobs(source.sourceCode, source.url, source.company))
    );
    return results;
  }
}

// Simple in-memory rate limiting
const requestCounts = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = {
  windowMs: 60000, // 1 minute
  maxRequests: 20,
};

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const current = requestCounts.get(ip) || { count: 0, timestamp: now };

  if (now - current.timestamp >= RATE_LIMIT.windowMs) {
    current.count = 0;
    current.timestamp = now;
  }

  current.count++;
  requestCounts.set(ip, current);

  return current.count <= RATE_LIMIT.maxRequests;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.ip ?? '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Validate request
    const body = await req.json();
    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request format', details: validationResult.error },
        { status: 400 }
      );
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Mistral API key not configured' }, { status: 500 });
    }

    const extractor = new JobExtractor(apiKey);
    const results = await extractor.processBatch(validationResult.data.sources);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
