
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface CostInputProps {
  label: string;
  id: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>> | ((value: number) => void);
  unit?: string;
  className?: string;
  breakdown?: React.ReactNode;
}

export function CostInput({ label, id, value, setValue, unit, className, breakdown }: CostInputProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center">
        <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
        {breakdown && (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 hover:bg-transparent">
                        <Info className="h-3 w-3 text-muted-foreground" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>{label} Breakdown</DialogTitle>
                </DialogHeader>
                {breakdown}
                </DialogContent>
            </Dialog>
        )}
      </div>
      <div className="relative">
        <Input
          type="number"
          inputMode="decimal"
          id={id}
          value={String(value)}
          onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
          onWheel={(e) => (e.target as HTMLElement).blur()}
          className="pr-10"
          step="0.01"
          aria-label={label}
        />
        {unit && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-muted-foreground pointer-events-none">{unit}</span>}
      </div>
    </div>
  );
}
