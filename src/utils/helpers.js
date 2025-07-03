export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return date.toLocaleDateString("en-US", options)
}

export const validateTask = (task) => {
  if (!task.title || task.title.trim().length === 0) {
    return { isValid: false, error: "Task title is required" }
  }
  if (task.title.trim().length > 100) {
    return { isValid: false, error: "Task title must be less than 100 characters" }
  }
  if (task.description && task.description.length > 500) {
    return { isValid: false, error: "Task description must be less than 500 characters" }
  }
  return { isValid: true, error: null }
}

export const filterTasks = (tasks, filter) => {
  switch (filter) {
    case "completed":
      return tasks.filter((task) => task.completed)
    case "pending":
      return tasks.filter((task) => !task.completed)
    case "all":
    default:
      return tasks
  }
}

export const getTaskCounts = (tasks) => {
  return {
    all: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
  }
}

// Search functionality
export const searchTasks = (tasks, searchTerm) => {
  if (!searchTerm.trim()) return tasks

  const term = searchTerm.toLowerCase().trim()
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(term) ||
      (task.description && task.description.toLowerCase().includes(term)) ||
      (task.category && task.category.toLowerCase().includes(term)),
  )
}

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
}

export const getPriorityColor = (priority) => {
  switch (priority) {
    case PRIORITY_LEVELS.HIGH:
      return "#dc3545"
    case PRIORITY_LEVELS.MEDIUM:
      return "#ffc107"
    case PRIORITY_LEVELS.LOW:
      return "#28a745"
    default:
      return "#6c757d"
  }
}

export const getPriorityLabel = (priority) => {
  switch (priority) {
    case PRIORITY_LEVELS.HIGH:
      return "High Priority"
    case PRIORITY_LEVELS.MEDIUM:
      return "Medium Priority"
    case PRIORITY_LEVELS.LOW:
      return "Low Priority"
    default:
      return "No Priority"
  }
}

// Due date functionality
export const isOverdue = (dueDate) => {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

export const isDueSoon = (dueDate, days = 3) => {
  if (!dueDate) return false
  const due = new Date(dueDate)
  const soon = new Date()
  soon.setDate(soon.getDate() + days)
  return due <= soon && due >= new Date()
}

export const formatDueDate = (dueDate) => {
  if (!dueDate) return null

  const due = new Date(dueDate)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (due.toDateString() === today.toDateString()) {
    return "Due Today"
  } else if (due.toDateString() === tomorrow.toDateString()) {
    return "Due Tomorrow"
  } else if (isOverdue(dueDate)) {
    return "Overdue"
  } else {
    return `Due ${due.toLocaleDateString()}`
  }
}

// Categories/Tags
export const DEFAULT_CATEGORIES = ["Work", "Personal", "Shopping", "Health", "Learning", "Finance", "Travel", "Home"]

export const getRandomColor = () => {
  const colors = ["#007bff", "#28a745", "#dc3545", "#ffc107", "#17a2b8", "#6f42c1", "#e83e8c", "#fd7e14"]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Enhanced task validation
export const validateTaskEnhanced = (task) => {
  if (!task.title || task.title.trim().length === 0) {
    return { isValid: false, error: "Task title is required" }
  }
  if (task.title.trim().length > 100) {
    return { isValid: false, error: "Task title must be less than 100 characters" }
  }
  if (task.description && task.description.length > 500) {
    return { isValid: false, error: "Task description must be less than 500 characters" }
  }
  if (task.dueDate && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0)) {
    return { isValid: false, error: "Due date cannot be in the past" }
  }
  return { isValid: true, error: null }
}
