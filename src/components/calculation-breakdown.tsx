
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BreakdownItem {
    label: string;
    value: string | number;
}

interface CalculationBreakdownProps {
    title: string;
    items: BreakdownItem[];
    formula: string;
    total: number;
    unit?: 'currency' | 'm';
}

const formatValue = (value: number, unit: 'currency' | 'm' = 'currency') => {
  if (isNaN(value)) {
    return unit === 'currency' ? '₹0.00' : '0.00 m';
  }
  if (unit === 'currency') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  }
  return `${value.toFixed(2)} m`;
};


export function CalculationBreakdown({ title, items, formula, total, unit = 'currency' }: CalculationBreakdownProps) {
    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0">
                <CardTitle className="text-lg text-primary">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-0 pt-4">
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                    </div>
                ))}
                <Separator className="my-3"/>
                 <div className="text-xs text-muted-foreground bg-stone-50 dark:bg-muted p-2 rounded-md font-mono text-center">
                    {formula}
                </div>
            </CardContent>
            <CardFooter className="p-0 pt-4">
                 <div className="flex justify-between items-baseline w-full mt-2">
                    <p className="font-bold text-base text-primary">Total</p>
                    <p className="font-bold text-xl text-primary">{formatValue(total, unit)}</p>
                </div>
            </CardFooter>
        </Card>
    );
}
