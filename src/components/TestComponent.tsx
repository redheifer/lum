import React from 'react';

const TestComponent = () => {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md my-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Test Component</h1>
      <p className="text-gray-600">If you can see this, React is working correctly.</p>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => alert('Button clicked!')}
      >
        Click Me
      </button>
    </div>
  );
};

export default TestComponent; 