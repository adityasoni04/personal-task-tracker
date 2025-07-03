import { useState } from "react"
import { formatDate, getPriorityColor, getPriorityLabel, formatDueDate, isOverdue, isDueSoon } from "../utils/helpers"
import "../styles/TaskItem.css"

const TaskItem = ({ task, onToggleComplete, onEditTask, onDeleteTask }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleComplete = () => {
    onToggleComplete(task.id)
  }

  const handleEdit = () => {
    onEditTask(task)
  }

  const handleDelete = async () => {
    const confirmMessage = `Are you sure you want to delete "${task.title}"?`

    if (window.confirm(confirmMessage)) {
      setIsDeleting(true)
      setTimeout(() => {
        onDeleteTask(task.id)
        setIsDeleting(false)
      }, 200)
    }
  }

  const getDueDateClass = () => {
    if (!task.dueDate) return ""
    if (isOverdue(task.dueDate)) return "overdue"
    if (isDueSoon(task.dueDate)) return "due-soon"
    return ""
  }

  return (
    <div
      className={`task-item ${task.completed ? "completed" : "pending"} ${isDeleting ? "deleting" : ""} ${getDueDateClass()}`}
    >
      <div className="task-content">
        <div className="task-header">
          <div className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={isDeleting}
              id={`task-${task.id}`}
            />
            <label htmlFor={`task-${task.id}`} className="checkbox-label">
              <span className="checkmark"></span>
            </label>
          </div>

          <div className="task-info">
            <div className="task-title-row">
              <h4 className="task-title">{task.title}</h4>
              {task.priority && (
                <span
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                  title={getPriorityLabel(task.priority)}
                >
                  {task.priority.toUpperCase()}
                </span>
              )}
            </div>
            {task.description && <p className="task-description">{task.description}</p>}

            <div className="task-badges">
              {task.category && (
                <span className="category-badge" title="Category">
                  🏷️ {task.category}
                </span>
              )}
              {task.dueDate && (
                <span className={`due-date-badge ${getDueDateClass()}`} title="Due Date">
                  📅 {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="task-meta">
          <span className="task-date">Created: {formatDate(task.createdAt)}</span>
          <div className="task-status">
            <span className={`status-badge ${task.completed ? "completed" : "pending"}`}>
              {task.completed ? "Completed" : "Pending"}
            </span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button onClick={handleEdit} className="action-button edit-button" disabled={isDeleting} title="Edit task">
          ✏️
        </button>

        <button
          onClick={handleDelete}
          className="action-button delete-button"
          disabled={isDeleting}
          title="Delete task"
        >
          {isDeleting ? "⏳" : "🗑️"}
        </button>
      </div>
    </div>
  )
}

export default TaskItem
