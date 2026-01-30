import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '../common/Card'
import { useRoutine } from '../../context/RoutineContext'

export const TimeBlock = ({ block }) => {
  const { deleteBlock } = useRoutine()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <Card padding="sm" className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 rounded text-text-muted hover:text-text-secondary hover:bg-surface-2 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </button>

        <div className="w-16 text-sm font-mono text-text-secondary">
          {block.startTime}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-text-primary truncate">
            {block.label}
          </div>
          {block.habitId && (
            <div className="text-xs text-accent-medium mt-0.5">
              Linked to habit
            </div>
          )}
        </div>

        <div className="text-xs text-text-muted bg-surface-2 px-2 py-1 rounded">
          {block.duration}m
        </div>

        <button
          onClick={() => deleteBlock(block.id)}
          className="p-1.5 rounded text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          aria-label="Delete block"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </Card>
    </div>
  )
}