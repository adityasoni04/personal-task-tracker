import TaskItem from "./TaskItem"
import "../styles/TaskList.css"

const TaskList = ({ tasks, currentFilter, searchTerm, onToggleComplete, onEditTask, onDeleteTask, totalTasks }) => {
  const filteredTasks = tasks

  if (totalTasks === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-state welcome">
          <div className="empty-icon">🎯</div>
          <h3>Welcome to Task Tracker!</h3>
          <p>Start organizing your life by creating your first task.</p>
          <div className="empty-hint">
            <span>💡 Click the</span>
            <span className="hint-button">+ Add Task</span>
            <span>button to get started!</span>
          </div>
        </div>
      </div>
    )
  }

  if (filteredTasks.length === 0) {
    const emptyMessages = {
      completed: {
        icon: "🎉",
        title: "No completed tasks",
        message: "Complete some tasks to see them here!",
      },
      pending: {
        icon: "✅",
        title: "No pending tasks",
        message: "Great job! All your tasks are completed.",
      },
      overdue: {
        icon: "🎊",
        title: "No overdue tasks",
        message: "Excellent! You're staying on top of your deadlines.",
      },
      "high-priority": {
        icon: "🔥",
        title: "No high priority tasks",
        message: "No urgent tasks at the moment. Keep it up!",
      },
    }

    const emptyState = emptyMessages[currentFilter] || {
      icon: "🔍",
      title: "No tasks found",
      message: searchTerm
        ? `No tasks match "${searchTerm}". Try a different search term.`
        : "No tasks match the current filter.",
    }

    return (
      <div className="task-list-empty">
        <div className="empty-state">
          <div className="empty-icon">{emptyState.icon}</div>
          <h3>{emptyState.title}</h3>
          <p>{emptyState.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h3>
          {currentFilter === "all" && "All Tasks"}
          {currentFilter === "completed" && "Completed Tasks"}
          {currentFilter === "pending" && "Pending Tasks"}
          {currentFilter === "overdue" && "Overdue Tasks"}
          {currentFilter === "high-priority" && "High Priority Tasks"}
          <span className="task-count">({filteredTasks.length})</span>
        </h3>
      </div>

      <div className="task-items">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  )
}

export default TaskList
