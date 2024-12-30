import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import checkTokenExpiry from '../checkTokenExpiry.ts';

const Signup = () => {

    let navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, { email, password });
            localStorage.setItem('token', response.data.token);
            navigate("/dashboard")
            console.log('signed up');
        } catch (err) {
            console.log(err);
            setError('Error registering user');
        }
    };

    useEffect(() => {
        if(localStorage.getItem("token")) {
            if(!checkTokenExpiry()){
            navigate("/dashboard");
          }
        }
    })
    

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSignup} className="p-8 bg-white shadow-md rounded-lg">
                <div className="flex justify-center mb-6">
                    <img
                        src="/profile.jpg"
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-indigo-600"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-400 focus:border-gray-600 focus:ring focus:ring-gray-300 sm:text-sm"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-400 focus:border-gray-600 focus:ring focus:ring-gray-300 sm:text-sm"
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
                >
                    Signup
                </button>
            </form>

            <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-900">
                    Already have an account? Login
                </Link>
            </div>
        </div>
    );
};

export default Signup;