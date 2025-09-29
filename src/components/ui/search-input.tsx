"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "@/lib/utils";

interface SearchInputProps {
  onSearch?: (query: string) => void;
  onSubmit?: (query: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchInput({
  onSearch,
  onSubmit,
  placeholder = "Search movies...",
  className,
  value: controlledValue,
  onChange,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Если есть onChange, это контролируемый компонент
  const isControlled = onChange !== undefined;
  const value = isControlled ? controlledValue || "" : internalValue;

  const debouncedSearch = debounce((query: string) => {
    onSearch?.(query);
  }, 300);

  useEffect(() => {
    if (onSearch) {
      debouncedSearch(value);
    }
  }, [value, debouncedSearch, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange("");
    } else {
      setInternalValue("");
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(value);
    } else if (e.key === "Escape") {
      handleClear();
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center glass rounded-xl transition-all duration-300",
        isFocused && "ring-2 ring-blue-500/50 bg-white/15",
        className
      )}
    >
      <div className="absolute left-4 flex items-center justify-center">
        <Search className="h-4 w-4 text-white/60" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent px-12 py-3 text-white placeholder:text-white/50 focus:outline-none"
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 flex items-center justify-center rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
