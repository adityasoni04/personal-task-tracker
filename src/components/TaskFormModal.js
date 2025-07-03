import { useEffect } from "react"
import TaskForm from "./TaskForm"
import "../styles/TaskFormModal.css"

const TaskFormModal = ({ isOpen, onClose, onAddTask, editingTask, onUpdateTask }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData)
    } else {
      onAddTask(taskData)
    }
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-backdrop" />
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{editingTask ? "Edit Task" : "Add New Task"}</h3>
          <button className="modal-close" onClick={onClose} title="Close modal">
            ✕
          </button>
        </div>
        <div className="modal-content">
          <TaskForm
            onAddTask={editingTask ? undefined : handleFormSubmit}
            editingTask={editingTask}
            onUpdateTask={editingTask ? handleFormSubmit : undefined}
            onCancelEdit={handleCancel}
            isModal={true}
          />
        </div>
      </div>
    </div>
  )
}

export default TaskFormModal
