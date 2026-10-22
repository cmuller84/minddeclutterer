import { Task, Category } from "./types";

const STORAGE_KEY = "minddeclutterer_tasks";

// Tasks saved before the A-E switch used now/soon/later/thought
const LEGACY_PRIORITY_MAP: Record<string, Category> = {
  now: "A",
  soon: "B",
  later: "C",
  thought: "C",
};

function migrate(task: Task & { priority?: string }): Task {
  if (task.category) return task;
  const { priority, ...rest } = task;
  return { ...rest, category: LEGACY_PRIORITY_MAP[priority ?? ""] ?? "B" };
}

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data).map(migrate) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage full or unavailable
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
