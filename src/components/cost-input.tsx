"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CostInputProps {
  value: number | string;
  onChange: (value: number) => void;
  suffix?: string;
  className?: string;
  placeholder?: string;
}

export function CostInput({
  value,
  onChange,
  suffix,
  className,
  placeholder,
}: CostInputProps) {
  return (
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  );
}
