import { useState, useEffect } from "react"
import { validateTaskEnhanced, PRIORITY_LEVELS, DEFAULT_CATEGORIES } from "../utils/helpers"
import "../styles/TaskForm.css"

const TaskForm = ({ onAddTask, editingTask, onUpdateTask, onCancelEdit, isModal = false }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description || "")
      setPriority(editingTask.priority || "")
      setDueDate(editingTask.dueDate || "")
      setCategory(editingTask.category || "")
      setCustomCategory("")
    } else {
      setTitle("")
      setDescription("")
      setPriority("")
      setDueDate("")
      setCategory("")
      setCustomCategory("")
    }
    setError("")
  }, [editingTask])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const finalCategory = customCategory.trim() || category

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority: priority || null,
      dueDate: dueDate || null,
      category: finalCategory || null,
    }

    const validation = validateTaskEnhanced(taskData)

    if (!validation.isValid) {
      setError(validation.error)
      setIsSubmitting(false)
      return
    }

    setTimeout(() => {
      if (editingTask && onUpdateTask) {
        onUpdateTask(taskData)
      } else if (onAddTask) {
        onAddTask(taskData)
      }

      // Reset form only if not editing or if successfully updated
      if (!editingTask) {
        setTitle("")
        setDescription("")
        setPriority("")
        setDueDate("")
        setCategory("")
        setCustomCategory("")
      }

      setError("")
      setIsSubmitting(false)
    }, 200)
  }

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    setPriority("")
    setDueDate("")
    setCategory("")
    setCustomCategory("")
    setError("")
    if (onCancelEdit) {
      onCancelEdit()
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  return (
    <div className={`task-form-container ${isModal ? "modal-form" : ""}`}>
      <form onSubmit={handleSubmit} className="task-form">
        {!isModal && (
          <div className="form-header">
            <h3>{editingTask ? "Edit Task" : "Add New Task"}</h3>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-title">Task Title *</label>
            <input
              type="text"
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              disabled={isSubmitting}
              maxLength={100}
              autoFocus={!editingTask}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">No Priority</option>
              <option value={PRIORITY_LEVELS.HIGH}>High Priority</option>
              <option value={PRIORITY_LEVELS.MEDIUM}>Medium Priority</option>
              <option value={PRIORITY_LEVELS.LOW}>Low Priority</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            disabled={isSubmitting}
            maxLength={500}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-due-date">Due Date</label>
            <input
              type="date"
              id="task-due-date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isSubmitting}
              min={getTomorrowDate()}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-category">Category</label>
            <select
              id="task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select Category</option>
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="custom">Custom Category</option>
            </select>
          </div>
        </div>

        {category === "custom" && (
          <div className="form-group">
            <label htmlFor="custom-category">Custom Category</label>
            <input
              type="text"
              id="custom-category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category"
              disabled={isSubmitting}
              maxLength={50}
            />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingTask ? "Update Task" : "Add Task"}
          </button>

          <button type="button" className="cancel-button" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm
