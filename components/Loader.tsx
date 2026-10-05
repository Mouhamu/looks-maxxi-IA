
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-2xl font-bold text-white mb-2">Analyzing...</h2>
      <p className="text-gray-400 max-w-xs">
        Our AI is evaluating your facial features. This might take a moment.
      </p>
    </div>
  );
};

export default Loader;
