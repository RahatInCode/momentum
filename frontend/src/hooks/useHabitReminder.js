import { useEffect, useRef } from 'react'
import { useHabits } from '../components/context/HabitContext'
import { useNotifications } from '../components/context/NotificationContext'

/**
 * Drop this hook into any component that is always mounted (like AppContent).
 * It automatically checks every 60 seconds whether the current time
 * matches one of the user's configured reminder times, and if so,
 * fires browser notifications + email reminders for any incomplete habits.
 */
export const useHabitReminders = () => {
  const { habits } = useHabits()
  const { checkAndRemind, settings } = useNotifications()
  const intervalRef = useRef(null)

  useEffect(() => {
    // Don't run if both channels are off
    if (!settings.browserNotifications && !settings.emailReminders) return

    // Run once immediately on mount
    checkAndRemind(habits)

    // Then run every 60 seconds
    intervalRef.current = setInterval(() => {
      checkAndRemind(habits)
    }, 60 * 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [habits, checkAndRemind, settings])
}

export default useHabitReminders