"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Module {
  id: string;
  title: string;
  description: string;
}

const initialModules: Module[] = [
  {
    id: "1",
    title: "Module 1: Introduction",
    description: "Overview of communication fundamentals.",
  },
  {
    id: "2",
    title: "Module 2: Active Listening",
    description: "Techniques to improve listening and empathy.",
  },
  {
    id: "3",
    title: "Module 3: Difficult Conversations",
    description: "Strategies for handling tough discussions effectively.",
  },
];

// 🔹 Sortable Item Component
function SortableItem({ mod }: { mod: Module }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: mod.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-gray-50 border rounded flex items-center justify-between cursor-grab"
    >
      <div>
        <h3 className="font-semibold text-gray-800">{mod.title}</h3>
        <p className="text-sm text-gray-600">{mod.description}</p>
      </div>
      <div className="flex gap-2">
        <button className="px-2 py-1 text-xs border rounded hover:bg-gray-100">
          Edit
        </button>
        <button className="px-2 py-1 text-xs border border-blue-400 text-blue-600 rounded hover:bg-blue-50">
          Publish
        </button>
        <button className="px-2 py-1 text-xs border border-red-400 text-red-600 rounded hover:bg-red-50">
          Delete
        </button>
      </div>
    </li>
  );
}

export default function ModuleManager() {
  const [modules, setModules] = useState(initialModules);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // small drag threshold
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setModules((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className=" bg-white shadow rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Course Modules</h2>
        <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Add Module
        </button>
      </div>

      {/* Module List with DnD Kit */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={modules.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-3">
            {modules.map((mod) => (
              <SortableItem key={mod.id} mod={mod} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {/* Save Order */}
      <div className="mt-6 text-right">
        <button
          onClick={() => console.log("Save order:", modules)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Order
        </button>
      </div>
    </div>
  );
}
