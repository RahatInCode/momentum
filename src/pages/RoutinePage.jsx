import { RoutineBuilder } from '../components/routine/RoutineBuilder'

export const RoutinePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Routine</h1>
        <p className="text-text-secondary mt-1">
          Plan your ideal day
        </p>
      </div>

      <RoutineBuilder />
    </div>
  )
}