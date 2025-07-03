import { getTaskCounts, PRIORITY_LEVELS } from "../utils/helpers"
import "../styles/TaskFilter.css"

const TaskFilter = ({ tasks, currentFilter, onFilterChange }) => {
  const counts = getTaskCounts(tasks)

  // Calculate additional counts
  const overdueCount = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date() && !task.completed,
  ).length

  const highPriorityCount = tasks.filter((task) => task.priority === PRIORITY_LEVELS.HIGH).length

  const filters = [
    { key: "all", label: "All Tasks", count: counts.all, icon: "📋" },
    { key: "pending", label: "Pending", count: counts.pending, icon: "⏳" },
    { key: "completed", label: "Completed", count: counts.completed, icon: "✅" },
    { key: "overdue", label: "Overdue", count: overdueCount, icon: "🚨" },
    { key: "high-priority", label: "High Priority", count: highPriorityCount, icon: "🔥" },
  ]

  return (
    <div className="task-filter">
      <div className="filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter.key}
            className={`filter-button ${currentFilter === filter.key ? "active" : ""} ${filter.key === "overdue" && filter.count > 0 ? "urgent" : ""}`}
            onClick={() => onFilterChange(filter.key)}
          >
            <span className="filter-icon">{filter.icon}</span>
            <span className="filter-label">{filter.label}</span>
            <span className="filter-count">{filter.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaskFilter
