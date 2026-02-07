
"use client";

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


interface ResultDisplayProps {
  label: string;
  value: number;
  isEmphasized?: boolean;
  className?: string;
  breakdown?: React.ReactNode;
}

const formatCurrency = (value: number) => {
  if (isNaN(value)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
};

export function ResultDisplay({ label, value, isEmphasized = false, className, breakdown }: ResultDisplayProps) {
  const content = (
      <div className={cn("flex justify-between items-center w-full py-1.5 px-2", className)}>
        <div className="flex items-center">
            <p className={cn(
            "text-sm",
            isEmphasized ? "font-bold text-primary" : "text-muted-foreground"
            )}>
            {label}
            </p>
            {breakdown && (
                <Dialog>
                    <DialogTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-5 w-5 ml-1.5 hover:bg-transparent">
                            <Info className="h-4 w-4 text-muted-foreground" />
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
        <p className={cn(
          "font-medium",
          isEmphasized ? "text-lg text-primary" : "text-sm text-foreground"
        )}>
          {formatCurrency(value)}
        </p>
      </div>
  );


  return (
    <div>{content}</div>
  )
}
