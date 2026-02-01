import { createContext, useContext } from 'react'

export const RoutineContext = createContext(null)

export const useRoutine = () => {
  const context = useContext(RoutineContext)

  if (!context) {
    throw new Error('useRoutine must be used inside RoutineProvider')
  }

  return context
}