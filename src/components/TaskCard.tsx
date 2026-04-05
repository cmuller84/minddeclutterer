"use client";

import { Task, PRIORITY_CONFIG } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const config = PRIORITY_CONFIG[task.priority];

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
        task.completed
          ? "bg-gray-50 border-gray-200 opacity-60"
          : config.bg
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          task.completed
            ? "bg-green-500 border-green-500 text-white"
            : `border-current ${config.color}`
        }`}
      >
        {task.completed && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Text */}
      <span
        className={`flex-1 text-sm leading-relaxed ${
          task.completed ? "line-through text-gray-400" : "text-foreground"
        }`}
      >
        {task.text}
      </span>

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 p-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
