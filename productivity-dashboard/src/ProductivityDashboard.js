import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle2, Circle, Filter, Star, Briefcase, Home, Target, BarChart3, Clock, ChevronRight, PlayCircle, PauseCircle, Settings, Zap, TrendingUp, CalendarDays, Users, ArrowRight } from 'lucide-react';

const ProductivityDashboard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete quarterly report", priority: "high", category: "work", completed: false, dueDate: "2025-07-10", project: "Q2 Review", estimatedHours: 4, scheduledDate: "2025-07-07", scheduledTime: "09:00" },
    { id: 2, text: "Call dentist for appointment", priority: "medium", category: "personal", completed: false, dueDate: "2025-07-08", project: "Health", estimatedHours: 0.5, scheduledDate: "2025-07-07", scheduledTime: "15:30" },
    { id: 3, text: "Review marketing proposals", priority: "high", category: "work", completed: true, dueDate: "2025-07-07", project: "Marketing", estimatedHours: 2, scheduledDate: "2025-07-06", scheduledTime: "14:00" },
    { id: 4, text: "Grocery shopping", priority: "low", category: "personal", completed: false, dueDate: "2025-07-09", project: "Household", estimatedHours: 1, scheduledDate: "2025-07-08", scheduledTime: "10:00" },
    { id: 5, text: "Prepare presentation slides", priority: "high", category: "work", completed: false, dueDate: "2025-07-11", project: "Client Meeting", estimatedHours: 3, scheduledDate: "2025-07-08", scheduledTime: "13:00" },
    { id: 6, text: "Exercise 30 minutes", priority: "medium", category: "personal", completed: false, dueDate: "2025-07-07", project: "Health", estimatedHours: 0.5, scheduledDate: "2025-07-07", scheduledTime: "07:00" }
  ]);

  const [weeklyGoals, setWeeklyGoals] = useState([
    {
      id: 1,
      title: "Complete Q2 Business Review",
      description: "Finish all quarterly analysis and reporting",
      dueDate: "2025-07-11",
      category: "work",
      progress: 40,
      tasks: [1, 3, 5]
    },
    {
      id: 2,
      title: "Health & Wellness Week",
      description: "Focus on physical and mental health routines",
      dueDate: "2025-07-13",
      category: "personal",
      progress: 25,
      tasks: [2, 6]
    }
  ]);
  
  const [newTask, setNewTask] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedView, setSelectedView] = useState('today');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('work');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('');
  const [newTaskHours, setNewTaskHours] = useState(1);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', dueDate: '', category: 'work' });

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        priority: newTaskPriority,
        category: newTaskCategory,
        completed: false,
        dueDate: newTaskDate,
        project: newTaskProject,
        estimatedHours: newTaskHours,
        scheduledDate: autoScheduleTask(),
        scheduledTime: generateTimeSlot()
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setNewTaskDate('');
      setNewTaskProject('');
      setNewTaskHours(1);
    }
  };

  const addWeeklyGoal = () => {
    if (newGoal.title.trim()) {
      const goal = {
        id: Date.now(),
        ...newGoal,
        progress: 0,
        tasks: []
      };
      setWeeklyGoals([...weeklyGoals, goal]);
      setNewGoal({ title: '', description: '', dueDate: '', category: 'work' });
      setShowNewGoalForm(false);
    }
  };

  const autoScheduleTask = () => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  };

  const generateTimeSlot = () => {
    const hours = Math.floor(Math.random() * 8) + 9;
    const minutes = Math.random() > 0.5 ? '00' : '30';
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTaskPriority = (id, newPriority) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority: newPriority } : task
    ));
  };

  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.scheduledDate === today);
  };

  const getWeekTasks = () => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduledDate);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });
  };

  const filteredTasks = () => {
    let taskList = selectedView === 'today' ? getTodayTasks() : 
                   selectedView === 'week' ? getWeekTasks() : tasks;
    
    if (selectedFilter !== 'all') {
      taskList = taskList.filter(task => task.category === selectedFilter);
    }
    
    return taskList.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed - b.completed;
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const workTasks = tasks.filter(t => t.category === 'work').length;
    const personalTasks = tasks.filter(t => t.category === 'personal').length;
    const todayTasks = getTodayTasks().length;
    const todayCompleted = getTodayTasks().filter(t => t.completed).length;
    
    return { total, completed, workTasks, personalTasks, todayTasks, todayCompleted };
  };

  const stats = getStats();

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-64 bg-black border-r border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold flex items-center">
              <Zap className="w-6 h-6 mr-2 text-blue-400" />
              Motion Workspace
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Views</h3>
              <div className="space-y-1">
                {['today', 'week', 'all'].map(view => (
                  <button
                    key={view}
                    onClick={() => setSelectedView(view)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                      selectedView === view ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {view === 'today' && <Calendar className="w-4 h-4 mr-2" />}
                    {view === 'week' && <CalendarDays className="w-4 h-4 mr-2" />}
                    {view === 'all' && <Target className="w-4 h-4 mr-2" />}
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Filters</h3>
              <div className="space-y-1">
                {[
                  { key: 'all', label: 'All Tasks', icon: Target },
                  { key: 'work', label: 'Work', icon: Briefcase },
                  { key: 'personal', label: 'Personal', icon: Home }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                      selectedFilter === filter.key ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <filter.icon className="w-4 h-4 mr-2" />
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Goals */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Weekly Goals</h3>
                <button
                  onClick={() => setShowNewGoalForm(true)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {weeklyGoals.map(goal => (
                  <div key={goal.id} className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                    <h4 className="text-sm font-medium text-white mb-1">{goal.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>{goal.category}</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-800">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">{stats.todayCompleted}/{stats.todayTasks}</div>
                <div className="text-gray-400">Today</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{stats.completed}</div>
                <div className="text-gray-400">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-gray-900 border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedView === 'today' ? 'Today\'s Schedule' : 
                   selectedView === 'week' ? 'This Week' : 'All Tasks'}
                </h2>
                <p className="text-gray-400 mt-1">
                  {selectedView === 'today' ? `${stats.todayTasks} tasks scheduled` :
                   selectedView === 'week' ? `${getWeekTasks().length} tasks this week` :
                   `${stats.total} total tasks`}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Calendar/Task View */}
            <div className="flex-1 p-6 bg-gray-900">
              {/* Quick Add Task */}
              <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-blue-400" />
                  Quick Add Task
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="p-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="p-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="date"
                      value={newTaskDate}
                      onChange={(e) => setNewTaskDate(e.target.value)}
                      className="p-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={newTaskProject}
                      onChange={(e) => setNewTaskProject(e.target.value)}
                      placeholder="Project (optional)"
                      className="p-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={newTaskHours}
                      onChange={(e) => setNewTaskHours(parseFloat(e.target.value) || 1)}
                      placeholder="Hours"
                      min="0.5"
                      max="8"
                      step="0.5"
                      className="p-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={addTask}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Task (AI will schedule automatically)
                  </button>
                </div>
              </div>

              {/* Task List/Calendar */}
              <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-lg font-semibold flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2 text-blue-400" />
                    {selectedView === 'today' ? 'Today\'s Schedule' : 'Tasks'}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {filteredTasks().map(task => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg border transition-all ${
                          task.completed ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-900 border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`${task.completed ? 'text-green-400' : 'text-gray-400 hover:text-green-400'}`}
                            >
                              {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {(selectedView === 'today' || selectedView === 'week') && task.scheduledTime && (
                                  <span className="text-blue-400 font-medium text-sm">
                                    {formatTime(task.scheduledTime)}
                                  </span>
                                )}
                                <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                                  {task.text}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  task.category === 'work' ? 'bg-blue-900/20 text-blue-400' : 'bg-purple-900/20 text-purple-400'
                                }`}>
                                  {task.category}
                                </span>
                                {task.project && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                    {task.project}
                                  </span>
                                )}
                                <span className="text-xs text-gray-400 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {task.estimatedHours}h
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {task.dueDate && (
                              <span className="text-sm text-gray-400">
                                Due: {task.dueDate}
                              </span>
                            )}
                            <select
                              value={task.priority}
                              onChange={(e) => updateTaskPriority(task.id, e.target.value)}
                              className="text-sm bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                            >
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredTasks().length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <Target className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                        <p>No tasks found for the selected view</p>
                        <p className="text-sm mt-2">Add a new task to get started</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-80 bg-gray-900 border-l border-gray-800 p-6">
              {/* AI Insights */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  AI Insights
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <p className="text-sm text-blue-300">
                      <strong>Productivity Tip:</strong> You have 3 high-priority tasks scheduled for today. Consider time-blocking 2-hour focus sessions.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                    <p className="text-sm text-yellow-300">
                      <strong>Schedule Alert:</strong> Your calendar is 80% full tomorrow. Consider rescheduling low-priority tasks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-red-400" />
                  Upcoming Deadlines
                </h3>
                <div className="space-y-3">
                  {tasks
                    .filter(task => task.dueDate && !task.completed)
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .slice(0, 5)
                    .map(task => (
                      <div key={task.id} className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
                        <p className="text-sm font-medium text-white mb-1">{task.text}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-400">{task.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  {tasks.filter(task => task.dueDate && !task.completed).length === 0 && (
                    <p className="text-gray-500 text-center py-4 text-sm">No upcoming deadlines</p>
                  )}
                </div>
              </div>

              {/* Focus Time */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <PlayCircle className="w-5 h-5 mr-2 text-green-400" />
                  Focus Session
                </h3>
                <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-300 mb-3">Ready to start a focused work session?</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
                    Start 25-min Focus Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Goal Modal */}
      {showNewGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Create Weekly Goal</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="Goal title"
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Goal description"
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                  className="p-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="p-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={addWeeklyGoal}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Goal
                </button>
                <button
                  onClick={() => setShowNewGoalForm(false)}
                  className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivityDashboard;