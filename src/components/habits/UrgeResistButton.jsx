import { useState } from 'react'
import { useHabits } from '../../context/HabitContext'

export const UrgeResistButton = ({ habitId, urgesResisted = 0 }) => {
  const { recordUrge } = useHabits()
  const [isRecording, setIsRecording] = useState(false)
  const [justRecorded, setJustRecorded] = useState(false)

  const handleRecord = async () => {
    if (isRecording) return

    setIsRecording(true)
    recordUrge(habitId)

    setJustRecorded(true)
    setTimeout(() => setJustRecorded(false), 1500)
    setIsRecording(false)
  }

  return (
    <div className="text-center space-y-3">
      <button
        onClick={handleRecord}
        disabled={isRecording}
        className={`
          w-24 h-24 rounded-full
          flex flex-col items-center justify-center
          transition-all duration-200
          ${
            justRecorded
              ? 'bg-accent-medium text-surface-0 scale-95'
              : 'bg-surface-2 border-2 border-surface-3 hover:border-accent-medium text-text-primary hover:text-accent-high'
          }
        `}
        aria-label="Record resisted urge"
      >
        {justRecorded ? (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <>
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-xs font-medium">Resisted</span>
          </>
        )}
      </button>

      <div className="text-sm text-text-secondary">
        <span className="font-mono font-semibold text-text-primary">
          {urgesResisted}
        </span>{' '}
        urges resisted
      </div>
    </div>
  )
}