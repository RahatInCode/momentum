import { useMemo } from 'react'
import { generateHeatmapData } from '../../utils/heatmapUtils'
import { HEATMAP_WEEKS } from '../../utils/constants'

const intensityColors = {
  0: 'bg-surface-2',
  1: 'bg-accent-subtle',
  2: 'bg-accent-low',
  3: 'bg-accent-medium',
  4: 'bg-accent-high',
}

export const HabitHeatmap = ({
  completedDates,
  weeks = HEATMAP_WEEKS,
  showLabels = false,
  className = '',
}) => {
  const heatmapData = useMemo(
    () => generateHeatmapData(completedDates, weeks),
    [completedDates, weeks]
  )

  const weekGroups = useMemo(() => {
    const groups = []
    let currentWeek = []

    heatmapData.forEach((day, index) => {
      currentWeek.push(day)
      if (day.dayOfWeek === 6 || index === heatmapData.length - 1) {
        groups.push(currentWeek)
        currentWeek = []
      }
    })

    return groups
  }, [heatmapData])

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className={`overflow-x-auto scrollbar-thin ${className}`}>
      <div className="inline-flex gap-1">
        {showLabels && (
          <div className="flex flex-col gap-0.75 mr-2">
            {dayLabels.map((label, i) => (
              <div
                key={i}
                className="w-3 h-3 flex items-center justify-center text-[10px] text-text-muted"
              >
                {i % 2 === 1 ? label : ''}
              </div>
            ))}
          </div>
        )}

        {weekGroups.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-0.75">
            {weekIndex === 0 &&
              week[0]?.dayOfWeek > 0 &&
              Array.from({ length: week[0].dayOfWeek }).map((_, i) => (
                <div key={`pad-${i}`} className="w-3 h-3" />
              ))}

            {week.map((day) => (
              <div
                key={day.date}
                className={`
                  w-3 h-3 rounded-sm
                  ${intensityColors[day.intensity]}
                  ${day.isToday ? 'ring-1 ring-text-primary ring-offset-1 ring-offset-surface-0' : ''}
                `}
                title={`${day.date}: ${day.completed ? 'Completed' : 'Not completed'}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 mt-3 text-xs text-text-muted">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-3 h-3 rounded-sm ${intensityColors[level]}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}