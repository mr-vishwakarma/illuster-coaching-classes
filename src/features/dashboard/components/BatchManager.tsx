import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Users, LayoutGrid } from 'lucide-react';

interface StudentItem {
  id: string;
  name: string;
  course: string;
}

type BatchesState = Record<string, StudentItem[]>;

// --- Draggable Student Card ---
const SortableStudentCard = ({ student }: { student: StudentItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: student.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 mb-2 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl cursor-grab active:cursor-grabbing hover:border-[var(--primary)] transition-colors touch-none"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-3">
        <GripVertical size={16} className="text-[var(--text-muted)]" />
        <div>
          <div className="text-sm font-bold text-[var(--text-main)]">{student.name}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-0.5">{student.course}</div>
        </div>
      </div>
    </div>
  );
};

// --- Droppable Container ---
const DroppableBatch = ({ id, title, students }: { id: string; title: string; students: StudentItem[] }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="card p-4 flex flex-col h-[300px] md:h-[400px]">
      <div className="flex items-center justify-between mb-4 border-b border-[var(--border-light)] pb-3">
        <h3 className="font-display font-black text-[var(--text-main)] flex items-center gap-2">
          {id === 'unassigned' ? <Users size={16} className="text-orange-500" /> : <LayoutGrid size={16} className="text-purple-500" />}
          {title}
        </h3>
        <span className="text-xs font-black bg-[var(--bg-main)] px-2 py-1 rounded-md text-[var(--text-muted)]">
          {students.length}
        </span>
      </div>
      
      <div ref={setNodeRef} className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col">
        <SortableContext id={id} items={students.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {students.map((student) => (
            <SortableStudentCard key={student.id} student={student} />
          ))}
        </SortableContext>
        {students.length === 0 && (
          <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)] italic opacity-50 border-2 border-dashed border-[var(--border-light)] rounded-xl p-4 text-center">
            Drop students here
          </div>
        )}
      </div>
    </div>
  );
};

export const BatchManager = () => {
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

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the containers
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-light">
        <div>
          <h2 className="text-xl font-display font-black text-gray-800">Batch Assignment</h2>
          <p className="text-sm text-gray-500">Drag and drop students to organize batches.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={16} /> Create Batch
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid lg:grid-cols-3 gap-6">
          <DroppableBatch id="unassigned" title="Unassigned Students" students={batches.unassigned} />
          <DroppableBatch id="batchA" title="Batch A — JEE Elite" students={batches.batchA} />
          <DroppableBatch id="batchB" title="Batch B — NEET Pro" students={batches.batchB} />
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-80 scale-105 shadow-2xl cursor-grabbing">
              <SortableStudentCard student={getStudentById(activeId)!} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
