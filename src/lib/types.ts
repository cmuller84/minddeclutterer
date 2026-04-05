export type Priority = "now" | "soon" | "later" | "thought";

export interface Task {
  id: string;
  text: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string; emoji: string; sortOrder: number }
> = {
  now: {
    label: "Now",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    emoji: "!",
    sortOrder: 0,
  },
  soon: {
    label: "Soon",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    emoji: "~",
    sortOrder: 1,
  },
  later: {
    label: "Later",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    emoji: "...",
    sortOrder: 2,
  },
  thought: {
    label: "Just a thought",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    emoji: "?",
    sortOrder: 3,
  },
};
