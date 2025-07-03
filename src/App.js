import { useState, useEffect, useMemo, useRef } from "react"
import Login from "./components/Login"
import Header from "./components/Header"
import TaskList from "./components/TaskList"
import TaskFormModal from "./components/TaskFormModal"
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from "./utils/localStorage"
import { generateId, searchTasks, getTaskCounts, PRIORITY_LEVELS } from "./utils/helpers"
import "./styles/App.css"

// Dummy data
const sampleTasks = [
  {
    id: generateId(),
    title: "Complete React assignment",
    description: "Build a personal task tracker using React.js with all required features including bonus features",
    completed: false,
    priority: PRIORITY_LEVELS.HIGH,
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    category: "Work",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: generateId(),
    title: "Review JavaScript fundamentals",
    description: "Go through ES6+ features and async programming concepts",
    completed: true,
    priority: PRIORITY_LEVELS.MEDIUM,
    dueDate: null,
    category: "Learning",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: generateId(),
    title: "Practice coding challenges",
    description: "Solve 5 algorithm problems on LeetCode to improve problem-solving skills",
    completed: false,
    priority: PRIORITY_LEVELS.LOW,
    dueDate: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    category: "Learning",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: generateId(),
    title: "Buy groceries",
    description: "Milk, bread, eggs, fruits, vegetables",
    completed: false,
    priority: PRIORITY_LEVELS.MEDIUM,
    dueDate: new Date(Date.now() + 43200000).toISOString().split("T")[0],
    category: "Shopping",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [currentFilter, setCurrentFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingTask, setEditingTask] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef(null)

  // Load user and tasks from localStorage on app start
  useEffect(() => {
    const savedUser = getFromLocalStorage(STORAGE_KEYS.USER)
    const savedTasks = getFromLocalStorage(STORAGE_KEYS.TASKS, [])

    if (savedUser) {
      setUser(savedUser)
    }

    if (savedTasks.length === 0 && savedUser) {
      setTasks(sampleTasks)
      saveToLocalStorage(STORAGE_KEYS.TASKS, sampleTasks)
    } else {
      setTasks(savedTasks)
    }

    setIsLoading(false)
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!isLoading && user) {
      saveToLocalStorage(STORAGE_KEYS.TASKS, tasks)
    }
  }, [tasks, isLoading, user])

  // Handle click outside filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Memoized filtered and searched tasks
  const filteredAndSearchedTasks = useMemo(() => {
    let filtered = tasks

    if (searchTerm.trim()) {
      filtered = searchTasks(filtered, searchTerm)
    }

    switch (currentFilter) {
      case "completed":
        filtered = filtered.filter((task) => task.completed)
        break
      case "pending":
        filtered = filtered.filter((task) => !task.completed)
        break
      case "overdue":
        filtered = filtered.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && !task.completed)
        break
      case "high-priority":
        filtered = filtered.filter((task) => task.priority === PRIORITY_LEVELS.HIGH)
        break
      default:
        break
    }

    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority] || 0
      const bPriority = priorityOrder[b.priority] || 0

      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }

      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (a.dueDate) return -1
      if (b.dueDate) return 1

      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [tasks, currentFilter, searchTerm])

  const handleLogin = (userData) => {
    setUser(userData)
    const savedTasks = getFromLocalStorage(STORAGE_KEYS.TASKS, [])
    if (savedTasks.length === 0) {
      setTasks(sampleTasks)
      saveToLocalStorage(STORAGE_KEYS.TASKS, sampleTasks)
    } else {
      setTasks(savedTasks)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setTasks([])
    setCurrentFilter("all")
    setSearchTerm("")
    setEditingTask(null)
    setIsTaskModalOpen(false)
  }

  const handleAddTask = (taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      category: taskData.category,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks((prevTasks) => [newTask, ...prevTasks])
  }

  const handleUpdateTask = (taskId, taskData) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, ...taskData } : task)))
    setEditingTask(null)
  }

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    if (editingTask && editingTask.id === taskId) {
      setEditingTask(null)
    }
  }

  const handleToggleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    )
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleOpenAddTaskModal = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const handleFilterSelect = (filterKey) => {
    setCurrentFilter(filterKey)
    setIsFilterOpen(false)
  }

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading Task Tracker...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="App">
        <Login onLogin={handleLogin} />
      </div>
    )
  }

  // Filter options - inline calculation
  const counts = getTaskCounts(tasks)
  const overdueCount = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date() && !task.completed,
  ).length
  const highPriorityCount = tasks.filter((task) => task.priority === PRIORITY_LEVELS.HIGH).length

  const filters = [
    { key: "all", label: "All", count: counts.all, icon: "📋", color: "#6b7280" },
    { key: "pending", label: "Pending", count: counts.pending, icon: "⏳", color: "#f59e0b" },
    { key: "completed", label: "Completed", count: counts.completed, icon: "✅", color: "#10b981" },
    { key: "overdue", label: "Overdue", count: overdueCount, icon: "🚨", color: "#ef4444" },
    { key: "high-priority", label: "High Priority", count: highPriorityCount, icon: "🔥", color: "#8b5cf6" },
  ]

  const activeFilter = filters.find((f) => f.key === currentFilter) || filters[0]

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} />

      <main className="main-content">
        <div className="container">
          {/* Add Task Button */}
          <button className="add-task-btn" onClick={handleOpenAddTaskModal} title="Add new task">
            <svg className="add-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="add-text">{tasks.length === 0 ? "Create First Task" : "Add Task"}</span>
          </button>

          {/* Search and Filter */}
          {tasks.length > 0 && (
            <div className="search-and-filter">
              <div className="search-section">
                <div className="search-input-wrapper">
                  <svg
                    className="search-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button onClick={clearSearch} className="clear-search-btn" title="Clear search">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-section" ref={filterRef}>
                <button
                  className={`filter-trigger ${isFilterOpen ? "active" : ""}`}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <span className="filter-icon">{activeFilter.icon}</span>
                  <span className="filter-label">{activeFilter.label}</span>
                  <span className="filter-count" style={{ backgroundColor: activeFilter.color }}>
                    {activeFilter.count}
                  </span>
                  <svg
                    className={`dropdown-icon ${isFilterOpen ? "rotated" : ""}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </button>

                {isFilterOpen && (
                  <div className="filter-dropdown">
                    {filters.map((filter) => (
                      <button
                        key={filter.key}
                        className={`filter-option ${currentFilter === filter.key ? "active" : ""} ${
                          filter.key === "overdue" && filter.count > 0 ? "urgent" : ""
                        }`}
                        onClick={() => handleFilterSelect(filter.key)}
                      >
                        <span className="option-icon">{filter.icon}</span>
                        <span className="option-label">{filter.label}</span>
                        <span className="option-count" style={{ backgroundColor: filter.color }}>
                          {filter.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <TaskList
            tasks={filteredAndSearchedTasks}
            currentFilter={currentFilter}
            searchTerm={searchTerm}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            totalTasks={tasks.length}
          />
        </div>
      </main>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onAddTask={handleAddTask}
        editingTask={editingTask}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  )
}

export default App
