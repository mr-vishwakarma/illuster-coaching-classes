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
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Users, LayoutGrid } from 'lucide-react';

import { useBatchManager } from '../hooks/useBatchManager';
import type { StudentItem } from '../hooks/useBatchManager';

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
  const {
    batches,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    getStudentById
  } = useBatchManager();

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
