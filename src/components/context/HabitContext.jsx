import { createContext, useContext, useMemo } from 'react'
import { useLocalStorageReducer } from '../hooks/useLocalStorage'
import { getToday, calculateStreak, calculateLongestStreak } from '../utils/dateUtils'
import { HABIT_TYPES } from '../utils/constants'

const HabitContext = createContext(null)

const ACTIONS = {
  ADD_HABIT: 'ADD_HABIT',
  UPDATE_HABIT: 'UPDATE_HABIT',
  DELETE_HABIT: 'DELETE_HABIT',
  TOGGLE_COMPLETION: 'TOGGLE_COMPLETION',
  RECORD_URGE: 'RECORD_URGE',
  REORDER_HABITS: 'REORDER_HABITS',
}

const habitReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_HABIT:
      return {
        ...state,
        habits: [
          ...state.habits,
          {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completedDates: [],
            urgesResisted: [],
            ...action.payload,
          },
        ],
      }

    case ACTIONS.UPDATE_HABIT:
      return {
        ...state,
        habits: state.habits.map((habit) =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload.updates }
            : habit
        ),
      }

    case ACTIONS.DELETE_HABIT:
      return {
        ...state,
        habits: state.habits.filter((habit) => habit.id !== action.payload.id),
      }

    case ACTIONS.TOGGLE_COMPLETION: {
      const today = getToday()
      return {
        ...state,
        habits: state.habits.map((habit) => {
          if (habit.id !== action.payload.id) return habit

          const alreadyCompleted = habit.completedDates.includes(today)
          return {
            ...habit,
            completedDates: alreadyCompleted
              ? habit.completedDates.filter((d) => d !== today)
              : [...habit.completedDates, today],
          }
        }),
      }
    }

    case ACTIONS.RECORD_URGE: {
      return {
        ...state,
        habits: state.habits.map((habit) => {
          if (habit.id !== action.payload.id) return habit
          return {
            ...habit,
            urgesResisted: [
              ...habit.urgesResisted,
              {
                timestamp: new Date().toISOString(),
                note: action.payload.note || null,
              },
            ],
          }
        }),
      }
    }

    case ACTIONS.REORDER_HABITS:
      return {
        ...state,
        habits: action.payload.habits,
      }

    default:
      return state
  }
}

const initialState = {
  habits: [],
}

export const HabitProvider = ({ children }) => {
  const [state, dispatch] = useLocalStorageReducer(
    'momentum_habits',
    habitReducer,
    initialState
  )

  const actions = useMemo(
    () => ({
      addHabit: (habit) => dispatch({ type: ACTIONS.ADD_HABIT, payload: habit }),
      updateHabit: (id, updates) =>
        dispatch({ type: ACTIONS.UPDATE_HABIT, payload: { id, updates } }),
      deleteHabit: (id) => dispatch({ type: ACTIONS.DELETE_HABIT, payload: { id } }),
      toggleCompletion: (id) =>
        dispatch({ type: ACTIONS.TOGGLE_COMPLETION, payload: { id } }),
      recordUrge: (id, note) =>
        dispatch({ type: ACTIONS.RECORD_URGE, payload: { id, note } }),
      reorderHabits: (habits) =>
        dispatch({ type: ACTIONS.REORDER_HABITS, payload: { habits } }),
    }),
    [dispatch]
  )

  const habitsWithStats = useMemo(() => {
    return state.habits.map((habit) => ({
      ...habit,
      currentStreak: calculateStreak(habit.completedDates),
      longestStreak: calculateLongestStreak(habit.completedDates),
      isCompletedToday: habit.completedDates.includes(getToday()),
      totalCompletions: habit.completedDates.length,
      totalUrgesResisted: habit.urgesResisted?.length || 0,
    }))
  }, [state.habits])

  const buildHabits = useMemo(
    () => habitsWithStats.filter((h) => h.type === HABIT_TYPES.BUILD),
    [habitsWithStats]
  )

  const breakHabits = useMemo(
    () => habitsWithStats.filter((h) => h.type === HABIT_TYPES.BREAK),
    [habitsWithStats]
  )

  const value = useMemo(
    () => ({
      habits: habitsWithStats,
      buildHabits,
      breakHabits,
      ...actions,
    }),
    [habitsWithStats, buildHabits, breakHabits, actions]
  )

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  )
}

export const useHabits = () => {
  const context = useContext(HabitContext)
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider')
  }
  return context
}