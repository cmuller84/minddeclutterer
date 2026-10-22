"use client";

import { useState, useEffect, useCallback } from "react";
import BrainDump from "@/components/BrainDump";
import TaskList from "@/components/TaskList";
import { Task, Category, NewTask } from "@/lib/types";
import { loadTasks, saveTasks, generateId } from "@/lib/storage";

// Next rank after every active A task, so new A's queue behind existing ones
function nextRank(tasks: Task[]) {
  return Math.max(0, ...tasks.filter((t) => t.category === "A" && !t.completed).map((t) => t.rank ?? 0)) + 1;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

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

  const addTasks = useCallback((incoming: NewTask[]) => {
    setTasks((prev) => {
      const base = nextRank(prev);
      const now = new Date().toISOString();
      const created: Task[] = incoming.map((t) => ({
        id: generateId(),
        text: t.text,
        category: t.category,
        rank: t.category === "A" ? base + (t.rank ?? 0) : undefined,
        delegateTo: t.delegateTo,
        completed: false,
        createdAt: now,
      }));
      return [...created, ...prev];
    });
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

  const recategorize = useCallback((id: string, category: Category) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id && t.category !== category
          ? { ...t, category, rank: category === "A" ? nextRank(prev) : undefined }
          : t
      )
    );
  }, []);

  const activeCount = tasks.filter((t) => !t.completed).length;

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
          Dump it all. We&apos;ll sort it out.
        </p>
      </header>

      {/* Brain dump input */}
      <div className="px-4 py-3">
        <BrainDump onAdd={addTasks} />
      </div>

      {tasks.length > 0 && (
        <div className="px-4 flex items-center mb-3">
          <span className="text-xs text-muted">
            {activeCount} on your plate
          </span>
          <button
            onClick={() => {
              if (window.confirm("Clear all tasks?")) {
                setTasks([]);
              }
            }}
            className="ml-auto text-xs text-muted hover:text-danger transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Task list */}
      <main className="px-4 pb-8 flex-1 safe-bottom">
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onRecategorize={recategorize}
        />
      </main>
    </div>
  );
}
