import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { NotificationContext } from './NotificationContext'
import { useAuth } from './AuthContext'

const API = 'http://localhost:3001'

// Load settings from localStorage OUTSIDE the component
// This avoids calling setState inside useEffect on mount
const loadSettings = () => {
  try {
    const saved = localStorage.getItem('momentum_notification_settings')
    if (saved) return JSON.parse(saved)
  } catch {
    // Ignore parsing errors and use default settings
  }
  return {
    browserNotifications: true,
    emailReminders: true,
    reminderTimes: ['09:00', '21:00'],
    dailyDigest: true,
    digestTime: '08:00',
  }
}

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth()

  // Initialize settings directly from localStorage — no useEffect needed
  const [settings, setSettings] = useState(loadSettings)
  const [toasts, setToasts] = useState([])
  const [permission, setPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission
    }
    return 'default'
  })

  // Ref to hold the latest user so async callbacks don't go stale
  const userRef = useRef(user)
  useEffect(() => {
    userRef.current = user
  }, [user])

  // Ref to hold latest settings so async callbacks don't go stale
  const settingsRef = useRef(settings)
  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('momentum_notification_settings', JSON.stringify(settings))
  }, [settings])

  // --- Request browser notification permission ---
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return { success: false, error: 'Not supported' }
    }
    const result = await Notification.requestPermission()
    setPermission(result)
    return { success: result === 'granted' }
  }, [])

  // --- Send a browser notification ---
  const sendBrowserNotification = useCallback((title, options = {}) => {
    if (Notification.permission !== 'granted' || !settingsRef.current.browserNotifications) return
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        vibrate: [200, 100, 200],
        ...options,
      })
    } catch (err) {
      console.error('Notification error:', err)
    }
  }, []) // no deps — reads from ref

  // --- Send email reminder via backend ---
  const sendEmailReminder = useCallback(async (habitName, reminderTime) => {
    const currentUser = userRef.current
    if (!currentUser || !settingsRef.current.emailReminders) return
    try {
      const token = localStorage.getItem('momentum_token')
      await fetch(`${API}/api/notifications/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: currentUser.email,
          userName: currentUser.name,
          habitName,
          reminderTime,
        }),
      })
    } catch (err) {
      console.error('Email reminder error:', err)
    }
  }, []) // no deps — reads from refs

  // --- Send daily digest via backend ---
  const sendDailyDigest = useCallback(async (habits) => {
    const currentUser = userRef.current
    const currentSettings = settingsRef.current
    if (!currentUser || !currentSettings.dailyDigest || !currentSettings.emailReminders) return
    try {
      const token = localStorage.getItem('momentum_token')
      await fetch(`${API}/api/notifications/daily-digest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: currentUser.email,
          userName: currentUser.name,
          habits: habits.map((h) => ({
            name: h.name,
            completed: h.isCompletedToday,
            currentStreak: h.currentStreak,
            longestStreak: h.longestStreak,
          })),
          date: new Date().toISOString(),
        }),
      })
    } catch (err) {
      console.error('Daily digest error:', err)
    }
  }, []) // no deps — reads from refs

  // --- Check habits and fire reminders if time matches ---
  const checkAndRemind = useCallback((habits) => {
    const currentSettings = settingsRef.current
    if (!currentSettings.browserNotifications && !currentSettings.emailReminders) return

    const now = new Date()
    const hh = now.getHours().toString().padStart(2, '0')
    const mm = now.getMinutes().toString().padStart(2, '0')
    const currentTime = `${hh}:${mm}`

    const incomplete = habits.filter((h) => !h.isCompletedToday)
    if (incomplete.length === 0) return

    currentSettings.reminderTimes.forEach((time) => {
      if (currentTime !== time) return

      if (currentSettings.browserNotifications) {
        sendBrowserNotification(
          `${incomplete.length} habit${incomplete.length > 1 ? 's' : ''} remaining!`,
          { body: incomplete.map((h) => h.name).join(', '), tag: 'habit-reminder' }
        )
      }

      if (currentSettings.emailReminders) {
        incomplete.forEach((h) => sendEmailReminder(h.name, time))
      }
    })
  }, [sendBrowserNotification, sendEmailReminder])

  // --- In-app toast notifications ---
  const addToast = useCallback((toast) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [{ id, ...toast }, ...prev])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // --- Update settings ---
  const updateSettings = useCallback((updates) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }, [])

  const value = useMemo(
    () => ({
      permission,
      toasts,
      settings,
      requestPermission,
      sendBrowserNotification,
      sendEmailReminder,
      sendDailyDigest,
      checkAndRemind,
      addToast,
      removeToast,
      updateSettings,
    }),
    [
      permission,
      toasts,
      settings,
      requestPermission,
      sendBrowserNotification,
      sendEmailReminder,
      sendDailyDigest,
      checkAndRemind,
      addToast,
      removeToast,
      updateSettings,
    ]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider