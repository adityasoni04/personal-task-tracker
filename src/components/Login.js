import { useState } from "react"
import { saveToLocalStorage, STORAGE_KEYS } from "../utils/localStorage"
import "../styles/Login.css"

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters long")
      return
    }

    if (username.trim().length > 50) {
      setError("Username must be less than 50 characters")
      return
    }

    setIsLoading(true)

    // Simulate a brief loading state
    setTimeout(() => {
      const userData = {
        username: username.trim(),
        loginTime: new Date().toISOString(),
      }

      const saved = saveToLocalStorage(STORAGE_KEYS.USER, userData)

      if (saved) {
        onLogin(userData)
      } else {
        setError("Failed to save user data. Please try again.")
      }

      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Personal Task Tracker</h1>
          <p>Enter your username to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>No registration required - just enter any username!</p>
        </div>
      </div>
    </div>
  )
}

export default Login
