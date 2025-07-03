import { useState, useEffect } from "react"
import { removeFromLocalStorage, saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from "../utils/localStorage"
import "../styles/Header.css"

const Header = ({ user, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = getFromLocalStorage(STORAGE_KEYS.THEME, "light")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldUseDark = savedTheme === "dark" || (savedTheme === "system" && prefersDark)

    setIsDarkMode(shouldUseDark)
    document.documentElement.setAttribute("data-theme", shouldUseDark ? "dark" : "light")
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    const theme = newMode ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", theme)
    saveToLocalStorage(STORAGE_KEYS.THEME, theme)
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      removeFromLocalStorage(STORAGE_KEYS.USER)
      onLogout()
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            <span className="title-icon">✓</span>
            Task Tracker
          </h1>
        </div>

        <div className="header-right">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`theme-toggle ${isDarkMode ? "dark" : "light"}`}
            title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          >
            <div className="toggle-track">
              <div className="toggle-thumb">
                <span className="toggle-icon">
                  {isDarkMode ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.64,13l-3.63,3.63-0.71-0.71L20.86,12.36A9,9,0,0,1,12,21c-5,0-9-4-9-9s4-9,9-9a9,9,0,0,1,8.86,7.64l-3.56-3.56,0.71-0.71L21.64,13Z" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18zM12,8c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4c2.2,0,4-1.8,4-4C16,9.8,14.2,8,12,8z" />
                      <path d="M12,4c-0.6,0-1-0.4-1-1V1c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,3.6,12.6,4,12,4z" />
                      <path d="M12,24c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,23.6,12.6,24,12,24z" />
                      <path d="M5.6,6.6c-0.3,0-0.5-0.1-0.7-0.3L3.5,4.9c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C6.1,6.5,5.9,6.6,5.6,6.6z" />
                      <path d="M19.8,20.8c-0.3,0-0.5-0.1-0.7-0.3l-1.4-1.4c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C20.3,20.7,20.1,20.8,19.8,20.8z" />
                      <path d="M3,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S3.6,13,3,13z" />
                      <path d="M23,13h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S23.6,13,23,13z" />
                      <path d="M4.2,20.8c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C4.7,20.7,4.5,20.8,4.2,20.8z" />
                      <path d="M18.4,6.6c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C18.9,6.5,18.6,6.6,18.4,6.6z" />
                    </svg>
                  )}
                </span>
              </div>
            </div>
          </button>

          <div className="user-info">
            <span className="welcome-text">Welcome, {user.username}!</span>
            <button onClick={handleLogout} className="logout-button" title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
