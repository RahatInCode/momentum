import { INTENSITY_LEVELS, HEATMAP_WEEKS } from './constants'
import { generateHeatmapDays } from './dateUtils'

export const getIntensityLevel = (count, max = 1) => {
  if (count === 0) return INTENSITY_LEVELS.NONE
  const ratio = count / max
  if (ratio <= 0.25) return INTENSITY_LEVELS.LOW
  if (ratio <= 0.5) return INTENSITY_LEVELS.MEDIUM
  if (ratio <= 0.75) return INTENSITY_LEVELS.HIGH
  return INTENSITY_LEVELS.MAX
}

export const generateHeatmapData = (completedDates, weeksCount = HEATMAP_WEEKS) => {
  const days = generateHeatmapDays(weeksCount)
  const completionSet = new Set(completedDates)

  return days.map((day) => ({
    ...day,
    completed: completionSet.has(day.date),
    intensity: completionSet.has(day.date)
      ? INTENSITY_LEVELS.MAX
      : INTENSITY_LEVELS.NONE,
  }))
}

export const generateAggregateHeatmap = (habits, weeksCount = HEATMAP_WEEKS) => {
  const days = generateHeatmapDays(weeksCount)
  const totalHabits = habits.length

  if (totalHabits === 0) {
    return days.map((day) => ({
      ...day,
      count: 0,
      intensity: INTENSITY_LEVELS.NONE,
    }))
  }

  const completionCounts = {}
  habits.forEach((habit) => {
    habit.completedDates.forEach((date) => {
      completionCounts[date] = (completionCounts[date] || 0) + 1
    })
  })

  return days.map((day) => {
    const count = completionCounts[day.date] || 0
    return {
      ...day,
      count,
      intensity: getIntensityLevel(count, totalHabits),
    }
  })
}