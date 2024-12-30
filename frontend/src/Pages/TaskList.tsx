import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import AddTaskForm from '../Components/AddTaskForm.tsx';
import EditTaskForm from '../Components/EditTaskForm.tsx';
import { Task } from '../types.ts';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { FaSortAlphaDown } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import checkTokenExpiry from '../checkTokenExpiry.ts';

const TaskList = () => {

  let navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'startTime' | 'endTime' | 'none'>('none');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [filterPriority, setFilterPriority] = useState<string>('none');
  const [filterStatus, setFilterStatus] = useState<string>('none');

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isPriorityFilterOpen, setIsPriorityFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(response.data);
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

  const calculateTotalTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const diffInMs = end.getTime() - start.getTime();

    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours.toFixed(2);
  };

  const sortedAndFilteredTasks = tasks
    .filter((task) => {
      return (
        (filterPriority === 'none' || task.priority === filterPriority) &&
        (filterStatus === 'none' || task.status === filterStatus)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'none' || sortOrder === 'none') return 0;

      const compareDate = (dateA: string, dateB: string) => {
        const diff = new Date(dateA).getTime() - new Date(dateB).getTime();
        return sortOrder === 'asc' ? diff : -diff;
      };

      if (sortBy === 'startTime') {
        return compareDate(a.startTime, b.startTime);
      }
      if (sortBy === 'endTime') {
        return compareDate(a.endTime, b.endTime);
      }
      return 0;
    });

  const handleSortDropdownToggle = () => {
    setIsSortOpen(!isSortOpen);
  };

  const handleFilterDropdownToggle = (type: string) => {
    if (type === 'priority') setIsPriorityFilterOpen(!isPriorityFilterOpen);
    if (type === 'status') setIsStatusFilterOpen(!isStatusFilterOpen);
  };

  const closeDropdowns = () => {
    setIsSortOpen(false);
    setIsPriorityFilterOpen(false);
    setIsStatusFilterOpen(false);
  };

  const handleSortOptionSelect = (timeType: 'startTime' | 'endTime', order: 'asc' | 'desc') => {
    setSortBy(timeType);
    setSortOrder(order);
    closeDropdowns();
  };

  const handlePriorityFilterSelect = (priority: Number) => {
    setFilterPriority(priority);
    closeDropdowns(); 
  };

  const handleStatusFilterSelect = (status: string) => {
    setFilterStatus(status);
    closeDropdowns();
  };

  const getSortButtonText = () => {
    if (sortBy === 'none' || sortOrder === 'none') {
      return (
        <div className='flex items-center space-x-2'><FaSortAlphaDown/><span>Sort</span></div>
      );
    }
    return sortBy === 'startTime'
      ? `Start Time (${sortOrder === 'asc' ? 'Asc' : 'Desc'})`
      : `End Time (${sortOrder === 'asc' ? 'Asc' : 'Desc'})`;
  };

  const getPriorityButtonText = () => {
    return filterPriority === 'none' ? 'Priority' : `Priority: ${filterPriority}`;
  };

  const getStatusButtonText = () => {
    return filterStatus === 'none' ? 'Status' : `Status: ${filterStatus}`;
  };

  const handleCheckboxChange = (taskId: string) => {
    setSelectedTasks((prevSelectedTasks) => {
      if (prevSelectedTasks.includes(taskId)) {
        return prevSelectedTasks.filter((id) => id !== taskId);
      } else {
        return [...prevSelectedTasks, taskId];
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedTasks.length === 0) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tasks`, {
        data: { ids: selectedTasks },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => !selectedTasks.includes(task._id))); 
      setSelectedTasks([]);
    } catch (error) {
      console.error('Error deleting tasks:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowAddForm(true)
              }
              }
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
              >
              <IoMdAdd className="text-xl"/> 
              <span>Add Task</span>
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedTasks.length === 0}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2"
              >
              <FaTrash className="text-md"/> 
              <span>Delete selected </span>
            </button>
          </div>

          <div className="flex space-x-4">
            <div className="relative">
              <button
                onClick={handleSortDropdownToggle}
                className="bg-gray-200 px-4 py-2 rounded-md cursor-pointer w-full text-left"
              >
                {getSortButtonText()}
              </button>
              {isSortOpen && (
                <div className="absolute right-0 bg-white shadow-lg mt-1 rounded-md w-40 z-10">
                  <button
                    onClick={() => handleSortOptionSelect('startTime', 'asc')}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Start Time (Asc)
                  </button>
                  <button
                    onClick={() => handleSortOptionSelect('startTime', 'desc')}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Start Time (Desc)
                  </button>
                  <button
                    onClick={() => handleSortOptionSelect('endTime', 'asc')}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    End Time (Asc)
                  </button>
                  <button
                    onClick={() => handleSortOptionSelect('endTime', 'desc')}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    End Time (Desc)
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('none');
                      setSortOrder('none');
                      closeDropdowns();
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Remove Sort
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
            <button
  onClick={() => handleFilterDropdownToggle('priority')}
  className="bg-gray-200 px-4 py-2 rounded-md cursor-pointer w-full text-left"
>
  {getPriorityButtonText()}
</button>
{isPriorityFilterOpen && (
  <div className="absolute right-0 bg-white shadow-lg mt-1 rounded-md w-40 z-10">
    {[1, 2, 3, 4, 5].map((priority) => (
      <button
        key={priority}
        onClick={() => handlePriorityFilterSelect(priority)}
        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
      >
        {priority}
      </button>
    ))}
    <button
      onClick={() => {
        setFilterPriority('none');
        closeDropdowns(); 
      }}
      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
    >
      Remove Filter
    </button>
  </div>
)}
            </div>

            <div className="relative">
  <button
    onClick={() => handleFilterDropdownToggle('status')}
    className="bg-gray-200 px-4 py-2 rounded-md cursor-pointer w-full text-left"
  >
    {getStatusButtonText()}
  </button>
  {isStatusFilterOpen && (
    <div className="absolute right-0 bg-white shadow-lg mt-1 rounded-md w-40 z-10">
      <button
        onClick={() => handleStatusFilterSelect('Pending')}
        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
      >
        Pending
      </button>
      <button
        onClick={() => handleStatusFilterSelect('Finished')}
        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
      >
        Finished
      </button>
      <button
        onClick={() => {
          setFilterStatus('none');
          closeDropdowns();
        }}
        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
      >
        Remove Filter
      </button>
    </div>
  )}
</div>

          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-r bg-gray-600 text-white text-left text-sm font-medium">
                  <input
                    type="checkbox"
                    onChange={() => {
                      if (selectedTasks.length === tasks.length) {
                        setSelectedTasks([]);
                      } else {
                        setSelectedTasks(tasks.map((task) => task._id));
                      }
                    }}
                    checked={selectedTasks.length === tasks.length}
                  />
                </th>
                <th className="py-2 px-4 border-b border-r bg-gray-600 text-white text-left text-sm font-medium">Task ID</th>
                <th className="py-2 px-4 border-b border-r bg-gray-600 text-white text-left text-sm font-medium">Priority</th>
                <th className="py-2 px-4 border-b border-r bg-gray-600 text-white text-left text-sm font-medium">Status</th>
                <th className="py-2 px-4 border-b border-r bg-gray-600 text-white text-left text-sm font-medium">Start Time</th>
                <th className="py-2 px-4 border-b border-r bg-gray-600 text-white text-left text-sm font-medium">End Time</th>
                <th className="py-2 px-4 border-b border-r bg-gray-600 text-white text-left text-sm font-medium">Total Time</th>
                <th className="py-2 px-4 border-b border-r bg-gray-600 text-white text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredTasks.map((task) => (
                <tr key={task._id}>
                  <td className="py-2 px-4 border-b  border-r border-l">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task._id)}
                      onChange={() => handleCheckboxChange(task._id)}
                    />
                  </td>
                  <td className="py-2 px-4 border-b  border-r text-sm">{task._id}</td>
                  <td className="py-2 px-4 border-b  border-r text-sm">{task.priority}</td>
                  <td className="py-2 px-4 border-b  border-r text-sm">{task.status}</td>
                  <td className="py-2 px-4 border-b  border-r text-sm">{new Date(task.startTime).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b  border-r text-sm">{new Date(task.endTime).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    {calculateTotalTime(task.startTime, task.endTime)} hours
                  </td>
                  <td className="py-2 px-4 border-b  border-r text-sm">
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowEditForm(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <MdModeEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showEditForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center">
  <EditTaskForm
    task={selectedTask}
    onClose={() => setShowEditForm(false)}
    onSubmit={(updatedTask: Task) => {
      setTasks((prevTasks) => prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      ));
      setShowEditForm(false);
    }}
  />
  </div>
)}
{showAddForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center">
  <AddTaskForm
    onClose={() => setShowAddForm(false)}
    onSubmit={() => setShowAddForm(false)}
  />
  </div>
)}
      </div>
    </div>
  );
};

export default TaskList;