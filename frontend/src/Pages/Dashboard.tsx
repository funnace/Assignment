import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Task } from '../types.ts';
import { useNavigate } from 'react-router-dom';
import checkTokenExpiry from '../checkTokenExpiry.ts';

const Dashboard = () => {

  let navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  },[])

  useEffect(() => {

    if(!localStorage.getItem("token") || checkTokenExpiry()) {
      navigate("/");
    }

    fetchTasks();
  }, [navigate]); 

  const calculateTimeLapsed = (startTime: string) => {
    const start = new Date(startTime);
    const current = new Date();
    const diffInMs = current.getTime() - start.getTime();
    return diffInMs / (1000 * 60 * 60); 
  };

  const calculateTimeLeft = (endTime: string) => {
    const end = new Date(endTime);
    const current = new Date();
    const diffInMs = end.getTime() - current.getTime();
    return diffInMs < 0 ? 0 : diffInMs / (1000 * 60 * 60);
  };

  const groupTasksByPriority = () => {
    const grouped = tasks.reduce((acc, task) => {
      const priority = task.priority;
      if (!acc[priority]) {
        acc[priority] = {
          tasks: [],
          totalTimeLapsed: 0,
          totalTimeLeft: 0,
          pendingCount: 0,
        };
      }
      acc[priority].tasks.push(task);
      
      if (task.startTime) {
        const timeLapsed = calculateTimeLapsed(task.startTime);
        acc[priority].totalTimeLapsed += timeLapsed;
      }

      if (task.endTime) {
        const timeLeft = calculateTimeLeft(task.endTime);
        acc[priority].totalTimeLeft += timeLeft;
      }

      if (task.status === "Pending") acc[priority].pendingCount += 1;
      
      return acc;
    }, {} as Record<string, { tasks: Task[]; totalTimeLapsed: number; totalTimeLeft: number; pendingCount: number }>);

    return grouped;
  };

  const groupedTasks = groupTasksByPriority();

  const priorityRows = Object.keys(groupedTasks).map((priority) => {
    const group = groupedTasks[priority];
    return {
      priority,
      pendingTasks: group.pendingCount,
      totalTimeLapsed: group.totalTimeLapsed.toFixed(2),
      timeToFinish: group.totalTimeLeft.toFixed(2),
    };
  });

  const totalTimeLapsed = tasks.reduce((sum, task) => {
    if (task.startTime) {
      sum += calculateTimeLapsed(task.startTime);
    }
    return sum;
  }, 0).toFixed(2);

  const totalTimeLeft = tasks.reduce((sum, task) => {
    if (task.endTime) {
      sum += calculateTimeLeft(task.endTime);
    }
    return sum;
  }, 0).toFixed(2);

  console.log("groupedTasks", groupedTasks);
  console.log("priorityRows", priorityRows);

  const calculatePercentages = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
    
    const tasksCompletedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const tasksPendingPercentage = totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0;
    
    return {
      pendingTasks,
      tasksCompletedPercentage,
      tasksPendingPercentage,
    };
  };

  const { pendingTasks, tasksCompletedPercentage, tasksPendingPercentage } = calculatePercentages();

  return (
    <div className="p-6">
      <h3 className="text-3xl font-bold mb-8">Dashboard</h3>
      
      <h4 className="text-xl font-semibold mb-4">Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow-md">
          <h4 className="text-lg font-bold mb-2">Total Tasks</h4>
          <p className="text-sm">{tasks.length}</p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow-md">
          <h4 className="text-lg font-bold mb-2">Tasks Completed</h4>
          <p className="text-sm">{tasksCompletedPercentage.toFixed(2)}%</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow-md">
          <h4 className="text-lg font-bold mb-2">Tasks Pending</h4>
          <p className="text-sm">{tasksPendingPercentage.toFixed(2)}%</p>
        </div>

        <div className="bg-purple-100 p-4 rounded shadow-md">
          <h4 className="text-lg font-bold mb-2">Average Time</h4>
          <p className="text-sm">{tasks.filter(task => task.status === 'Completed').length === 0
            ? 'N/A'
            : calculateTimeLapsed(tasks[0].startTime).toFixed(2)} hrs</p>
        </div>
      </div>

      <h4 className="text-xl font-semibold mb-4">Pending Task Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-yellow-100 p-4 rounded shadow-md">
          <h4 className="text-lg font-bold mb-2">Pending Tasks</h4>
          <p className="text-sm">{pendingTasks}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded shadow-md">
          <h4 className="text-lg font-bold mb-2">Total Time Lapsed</h4>
          <p className="text-sm">{totalTimeLapsed} hrs</p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow-md">
          <h4 className="text-lg font-bold mb-2">Total Time to finish based on estimated endtime</h4>
          <p className="text-sm">{totalTimeLeft} hrs</p>
        </div>
      </div>

      <h4 className="text-xl font-semibold mb-4">Task Summary by Priority</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
        <thead>
  <tr>
    <th className="py-2 px-4 border-b border-r bg-gray-600 text-white text-left text-sm font-medium">Priority</th>
    <th className="py-2 px-4 border-b border-r bg-gray-600 text-white text-left text-sm font-medium">Pending Tasks</th>
    <th className="py-2 px-4 border-b border-r bg-gray-600 text-white text-left text-sm font-medium">Time Lapsed (hrs)</th>
    <th className="py-2 px-4 border-b bg-gray-600 text-white text-left text-sm font-medium">Time Left (hrs)</th>
  </tr>
</thead>
<tbody>
  {priorityRows.map((row, index) => (
    <tr key={row.priority} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-100'}>
      <td className="py-2 px-4 border-b border-r text-sm text-gray-700">{row.priority}</td>
      <td className="py-2 px-4 border-b border-r text-sm text-gray-700">{row.pendingTasks}</td>
      <td className="py-2 px-4 border-b border-r text-sm text-gray-700">{row.totalTimeLapsed} hrs</td>
      <td className="py-2 px-4 border-b text-sm text-gray-700">{row.timeToFinish} hrs</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;