import TestRunner from '../../../components/test-runner';

export default function TestPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Job Extractor Test Suite</h1>
      <TestRunner />
    </div>
  );
}
