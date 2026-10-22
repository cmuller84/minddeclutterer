"use client";

import { useState } from "react";
import { Task, Category, CATEGORIES, CATEGORY_CONFIG } from "@/lib/types";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRecategorize: (id: string, category: Category) => void;
}

function byRank(a: Task, b: Task) {
  return (a.rank ?? Infinity) - (b.rank ?? Infinity) || a.createdAt.localeCompare(b.createdAt);
}

export default function TaskList({ tasks, onToggle, onDelete, onRecategorize }: TaskListProps) {
  const [showLetGo, setShowLetGo] = useState(false);

  const active = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  const groups = Object.fromEntries(
    CATEGORIES.map((c) => [c, active.filter((t) => t.category === c)])
  ) as Record<Category, Task[]>;
  groups.A.sort(byRank);

  const frog = groups.A[0];

  const cardProps = { onToggle, onDelete, onRecategorize };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-lg font-medium">Your mind is clear</p>
        <p className="text-sm mt-1">Dump whatever&apos;s on your mind above</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* The frog: the single most important thing */}
      {frog && (
        <div className="rounded-2xl bg-green-700 text-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-green-200">
            🐸 Eat this frog first
          </p>
          <p className="text-lg font-semibold leading-snug mt-1">{frog.text}</p>
          <button
            onClick={() => onToggle(frog.id)}
            className="mt-3 bg-white text-green-800 text-sm font-semibold px-4 py-1.5 rounded-full active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      )}

      {CATEGORIES.map((c) => {
        const group = groups[c];
        if (group.length === 0) return null;
        const config = CATEGORY_CONFIG[c];
        const collapsed = c === "E" && !showLetGo;

        return (
          <section key={c}>
            <button
              onClick={c === "E" ? () => setShowLetGo((s) => !s) : undefined}
              className="w-full text-left mb-2"
            >
              <div className="flex items-baseline gap-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
                  {c} · {config.title}
                </span>
                <span className="text-xs text-muted">({group.length})</span>
                {c === "E" && (
                  <span className="text-xs text-muted ml-auto">{collapsed ? "Show" : "Hide"}</span>
                )}
              </div>
              <p className="text-xs text-muted">{config.hint}</p>
            </button>
            {!collapsed && (
              <div className="space-y-2">
                {group.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    label={c === "A" ? `A-${i + 1}` : c}
                    {...cardProps}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {completed.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
              Done
            </span>
            <span className="text-xs text-muted">({completed.length})</span>
          </div>
          <div className="space-y-2">
            {completed.slice(0, 10).map((task) => (
              <TaskCard key={task.id} task={task} label={task.category} {...cardProps} />
            ))}
            {completed.length > 10 && (
              <p className="text-xs text-muted text-center py-2">
                +{completed.length - 10} more completed
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
