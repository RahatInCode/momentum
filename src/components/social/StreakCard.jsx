import { Card } from '../common/Card'

export const StreakCard = ({ streak }) => {
  return (
    <Card padding="sm" className="flex items-center gap-4">
      <div className="shrink w-14 h-14 rounded-lg bg-accent-subtle flex items-center justify-center">
        <span className="text-xl font-bold text-accent-high font-mono">
          {streak.streak}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary truncate">
            @{streak.username}
          </span>
          <span className="text-text-muted">·</span>
          <span className="text-sm text-text-secondary truncate">
            {streak.habit}
          </span>
        </div>

        <p className="text-sm text-text-muted mt-1 italic truncate">
          "I am someone who {streak.identity}"
        </p>
      </div>

      <div className="shrink text-xs text-text-muted">
        days
      </div>
    </Card>
  )
}