import { createContext, useContext } from 'react'

export const HabitContext = createContext(null)

export const useHabits = () => {
  const context = useContext(HabitContext)

  if (!context) {
    throw new Error('useHabits must be used inside HabitProvider')
  }

  return context
}