import { createContext, useContext, useMemo } from 'react'
import { useLocalStorageReducer } from '../hooks/useLocalStorage'

const RoutineContext = createContext(null)

const ACTIONS = {
  ADD_BLOCK: 'ADD_BLOCK',
  UPDATE_BLOCK: 'UPDATE_BLOCK',
  DELETE_BLOCK: 'DELETE_BLOCK',
  REORDER_BLOCKS: 'REORDER_BLOCKS',
}

const routineReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_BLOCK:
      return {
        ...state,
        blocks: [
          ...state.blocks,
          {
            id: crypto.randomUUID(),
            ...action.payload,
          },
        ],
      }

    case ACTIONS.UPDATE_BLOCK:
      return {
        ...state,
        blocks: state.blocks.map((block) =>
          block.id === action.payload.id
            ? { ...block, ...action.payload.updates }
            : block
        ),
      }

    case ACTIONS.DELETE_BLOCK:
      return {
        ...state,
        blocks: state.blocks.filter((block) => block.id !== action.payload.id),
      }

    case ACTIONS.REORDER_BLOCKS:
      return {
        ...state,
        blocks: action.payload.blocks,
      }

    default:
      return state
  }
}

const initialState = {
  blocks: [],
}

export const RoutineProvider = ({ children }) => {
  const [state, dispatch] = useLocalStorageReducer(
    'momentum_routine',
    routineReducer,
    initialState
  )

  const actions = useMemo(
    () => ({
      addBlock: (block) => dispatch({ type: ACTIONS.ADD_BLOCK, payload: block }),
      updateBlock: (id, updates) =>
        dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { id, updates } }),
      deleteBlock: (id) =>
        dispatch({ type: ACTIONS.DELETE_BLOCK, payload: { id } }),
      reorderBlocks: (blocks) =>
        dispatch({ type: ACTIONS.REORDER_BLOCKS, payload: { blocks } }),
    }),
    [dispatch]
  )

  const sortedBlocks = useMemo(() => {
    return [...state.blocks].sort((a, b) => {
      const timeA = a.startTime.replace(':', '')
      const timeB = b.startTime.replace(':', '')
      return parseInt(timeA) - parseInt(timeB)
    })
  }, [state.blocks])

  const value = useMemo(
    () => ({
      blocks: sortedBlocks,
      ...actions,
    }),
    [sortedBlocks, actions]
  )

  return (
    <RoutineContext.Provider value={value}>{children}</RoutineContext.Provider>
  )
}

export const useRoutine = () => {
  const context = useContext(RoutineContext)
  if (!context) {
    throw new Error('useRoutine must be used within a RoutineProvider')
  }
  return context
}