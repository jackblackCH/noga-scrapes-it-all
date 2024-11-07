// app/test/_components/TestRunner.tsx
'use client';

import { useState } from 'react';
import type { Job } from '../app/api/extract-jobs-mistral/route';
import { TEST_CASES } from '../app/data/test_cases/testCases';

export async function parseJobsFromUrlWithMistral(
  url: string,
  sourceCode: string,
  company: string
): Promise<Job[]> {
  const response = await fetch('/api/extract-jobs-mistral', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sources: [
        {
          url,
          sourceCode,
          company,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.results.flatMap((result: { jobs: Job[] }) => result.jobs);
}

export default function TestRunner() {
  const [loading, setLoading] = useState(false);
  const [selectedTests, setSelectedTests] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tests' | 'results'>('tests');

  const toggleTestSelection = (index: number) => {
    const newSelection = new Set(selectedTests);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedTests(newSelection);
  };

  const runTests = async () => {
    try {
      setLoading(true);
      setError(null);
      setResults([]);

      const selectedSources = Array.from(selectedTests).map((index) => ({
        url: TEST_CASES[index].url,
        sourceCode: TEST_CASES[index].sourceCode,
        company: TEST_CASES[index].name,
      }));

      const allJobs = await Promise.all(
        selectedSources.map((source) =>
          parseJobsFromUrlWithMistral(source.url, source.sourceCode, source.company)
        )
      );

      setResults(allJobs.flat());
      setActiveTab('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 rounded ${
            activeTab === 'tests' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Test Cases
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded ${
            activeTab === 'results' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Results {results.length > 0 && `(${results.length})`}
        </button>
      </div>

      {activeTab === 'tests' && (
        <div>
          <div className="flex gap-4 items-center mb-6">
            <button
              onClick={() => setSelectedTests(new Set(TEST_CASES.map((_, i) => i)))}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Select All
            </button>
            <button
              onClick={() => setSelectedTests(new Set())}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Selection
            </button>
            <button
              onClick={runTests}
              disabled={loading || selectedTests.size === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? 'Running Tests...' : `Run Selected Tests (${selectedTests.size})`}
            </button>
          </div>

          <div className="grid gap-4">
            {TEST_CASES.map((test, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg transition-all ${
                  selectedTests.has(index) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedTests.has(index)}
                    onChange={() => toggleTestSelection(index)}
                    className="w-5 h-5 rounded"
                  />
                  <h3 className="font-bold">{test.name}</h3>
                </div>
                <div className="ml-8">
                  <p className="text-gray-600 mb-2">{test.url}</p>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    {test.sourceCode}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div>
          {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}

          {results.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((job, index) => (
                <div key={index} className="p-4 border rounded-lg shadow hover:shadow-md">
                  <h3 className="font-bold text-lg mb-2">{job.title}</h3>

                  {job.company && <p className="text-gray-600 mb-2">🏢 {job.company}</p>}

                  {job.location && <p className="text-gray-600 mb-2">📍 {job.location}</p>}

                  {job.salary && <p className="text-green-600 font-medium mb-2">💰 {job.salary}</p>}

                  {job.type && <p className="text-gray-600 mb-2">⏰ {job.type}</p>}

                  {job.experience && <p className="text-gray-600 mb-2">🎯 {job.experience}</p>}

                  {job.skills && job.skills.length > 0 && (
                    <div className="mb-2">
                      <p className="font-semibold mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.url && <p className="text-sm text-gray-500 mt-3">Source: {job.url}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
