"use client";

import { useState, useRef } from "react";
import { Priority } from "@/lib/types";

interface BrainDumpProps {
  onAdd: (text: string, priority: Priority) => void;
}

export default function BrainDump({ onAdd }: BrainDumpProps) {
  const [text, setText] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("soon");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const priorities: { value: Priority; label: string; shortLabel: string }[] = [
    { value: "now", label: "Needs done now", shortLabel: "Now" },
    { value: "soon", label: "Needs done soon", shortLabel: "Soon" },
    { value: "later", label: "Eventually", shortLabel: "Later" },
    { value: "thought", label: "Just a thought", shortLabel: "Thought" },
  ];

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Support multi-line: each line becomes a separate task
    const lines = trimmed
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    for (const line of lines) {
      onAdd(line, selectedPriority);
    }

    setText("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What's on your mind? Type it all out...&#10;(One thing per line, or just free-write)"
        rows={3}
        className="w-full resize-none bg-transparent text-foreground placeholder:text-muted outline-none text-base leading-relaxed"
        autoFocus
      />

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        {/* Priority selector */}
        <div className="flex gap-1.5">
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => setSelectedPriority(p.value)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                selectedPriority === p.value
                  ? p.value === "now"
                    ? "bg-red-100 text-red-700 ring-1 ring-red-300"
                    : p.value === "soon"
                      ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300"
                      : p.value === "later"
                        ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                        : "bg-purple-100 text-purple-700 ring-1 ring-purple-300"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {p.shortLabel}
            </button>
          ))}
        </div>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="bg-accent text-white px-4 py-1.5 rounded-full text-sm font-medium disabled:opacity-30 transition-all active:scale-95"
        >
          Add
        </button>
      </div>
    </div>
  );
}
