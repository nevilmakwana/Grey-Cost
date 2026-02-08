"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CostInputProps {
  id: string;
  label: string; // ✅ FIX: label added
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  unit?: string;
  className?: string;
}

export function CostInput({
  id,
  label,
  value,
  setValue,
  unit,
  className,
}: CostInputProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value) || 0)}
          onWheel={(e) => (e.target as HTMLElement).blur()}
          className={unit ? "pr-10" : ""}
        />

        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
