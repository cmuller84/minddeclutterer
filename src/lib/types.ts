// Eat That Frog A-B-C-D-E method
export type Category = "A" | "B" | "C" | "D" | "E";

export const CATEGORIES: Category[] = ["A", "B", "C", "D", "E"];

export interface Task {
  id: string;
  text: string;
  category: Category;
  // Order within A (A-1 is the frog). Only meaningful for A tasks.
  rank?: number;
  // Who to hand it off to, for D tasks
  delegateTo?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export type NewTask = Pick<Task, "text" | "category" | "rank" | "delegateTo">;

export const CATEGORY_CONFIG: Record<
  Category,
  { title: string; hint: string; color: string; bg: string; badge: string }
> = {
  A: {
    title: "Must do",
    hint: "Real consequences if it doesn't happen",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    badge: "bg-red-600 text-white",
  },
  B: {
    title: "Should do",
    hint: "Mild consequences. Only after the A's",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    badge: "bg-amber-500 text-white",
  },
  C: {
    title: "Nice to do",
    hint: "No consequences either way",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    badge: "bg-blue-500 text-white",
  },
  D: {
    title: "Hand it off",
    hint: "Someone else can do this",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-600 text-white",
  },
  E: {
    title: "Let it go",
    hint: "Permission to drop these",
    color: "text-gray-500",
    bg: "bg-gray-50 border-gray-200",
    badge: "bg-gray-400 text-white",
  },
};
