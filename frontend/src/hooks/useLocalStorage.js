import { useState, useEffect, useCallback } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

export const useLocalStorageReducer = (key, reducer, initialValue) => {
  const [state, setState] = useLocalStorage(key, initialValue)

  const dispatch = useCallback(
    (action) => {
      setState((prevState) => reducer(prevState, action))
    },
    [setState, reducer]
  )

  return [state, dispatch]
}