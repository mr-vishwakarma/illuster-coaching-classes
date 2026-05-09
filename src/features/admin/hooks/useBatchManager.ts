import { useState } from 'react';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export interface StudentItem {
  id: string;
  name: string;
  course: string;
}

export type BatchesState = Record<string, StudentItem[]>;

export const useBatchManager = () => {
  const [batches, setBatches] = useState<BatchesState>({
    unassigned: [
      { id: 's1', name: 'John Doe', course: 'JEE Elite' },
      { id: 's2', name: 'Jane Smith', course: 'NEET Pro' },
      { id: 's3', name: 'Rahul Kumar', course: 'Board Prep' },
      { id: 's4', name: 'Aisha Sharma', course: 'JEE Elite' },
    ],
    batchA: [
      { id: 's5', name: 'Priya Singh', course: 'JEE Elite' },
    ],
    batchB: [],
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = Object.keys(batches).find((key) =>
      batches[key].some((s) => s.id === activeId)
    );
    const overContainer = Object.keys(batches).find((key) =>
      batches[key].some((s) => s.id === overId)
    ) || (Object.keys(batches).includes(overId as string) ? overId : null);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setBatches((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer as string];
      
      const activeIndex = activeItems.findIndex((s) => s.id === activeId);
      const overIndex = overItems.findIndex((s) => s.id === overId);

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item.id !== activeId),
        ],
        [overContainer as string]: [
          ...prev[overContainer as string].slice(0, newIndex),
          activeItems[activeIndex],
          ...prev[overContainer as string].slice(newIndex, prev[overContainer as string].length),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = Object.keys(batches).find((key) =>
      batches[key].some((s) => s.id === active.id)
    );
    const overContainer = Object.keys(batches).find((key) =>
      batches[key].some((s) => s.id === over.id)
    ) || (Object.keys(batches).includes(over.id as string) ? over.id : null);

    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = batches[activeContainer].findIndex((s) => s.id === active.id);
      const overIndex = batches[overContainer as string].findIndex((s) => s.id === over.id);

      if (activeIndex !== overIndex) {
        setBatches((prev) => ({
          ...prev,
          [overContainer as string]: arrayMove(prev[overContainer as string], activeIndex, overIndex),
        }));
      }
    }
  };

  const getStudentById = (id: string) => {
    for (const key in batches) {
      const found = batches[key].find((s) => s.id === id);
      if (found) return found;
    }
    return null;
  };

  return {
    batches,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    getStudentById
  };
};
