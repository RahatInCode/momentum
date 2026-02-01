import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { TimeBlock } from './TimeBlock'
import { TimeBlockCreator } from './TimeBlockCreator'
import { useRoutine } from '../context/RoutineContext'

export const RoutineBuilder = () => {
  const { blocks, reorderBlocks } = useRoutine()
  const [isCreating, setIsCreating] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)
      const newBlocks = arrayMove(blocks, oldIndex, newIndex)
      reorderBlocks(newBlocks)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Daily Routine
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Drag to reorder your time blocks
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} size="sm">
          Add Block
        </Button>
      </div>

      {blocks.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-text-muted mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-text-secondary">No time blocks yet</p>
          <p className="text-sm text-text-muted mt-1">
            Create your first block to build your routine
          </p>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {blocks.map((block) => (
                <TimeBlock key={block.id} block={block} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <TimeBlockCreator
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
      />
    </div>
  )
}