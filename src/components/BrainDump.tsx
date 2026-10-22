"use client";

import { useState, useRef } from "react";
import { NewTask } from "@/lib/types";

interface BrainDumpProps {
  onAdd: (tasks: NewTask[]) => void;
}

export default function BrainDump({ onAdd }: BrainDumpProps) {
  const [text, setText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSmartDump = async () => {
    const trimmed = text.trim();
    if (!trimmed || parsing) return;

    setParsing(true);
    setError("");

    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to parse");
      }

      onAdd(
        data.tasks.map((t: Required<NewTask>) => ({
          text: t.text,
          category: t.category,
          rank: t.category === "A" ? t.rank : undefined,
          delegateTo: t.category === "D" && t.delegateTo ? t.delegateTo : undefined,
        }))
      );

      setText("");
      textareaRef.current?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sort that. Try again or use quick add.");
    } finally {
      setParsing(false);
    }
  };

  const handleQuickAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const lines = trimmed
      .split("\n")
      .map((l) => l.trim().replace(/^[-*•]\s*/, ""))
      .filter((l) => l.length > 0);

    onAdd(lines.map((line) => ({ text: line, category: "B" })));

    setText("");
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
        }}
        placeholder={"Dump everything on your mind here...\nThe messier the better. We'll sort it out."}
        rows={4}
        disabled={parsing}
        className="w-full resize-none bg-transparent text-foreground placeholder:text-muted outline-none text-base leading-relaxed disabled:opacity-50"
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border gap-2">
        {/* Quick add - no AI, each line becomes a B */}
        <button
          onClick={handleQuickAdd}
          disabled={!text.trim() || parsing}
          className="text-muted hover:text-foreground text-xs font-medium transition-all disabled:opacity-30"
        >
          Quick add
        </button>

        {/* Smart dump - AI sorts into A-E */}
        <button
          onClick={handleSmartDump}
          disabled={!text.trim() || parsing}
          className="bg-accent text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-30 transition-all active:scale-95 flex items-center gap-2"
        >
          {parsing ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sorting...
            </>
          ) : (
            "Dump it"
          )}
        </button>
      </div>
    </div>
  );
}
