import { useState } from 'react'
import { Card } from '../common/Card'
import { IdentityStatement } from './IdentityStatement'
import { HabitHeatmap } from './HabitHeatMap'
import { useHabits } from '../../context/HabitContext'
import { STREAK_MILESTONES, REWARD_DELAY_MS } from '../../utils/constants'

export const HabitCard = ({ habit }) => {
  const { toggleCompletion } = useHabits()
  const [showReward, setShowReward] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleComplete = async () => {
    if (isProcessing || habit.isCompletedToday) return

    setIsProcessing(true)
    toggleCompletion(habit.id)

    const isNewMilestone = STREAK_MILESTONES.includes(habit.currentStreak + 1)

    if (isNewMilestone) {
      setTimeout(() => {
        setShowReward(true)
        setTimeout(() => setShowReward(false), 3000)
      }, REWARD_DELAY_MS)
    }

    setIsProcessing(false)
  }

  return (
    <Card className="relative overflow-hidden">
      {showReward && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-accent-medium animate-fade-in" />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-text-secondary mb-1">
            {habit.name}
          </h3>

          <IdentityStatement statement={habit.identityStatement} size="md" />

          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-text-muted">Current</span>
              <span className="font-mono font-medium text-text-primary">
                {habit.currentStreak}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-text-muted">Best</span>
              <span className="font-mono font-medium text-text-secondary">
                {habit.longestStreak}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleComplete}
          disabled={isProcessing}
          className={`
            shrink w-14 h-14 rounded-full
            border-2 transition-all duration-200
            flex items-center justify-center
            ${
              habit.isCompletedToday
                ? 'bg-accent-medium border-accent-medium text-surface-0'
                : 'border-surface-3 hover:border-accent-medium text-text-muted hover:text-accent-medium'
            }
          `}
          aria-label={habit.isCompletedToday ? 'Completed' : 'Mark as complete'}
        >
          {habit.isCompletedToday ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <div className="w-3 h-3 rounded-full border-2 border-current" />
          )}
        </button>
      </div>

      <details className="mt-4 group">
        <summary className="flex items-center gap-2 text-sm text-text-muted cursor-pointer hover:text-text-secondary">
          <svg
            className="w-4 h-4 transition-transform group-open:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          View history
        </summary>
        <div className="mt-3 pt-3 border-t border-surface-3">
          <HabitHeatmap completedDates={habit.completedDates} weeks={12} />
        </div>
      </details>
    </Card>
  )
}