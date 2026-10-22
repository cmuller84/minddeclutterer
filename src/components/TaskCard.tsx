"use client";

import { useState } from "react";
import { Task, Category, CATEGORIES, CATEGORY_CONFIG } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  // Display label, e.g. "A-1" (A tasks are numbered by position)
  label: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRecategorize: (id: string, category: Category) => void;
}

export default function TaskCard({
  task,
  label,
  onToggle,
  onDelete,
  onRecategorize,
}: TaskCardProps) {
  const [picking, setPicking] = useState(false);
  const config = CATEGORY_CONFIG[task.category];

  return (
    <div
      className={`rounded-xl border transition-all ${
        task.completed ? "bg-gray-50 border-gray-200 opacity-60" : config.bg
      }`}
    >
      <div className="flex items-start gap-3 p-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? "Mark not done" : "Mark done"}
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
        <div className="flex-1 min-w-0">
          <span
            className={`text-sm leading-relaxed ${
              task.completed ? "line-through text-gray-400" : "text-foreground"
            }`}
          >
            {task.text}
          </span>
          {task.category === "D" && task.delegateTo && (
            <span className="block text-xs text-emerald-700 mt-0.5">
              → {task.delegateTo}
            </span>
          )}
        </div>

        {/* Category badge - tap to re-sort */}
        <button
          onClick={() => setPicking((p) => !p)}
          aria-label="Change category"
          className={`flex-shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md ${config.badge}`}
        >
          {label}
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(task.id)}
          aria-label="Delete"
          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 p-1 -m-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {picking && (
        <div className="flex gap-1.5 px-3 pb-3">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                onRecategorize(task.id, c);
                setPicking(false);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                c === task.category
                  ? CATEGORY_CONFIG[c].badge
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {c}
              <span className="block text-[9px] font-medium opacity-80">
                {CATEGORY_CONFIG[c].title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
