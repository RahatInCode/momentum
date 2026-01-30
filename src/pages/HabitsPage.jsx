import { useState } from 'react'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { HabitCard } from '../components/habits/HabitCard'
import { UrgeResistButton } from '../components/habits/UrgeResistButton'
import { IdentityStatement } from '../components/habits/IdentityStatement'
import { HabitCreator } from '../components/habits/HabitCreator'
import { useHabits } from '../context/HabitContext'

export const HabitsPage = () => {
  const { buildHabits, breakHabits } = useHabits()
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">All Habits</h1>
          <p className="text-text-secondary mt-1">
            {buildHabits.length + breakHabits.length} total habits
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>New Habit</Button>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <span className="text-xl">🌱</span> Building
          </h2>
          <p className="text-sm text-text-secondary">
            Habits you're developing
          </p>
        </div>

        {buildHabits.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-text-muted">No build habits yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {buildHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <span className="text-xl">🔗</span> Breaking
          </h2>
          <p className="text-sm text-text-secondary">
            Habits you're letting go
          </p>
        </div>

        {breakHabits.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-text-muted">No break habits yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {breakHabits.map((habit) => (
              <Card key={habit.id}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-text-secondary mb-1">
                      {habit.name}
                    </h3>
                    <IdentityStatement
                      statement={habit.identityStatement}
                      size="md"
                    />
                  </div>
                  <UrgeResistButton
                    habitId={habit.id}
                    urgesResisted={habit.totalUrgesResisted}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <HabitCreator isOpen={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  )
}