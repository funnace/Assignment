import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {

  let navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <nav className="bg-indigo-600 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <Link to="/dashboard" className="text-white text-lg font-semibold hover:text-indigo-200">
            Dashboard
          </Link>
          <Link to="/tasklist" className="text-white text-lg font-semibold hover:text-indigo-200">
            Task List
          </Link>
        </div>

        <div className="flex space-x-4">
          {isLoggedIn &&
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;