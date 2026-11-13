import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";

export interface ComboOption {
  id: string;
  name: string;
}

interface CreatableComboboxProps {
  label: string;
  options: ComboOption[];
  /** Selected option id ("" = none) */
  value: string;
  onChange: (id: string) => void;
  /**
   * Creates a new option and returns it. Throw an Error to show its message.
   * Only offered when no existing option matches the typed name (case-insensitive).
   */
  onCreate?: (name: string) => Promise<ComboOption>;
  placeholder?: string;
  /** Label for the "no selection" choice; omit to hide it */
  emptyLabel?: string;
  maxLength?: number;
  /** Compact toolbar style: visually hidden label, no hint, pill-shaped input */
  variant?: "field" | "filter";
  /** Shown when nothing matches the search */
  noMatchText?: string;
  className?: string;
}

const normalize = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

/**
 * Accessible searchable select (WAI-ARIA combobox) with optional "Create …" for new entries.
 * Keyboard: ↑/↓ to move, Enter to select/create, Esc to close.
 */
export default function CreatableCombobox({
  label,
  options,
  value,
  onChange,
  onCreate,
  placeholder = "Search…",
  emptyLabel,
  maxLength = 60,
  variant = "field",
  noMatchText = "No matching categories",
  className = "",
}: CreatableComboboxProps) {
  const isFilter = variant === "filter";
  const inputId = useId();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const selected = options.find((o) => o.id === value) || null;
  const q = normalize(query);
  const typed = query.trim().replace(/\s+/g, " ");

  const filtered = useMemo(
    () => (q ? options.filter((o) => normalize(o.name).includes(q)) : options),
    [options, q]
  );
  const exactMatch = q ? options.find((o) => normalize(o.name) === q) : undefined;
  const canCreate = Boolean(onCreate && typed && !exactMatch && typed.length <= maxLength);

  // Rows: [empty?] + filtered + [create?]
  type Row = { kind: "empty" } | { kind: "option"; option: ComboOption } | { kind: "create" };
  const rows: Row[] = useMemo(() => {
    const r: Row[] = [];
    if (emptyLabel && !q) r.push({ kind: "empty" });
    filtered.forEach((option) => r.push({ kind: "option", option }));
    if (canCreate) r.push({ kind: "create" });
    return r;
  }, [emptyLabel, q, filtered, canCreate]);

  const safeActive = Math.min(activeIndex, Math.max(0, rows.length - 1));

  // Close when clicking outside
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Keep the highlighted row visible
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${safeActive}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [safeActive, open]);

  const openList = () => {
    setOpen(true);
    setError("");
    const idx = rows.findIndex((r) => r.kind === "option" && r.option.id === value);
    setActiveIndex(idx >= 0 ? idx : 0);
  };

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const choose = (id: string) => {
    onChange(id);
    close();
    inputRef.current?.focus();
  };

  const create = async () => {
    if (!onCreate || !typed) return;
    // Duplicate guard (also enforced server-side)
    const dup = options.find((o) => normalize(o.name) === normalize(typed));
    if (dup) return choose(dup.id);
    setCreating(true);
    setError("");
    try {
      const created = await onCreate(typed);
      choose(created.id);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Could not add this item. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const activate = (row: Row | undefined) => {
    if (!row) return;
    if (row.kind === "empty") choose("");
    else if (row.kind === "option") choose(row.option.id);
    else create();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) return openList();
      setActiveIndex((i) => Math.min(i + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openList();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault(); // never submit the surrounding form from here
      if (open) activate(rows[safeActive]);
      else openList();
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        close();
      }
    } else if (e.key === "Tab") {
      close();
    }
  };

  const optionId = (i: number) => `${listId}-opt-${i}`;

  return (
    <div className={`${isFilter ? "" : "space-y-1.5"} ${className}`} ref={containerRef}>
      <label htmlFor={inputId} className={isFilter ? "sr-only" : "text-xs font-semibold text-gray-300"}>{label}</label>

      <div className="relative">
        <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && rows.length ? optionId(safeActive) : undefined}
          autoComplete="off"
          maxLength={maxLength}
          value={open ? query : selected?.name || ""}
          placeholder={open ? placeholder : selected ? "" : emptyLabel || placeholder}
          onFocus={openList}
          onClick={() => !open && openList()}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
            setError("");
            if (!open) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className={
            isFilter
              ? `w-full bg-[#0e0e12] border border-white/10 rounded-2xl pl-8 pr-14 py-2.5 text-xs focus:outline-none focus:border-[#a855f7] ${
                  open ? "text-gray-200 placeholder-gray-500" : "text-gray-300 placeholder-gray-300"
                }`
              : "w-full bg-gray-900 border border-gray-800 rounded-xl pl-8 pr-14 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#a855f7]"
          }
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {selected && !open && emptyLabel && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label={`Clear ${label}`}
              className="p-1 rounded text-gray-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            tabIndex={-1}
            aria-label={open ? "Close list" : "Open list"}
            onClick={() => (open ? close() : (inputRef.current?.focus(), openList()))}
            className="p-1 rounded text-gray-500 hover:text-white"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {open && (
          <ul
            id={listId}
            ref={listRef}
            role="listbox"
            aria-label={label}
            className={`absolute z-30 left-0 mt-1 max-h-64 overflow-y-auto rounded-xl bg-[#0B0F17] border border-gray-800 shadow-2xl py-1 ${
              isFilter ? "min-w-full w-64" : "right-0"
            }`}
          >
            {rows.length === 0 && (
              <li className="px-3 py-2.5 text-xs text-gray-500" role="presentation">
                {exactMatch && onCreate ? "Already exists" : noMatchText}
              </li>
            )}
            {rows.map((row, i) => {
              const active = i === safeActive;
              const base = `flex items-center justify-between gap-2 px-3 py-2 text-xs cursor-pointer ${active ? "bg-[#7c3aed]/20 text-white" : "text-gray-300"}`;

              if (row.kind === "empty") {
                return (
                  <li key="__empty" id={optionId(i)} data-index={i} role="option" aria-selected={!value}
                    onMouseEnter={() => setActiveIndex(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => activate(row)}
                    className={`${base} italic text-gray-400`}>
                    {emptyLabel}
                    {!value && <Check className="w-3.5 h-3.5 text-[#a855f7]" aria-hidden="true" />}
                  </li>
                );
              }

              if (row.kind === "create") {
                return (
                  <li key="__create" id={optionId(i)} data-index={i} role="option" aria-selected={false}
                    onMouseEnter={() => setActiveIndex(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => activate(row)}
                    className={`${base} border-t border-gray-800 mt-1 text-[#c084fc]`}>
                    <span className="flex items-center gap-1.5 min-w-0">
                      <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{creating ? "Adding…" : <>Add new category “<strong className="text-white">{typed}</strong>”</>}</span>
                    </span>
                  </li>
                );
              }

              const isSelected = row.option.id === value;
              // Highlight the matched part of the name
              const name = row.option.name;
              const at = q ? normalize(name).indexOf(q) : -1;
              return (
                <li key={row.option.id} id={optionId(i)} data-index={i} role="option" aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => activate(row)}
                  className={base}>
                  <span className="truncate">
                    {at >= 0 ? (
                      <>
                        {name.slice(0, at)}
                        <mark className="bg-transparent text-[#c084fc] font-semibold">{name.slice(at, at + q.length)}</mark>
                        {name.slice(at + q.length)}
                      </>
                    ) : (
                      name
                    )}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#a855f7] shrink-0" aria-hidden="true" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && <p className="text-[11px] text-red-400" role="alert">{error}</p>}
      {!isFilter && (
        <p className="text-[10px] text-gray-500">Type to search{onCreate ? ", or add a new category if it doesn't exist" : ""}.</p>
      )}
    </div>
  );
}
