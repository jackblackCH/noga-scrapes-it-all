import Image from 'next/image';
import Link from 'next/link';

export default function InterviewPrep() {
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Interview Prep</h1>
      <p>
        Whether you are navigating a career change, aiming for a promotion, or entering the job
        market, our industry-tailored resume review and interview prep services are designed to
        guide you toward success.
      </p>
      <Image
        className="rounded-lg"
        src="/interview-prep.jpeg"
        alt="Interview Prep"
        width={700}
        height={400}
      />

      <div>
        <h2 className="text-emerald-600 font-bold text-lg">Comprehensive Career Support:</h2>
        <p>
          Our holistic approach addresses both the written and spoken elements of your job search.
          We combine expert resume reviews with personalized interview preparation to ensure
          you&apos;re equipped for every step of your career journey.
        </p>
      </div>

      <div>
        <h2 className="text-emerald-600 mb-2 font-bold text-lg">Services We Offer:</h2>
        <ul className="list-inside space-y-2">
          <li>
            <h3 className="font-semibold">1. Resume Review and Optimization:</h3>
            <p>
              Let our experts transform your resume into a powerful marketing tool. We analyze
              content, structure, and design to ensure your resume stands out and effectively
              communicates your value to potential employers.
            </p>
          </li>
          <li>
            <h3 className="font-semibold">2. Tailored Interview Coaching:</h3>
            <p>
              Prepare for success with one-on-one coaching sessions. Our experienced coaches provide
              personalized strategies, insider tips, and mock interviews to help you master the art
              of interviewing and confidently navigate any question.
            </p>
          </li>
          <li>
            <h3 className="font-semibold">3. Package Deals for Comprehensive Support:</h3>
            <p>
              Combine our resume review and interview preparation services for a comprehensive
              career support package. Maximize your chances of success with a tailored approach to
              both written and verbal communication.
            </p>
          </li>
        </ul>

        <p>
          <Link href="contact">Contact us to get started</Link>
        </p>
      </div>
    </div>
  );
}
