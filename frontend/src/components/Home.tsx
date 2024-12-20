import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="mt-6 text-4xl font-bold text-gray-900">Geography Trivia</h1>
          <p className="mt-2 text-sm text-gray-600">Test your knowledge of world geography!</p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            to="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login to Play
          </Link>
          <Link
            to="/register"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;