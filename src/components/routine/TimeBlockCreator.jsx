import { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { useRoutine } from '../../context/RoutineContext'
import { useHabits } from '../../context/HabitContext'
import { TIME_BLOCK_MINUTES } from '../../utils/constants'

export const TimeBlockCreator = ({ isOpen, onClose }) => {
  const { addBlock } = useRoutine()
  const { habits } = useHabits()

  const [startTime, setStartTime] = useState('09:00')
  const [duration, setDuration] = useState(30)
  const [label, setLabel] = useState('')
  const [habitId, setHabitId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!label.trim()) {
      setError('Give this block a name')
      return
    }

    addBlock({
      startTime,
      duration,
      label: label.trim(),
      habitId: habitId || null,
    })

    setStartTime('09:00')
    setDuration(30)
    setLabel('')
    setHabitId('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Time Block" size="sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">
            Start time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2.5 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">
            Duration
          </label>
          <div className="flex flex-wrap gap-2">
            {TIME_BLOCK_MINUTES.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(mins)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${
                    duration === mins
                      ? 'bg-accent-medium text-surface-0'
                      : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                  }
                `}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        <Input
          label="What will you do?"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Morning workout"
          error={error}
        />

        {habits.length > 0 && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">
              Link to habit (optional)
            </label>
            <select
              value={habitId}
              onChange={(e) => setHabitId(e.target.value)}
              className="w-full px-3 py-2.5 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-medium"
            >
              <option value="">No habit linked</option>
              {habits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Add Block
          </Button>
        </div>
      </form>
    </Modal>
  )
}