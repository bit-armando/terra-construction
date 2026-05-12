"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Option {
  label: string;
  value: string;
}

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  options?: Option[]; // if provided → select from list instead of free text
  addLabel?: string;
}

export function ListInput({ value, onChange, placeholder = "Agregar...", options, addLabel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [selectDraft, setSelectDraft] = useState("");

  const available = options
    ? options.filter((o) => !value.includes(o.value))
    : [];

  function add() {
    if (options) {
      if (!selectDraft) return;
      if (value.includes(selectDraft)) return;
      onChange([...value, selectDraft]);
      setSelectDraft("");
    } else {
      const trimmed = draft.trim();
      if (!trimmed || value.includes(trimmed)) return;
      onChange([...value, trimmed]);
      setDraft("");
      inputRef.current?.focus();
    }
  }

  function remove(idx: number) {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  }

  function labelFor(val: string) {
    return options?.find((o) => o.value === val)?.label ?? val;
  }

  return (
    <div className="space-y-2">
      {/* Current items */}
      {value.length > 0 && (
        <ul className="space-y-1.5">
          {value.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm"
            >
              <span className="flex-1 truncate text-foreground">{labelFor(item)}</span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add row */}
      <div className="flex gap-2">
        {options ? (
          <select
            value={selectDraft}
            onChange={(e) => setSelectDraft(e.target.value)}
            disabled={available.length === 0}
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            <option value="">
              {available.length === 0 ? "Sin opciones disponibles" : placeholder}
            </option>
            {available.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); add(); }
            }}
          />
        )}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={add}
          disabled={options ? !selectDraft || available.length === 0 : !draft.trim()}
          className="shrink-0"
          title={addLabel ?? "Agregar"}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
