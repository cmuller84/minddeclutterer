"use client";

import { Task, Priority, PRIORITY_CONFIG } from "@/lib/types";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Group active tasks by priority
  const grouped = activeTasks.reduce(
    (acc, task) => {
      if (!acc[task.priority]) acc[task.priority] = [];
      acc[task.priority].push(task);
      return acc;
    },
    {} as Record<Priority, Task[]>
  );

  const priorityOrder: Priority[] = ["now", "soon", "later", "thought"];

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <div className="text-4xl mb-3">~</div>
        <p className="text-lg font-medium">Your mind is clear</p>
        <p className="text-sm mt-1">
          Dump whatever&apos;s on your mind above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {priorityOrder.map((priority) => {
        const group = grouped[priority];
        if (!group || group.length === 0) return null;
        const config = PRIORITY_CONFIG[priority];

        return (
          <div key={priority}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
                {config.label}
              </span>
              <span className="text-xs text-muted">({group.length})</span>
            </div>
            <div className="space-y-2">
              {group.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Completed section */}
      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
              Done
            </span>
            <span className="text-xs text-muted">({completedTasks.length})</span>
          </div>
          <div className="space-y-2">
            {completedTasks.slice(0, 10).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
            {completedTasks.length > 10 && (
              <p className="text-xs text-muted text-center py-2">
                +{completedTasks.length - 10} more completed
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
