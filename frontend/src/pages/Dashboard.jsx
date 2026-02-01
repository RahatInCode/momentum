import { useState, useMemo } from 'react'
import { Card, CardTitle } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { HabitCard } from '../components/habits/HabitCard'
import { HabitCreator } from '../components/habits/HabitCreator'
import { HabitHeatmap } from '../components/habits/HabitHeatMap'
import { ProgressRing } from '../components/common/ProgressRing'
import { useHabits } from '../components/context/HabitContext'
import { generateAggregateHeatmap } from '../utils/heatmapUtils'
import { format } from 'date-fns'

export const Dashboard = () => {
  const { buildHabits } = useHabits()
  const [isCreating, setIsCreating] = useState(false)

  const todaysProgress = useMemo(() => {
    const completed = buildHabits.filter((h) => h.isCompletedToday).length
    const total = buildHabits.length
    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    }
  }, [buildHabits])

  const aggregateData = useMemo(
    () => generateAggregateHeatmap(buildHabits, 12),
    [buildHabits]
  )

  const today = format(new Date(), 'EEEE, MMMM d')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Today</h1>
        <p className="text-text-secondary">{today}</p>
      </div>

      {buildHabits.length > 0 && (
        <Card className="flex items-center gap-4">
          <ProgressRing progress={todaysProgress.percentage} size={64} />
          <div>
            <div className="text-2xl font-bold text-text-primary">
              {todaysProgress.completed}/{todaysProgress.total}
            </div>
            <div className="text-sm text-text-secondary">habits today</div>
          </div>
        </Card>
      )}

      {buildHabits.length > 0 && (
        <Card>
          <CardTitle>Your consistency</CardTitle>
          <div className="mt-4">
            <HabitHeatmap
              completedDates={aggregateData
                .filter((d) => d.intensity > 0)
                .map((d) => d.date)}
              weeks={12}
              showLabels
            />
          </div>
        </Card>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            {buildHabits.length > 0 ? 'Your habits' : 'Start your journey'}
          </h2>
          <Button onClick={() => setIsCreating(true)} size="sm">
            Add Habit
          </Button>
        </div>

        {buildHabits.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-text-muted mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-text-secondary">No habits yet</p>
            <p className="text-sm text-text-muted mt-1">
              Create your first habit to get started
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {buildHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </div>

      <HabitCreator isOpen={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  )
}