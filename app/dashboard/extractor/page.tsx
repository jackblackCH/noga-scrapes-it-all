import TestRunner from '../../../components/test-runner';

export default function TestPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Job Extractor Test Suite</h1>
      <TestRunner />
    </div>
  );
}
