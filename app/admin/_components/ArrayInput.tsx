"use client";

import React, { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

interface ArrayInputProps {
  label: string;
  placeholder?: string;
  items: string[];
  onChange: (items: string[]) => void;
  helperText?: string;
}

export const ArrayInput: React.FC<ArrayInputProps> = ({
  label,
  placeholder = "Add item and press Enter or click Add...",
  items = [],
  onChange,
  helperText,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(items.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2.5">
      <label className="block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <div className="flex gap-2.5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-base text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          <FiPlus className="mr-1.5 h-4 w-4" /> Add
        </button>
      </div>
      {helperText && <p className="text-sm text-zinc-400">{helperText}</p>}
      <div className="flex flex-wrap gap-2 pt-1">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-sm text-zinc-200 transition-colors hover:border-zinc-600"
          >
            {item}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="ml-2 text-zinc-400 hover:text-white focus:outline-none"
            >
              <FiX className="h-4 w-4" />
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <span className="text-sm italic text-zinc-500">No items added yet.</span>
        )}
      </div>
    </div>
  );
};
