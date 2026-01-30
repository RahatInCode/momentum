import { Card } from '../common/Card'
import { StreakCard } from './StreakCard'
import { SOCIAL_FEED_LIMIT } from '../../utils/constants'

const mockStreakData = [
  {
    id: '1',
    username: 'sarah_runs',
    habit: 'Morning run',
    streak: 45,
    identity: 'exercises before sunrise',
  },
  {
    id: '2',
    username: 'dev_marcus',
    habit: 'Code review',
    streak: 21,
    identity: 'reviews code with intention',
  },
  {
    id: '3',
    username: 'zen_maya',
    habit: 'Meditation',
    streak: 90,
    identity: 'makes space for stillness',
  },
  {
    id: '4',
    username: 'writer_jake',
    habit: 'Daily writing',
    streak: 14,
    identity: 'writes every single day',
  },
  {
    id: '5',
    username: 'health_first',
    habit: 'No sugar',
    streak: 30,
    identity: 'fuels their body with real food',
  },
]

export const StreakFeed = () => {
  const streaks = mockStreakData.slice(0, SOCIAL_FEED_LIMIT)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Community Streaks
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          People building consistency
        </p>
      </div>

      <div className="space-y-3">
        {streaks.map((streak) => (
          <StreakCard key={streak.id} streak={streak} />
        ))}
      </div>

      <Card className="text-center py-6">
        <p className="text-sm text-text-muted">
          That's everyone for now.
        </p>
        <p className="text-xs text-text-muted mt-1">
          The feed is intentionally limited.
        </p>
      </Card>
    </div>
  )
}