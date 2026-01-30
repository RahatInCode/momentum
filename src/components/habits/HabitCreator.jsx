import { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { IdentityStatementInput } from './IdentityStatement'
import { useHabits } from '../../context/HabitContext'
import { HABIT_TYPES, IDENTITY_TEMPLATES } from '../../utils/constants'

export const HabitCreator = ({ isOpen, onClose }) => {
  const { addHabit } = useHabits()

  const [identityStatement, setIdentityStatement] = useState('')
  const [habitName, setHabitName] = useState('')
  const [habitType, setHabitType] = useState(HABIT_TYPES.BUILD)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}

    if (!identityStatement.trim()) {
      newErrors.identity = 'Tell us who you are becoming'
    } else if (identityStatement.length < 3) {
      newErrors.identity = 'Be a bit more specific'
    }

    if (!habitName.trim()) {
      newErrors.name = 'Give your habit a name'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    addHabit({
      name: habitName.trim(),
      identityStatement: identityStatement.trim(),
      type: habitType,
    })

    setIdentityStatement('')
    setHabitName('')
    setHabitType(HABIT_TYPES.BUILD)
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setIdentityStatement('')
    setHabitName('')
    setErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Habit" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <IdentityStatementInput
          value={identityStatement}
          onChange={setIdentityStatement}
          template={IDENTITY_TEMPLATES[0]}
          error={errors.identity}
        />

        <Input
          label="Habit name"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="e.g., Morning exercise"
          error={errors.name}
          hint="A short label to identify this habit"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Habit type
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setHabitType(HABIT_TYPES.BUILD)}
              className={`
                flex-1 py-3 px-4 rounded-lg text-sm font-medium
                border transition-colors duration-150
                ${
                  habitType === HABIT_TYPES.BUILD
                    ? 'bg-accent-subtle border-accent-medium text-accent-high'
                    : 'bg-surface-2 border-surface-3 text-text-secondary hover:border-text-muted'
                }
              `}
            >
              <span className="block text-lg mb-1">🌱</span>
              Build
              <span className="block text-xs mt-1 opacity-75">
                Start doing something
              </span>
            </button>
            <button
              type="button"
              onClick={() => setHabitType(HABIT_TYPES.BREAK)}
              className={`
                flex-1 py-3 px-4 rounded-lg text-sm font-medium
                border transition-colors duration-150
                ${
                  habitType === HABIT_TYPES.BREAK
                    ? 'bg-accent-subtle border-accent-medium text-accent-high'
                    : 'bg-surface-2 border-surface-3 text-text-secondary hover:border-text-muted'
                }
              `}
            >
              <span className="block text-lg mb-1">🔗</span>
              Break
              <span className="block text-xs mt-1 opacity-75">
                Stop doing something
              </span>
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Create Habit
          </Button>
        </div>
      </form>
    </Modal>
  )
}