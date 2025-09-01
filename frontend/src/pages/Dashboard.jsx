import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Plus,
  HomeIcon,
  Filter,
  Calendar as CalendarIcon
} from 'lucide-react';
import {
  ADD_BUTTON,
  HEADER,
  ICON_WRAPPER,
  STAT_CARD,
  STATS_GRID,
  VALUE_CLASS,
  WRAPPER,
  STATS,
  FILTER_OPTIONS,
  FILTER_LABELS,
  TABS_WRAPPER,
  TAB_BASE,
  TAB_ACTIVE,
  TAB_INACTIVE,
  SELECT_CLASSES,
  FILTER_WRAPPER,
  EMPTY_STATE,
} from '../assets/dummy';

import { useOutletContext } from 'react-router-dom';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api/tasks';

const Dashboard = () => {
  // Get tasks & refresh from context
  const { tasks: contextTasks = [], refreshTasks } = useOutletContext();

  // Keep a local copy so we can update instantly
  const [tasks, setTasks] = useState(contextTasks);

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');

  // Sync local tasks whenever context updates
  useEffect(() => {
    setTasks(contextTasks);
  }, [contextTasks]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      lowPriority: tasks.filter((t) => t.priority?.toLowerCase() === 'low').length,
      mediumPriority: tasks.filter((t) => t.priority?.toLowerCase() === 'medium').length,
      highPriority: tasks.filter((t) => t.priority?.toLowerCase() === 'high').length,
      completed: tasks.filter(
        (t) =>
          t.completed === true ||
          t.completed === 'yes' ||
          (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
      ).length
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      switch (filter) {
        case 'today':
          return dueDate.toDateString() === today.toDateString();
        case 'week':
          return dueDate >= today && dueDate <= nextWeek;
        case 'high':
        case 'medium':
        case 'low':
          return task.priority?.toLowerCase() === filter;
        default:
          return true;
      }
    });
  }, [tasks, filter]);

  const handleTaskSave = useCallback(async (taskData) => {
    try {
      let savedTask;

      if (taskData.id || taskData._id) {
        const id = taskData.id || taskData._id;
        const res = await axios.put(`${API_BASE}/${id}`, taskData);
        savedTask = res.data;
        // Update locally
        setTasks(prev =>
          prev.map(task => (task._id === savedTask._id ? savedTask : task))
        );
      } else {
        const res = await axios.post(`${API_BASE}`, taskData);
        savedTask = res.data;
        // Add to local state instantly
        setTasks(prev => [savedTask, ...prev]);
      }

      // Close modal
      setShowModal(false);
      setSelectedTask(null);

      // Optional: still call refresh to stay in sync with server
      refreshTasks();

    } catch (error) {
      console.error("Error saving task:", error);
    }
  }, [refreshTasks]);

  return (
    <div className={WRAPPER}>
      {/* HEADER */}
      <div className={HEADER}>
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HomeIcon className="text-purple-500 w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span className="truncate">Task Overview</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-7 truncate">Manage your tasks</p>
        </div>
        <button onClick={() => setShowModal(true)} className={ADD_BUTTON}>
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      {/* STATS GRID */}
      <div className={STATS_GRID}>
        {STATS.map(({ key, label, icon: Icon, iconColor, borderColor = 'border-purple-100', valueKey, textColor, gradient }) => (
          <div key={key} className={`${STAT_CARD} ${borderColor}`}>
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`${ICON_WRAPPER} ${iconColor}`}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <p
                  className={`${VALUE_CLASS} ${
                    gradient
                      ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent'
                      : textColor
                  }`}
                >
                  {stats[valueKey]}
                </p>
                <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div className="space-y-6">
        <div className={FILTER_WRAPPER}>
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="w-5 h-5 text-purple-500 shrink-0" />
            <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
              {FILTER_LABELS[filter] || 'All Tasks'}
            </h2>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={SELECT_CLASSES}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>

          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`${TAB_BASE} ${filter === opt ? TAB_ACTIVE : TAB_INACTIVE}`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* TASKS LIST */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <CalendarIcon className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No task available</h3>
              <p className="text-sm text-gray-500 mb-4">
                {filter === 'all' ? 'Create new task' : 'No task matches this search'}
              </p>
              <button onClick={() => setShowModal(true)} className={EMPTY_STATE.btn}>
                ADD NEW TASK
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onEdit={() => {
                  setSelectedTask(task);
                  setShowModal(true);
                }}
              />
            ))
          )}
        </div>

        {/* ADD BUTTON DESKTOP */}
        <div
          onClick={() => setShowModal(true)}
          className="hidden md:flex items-center justify-center p-4 border-2 border-dashed border-purple-200
          rounded-xl hover:border-purple-400 bg-purple-50/50 cursor-pointer transition-colors"
        >
          <Plus className="w-5 h-5 text-purple-500 mr-2" />
          <span className="text-gray-600 font-medium">Add New Task</span>
        </div>
      </div>

      {/* MODAL */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default Dashboard;
