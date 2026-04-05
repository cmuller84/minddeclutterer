"use client";

import { useState, useEffect, useCallback } from "react";
import BrainDump from "@/components/BrainDump";
import TaskList from "@/components/TaskList";
import { Task, Priority } from "@/lib/types";
import { loadTasks, saveTasks, generateId } from "@/lib/storage";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  // Load tasks from localStorage on mount
  useEffect(() => {
    setTasks(loadTasks());
    setLoaded(true);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (loaded) {
      saveTasks(tasks);
    }
  }, [tasks, loaded]);

  const addTask = useCallback((text: string, priority: Priority) => {
    const newTask: Task = {
      id: generateId(),
      text,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const filteredTasks =
    filter === "all"
      ? tasks
      : filter === "active"
        ? tasks.filter((t) => !t.completed)
        : tasks.filter((t) => t.completed);

  const activeCount = tasks.filter((t) => !t.completed).length;
  const doneCount = tasks.filter((t) => t.completed).length;

  // Don't render until loaded from localStorage to avoid hydration mismatch
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto w-full">
      {/* Header */}
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold tracking-tight">Mind Declutterer</h1>
        <p className="text-muted text-sm mt-0.5">
          Get it out of your head. We&apos;ll organize it.
        </p>
      </header>

      {/* Brain dump input - always visible at top */}
      <div className="px-4 py-3 sticky top-0 z-10 bg-background">
        <BrainDump onAdd={addTask} />
      </div>

      {/* Filter tabs */}
      {tasks.length > 0 && (
        <div className="px-4 flex gap-1 mb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === "all"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === "active"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter("done")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === "done"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            Done ({doneCount})
          </button>

          {doneCount > 0 && (
            <button
              onClick={() =>
                setTasks((prev) => prev.filter((t) => !t.completed))
              }
              className="ml-auto text-xs text-muted hover:text-danger transition-colors"
            >
              Clear done
            </button>
          )}
        </div>
      )}

      {/* Task list */}
      <main className="px-4 pb-8 flex-1 safe-bottom">
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </main>
    </div>
  );
}
