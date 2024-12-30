import React, { useState } from 'react';
import axios from 'axios';

const AddTaskForm = ({ onSubmit, onClose }: { onSubmit: () => void; onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState('Pending');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (new Date(startTime) >= new Date(endTime)) {
      alert('End time must be later than start time.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const data = { title, priority, status, startTime, endTime };
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      setError('You need to be logged in.');
      setIsLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/tasks`, data, { headers });
      onSubmit();
    } catch (error) {
      console.error('Error submitting task:', error);
      setError('Error submitting task. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="relative bg-white rounded-md shadow-lg p-8 max-w-4xl mx-auto z-10 space-y-6">
<span className='text-3xl font-bold'>Add New Task</span>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4"
            required
          />
        </div>

        <div className="flex space-x-6 mb-6">
          <div className="w-full">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4"
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-3 text-sm font-medium">Pending</span>
              <input
                type="checkbox"
                checked={status === 'Finished'}
                onChange={() => setStatus(status === 'Pending' ? 'Finished' : 'Pending')}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium">Finished</span>
            </label>
          </div>
        </div>

        <div className="flex space-x-6 mb-6">
          <div className="w-1/2">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4"
              required
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4"
              required
            />
          </div>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Add Task'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;