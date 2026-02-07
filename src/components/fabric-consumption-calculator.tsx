
"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScarfSize {
    id: number;
    scarfWidth: number;
    scarfHeight: number;
    quantity: number;
}

interface CalculationResult {
    scarvesPerRow: number;
    totalRows: number;
    totalFabricLengthM: number;
    error?: string;
}

const formatNumber = (value: number, decimals = 2) => {
    if (isNaN(value)) return '0.00';
    return value.toFixed(decimals);
};

const FABRIC_WIDTHS = [
    { label: '36 inches / 91cm', value: 91 },
    { label: '40 inches / 102cm', value: 102 },
    { label: '42 inches / 107cm', value: 107 },
    { label: '44 inches / 112cm', value: 112 },
    { label: '46 inches / 117cm', value: 117 },
    { label: '50 inches / 127cm', value: 127 },
    { label: '52 inches / 132cm', value: 132 },
    { label: '54 inches / 137cm', value: 137 },
    { label: '56 inches / 142cm', value: 142 },
    { label: '58 inches / 147cm', value: 147 },
    { label: '59 inches / 150cm', value: 150 },
    { label: '60 inches / 152cm', value: 152 },
];


export function FabricConsumptionCalculator() {
    const [fabricWidth, setFabricWidth] = useState(107); // default 1.07m in cm
    const [gapBetweenScarves, setGapBetweenScarves] = useState(0.7);
    const [shrinkagePercentage, setShrinkagePercentage] = useState(2); 
    const [scarfSizes, setScarfSizes] = useState<ScarfSize[]>([
        { id: 1, scarfWidth: 90, scarfHeight: 90, quantity: 100 },
    ]);

    useEffect(() => {
        const storedShrinkage = localStorage.getItem('shrinkagePercentage');
        if (storedShrinkage) {
            setShrinkagePercentage(parseFloat(storedShrinkage));
        }
    }, []);

    const handleShrinkageChange = (value: number) => {
        setShrinkagePercentage(value);
        localStorage.setItem('shrinkagePercentage', String(value));
    };

    const handleAddScarfSize = () => {
        setScarfSizes([...scarfSizes, { id: Date.now(), scarfWidth: 90, scarfHeight: 90, quantity: 100 }]);
    };

    const handleRemoveScarfSize = (id: number) => {
        setScarfSizes(scarfSizes.filter(size => size.id !== id));
    };

    const handleScarfSizeChange = (id: number, field: keyof ScarfSize, value: number) => {
        setScarfSizes(scarfSizes.map(size => size.id === id ? { ...size, [field]: value } : size));
    };

    const calculationResults = useMemo<Map<number, CalculationResult>>(() => {
        const results = new Map<number, CalculationResult>();

        scarfSizes.forEach(size => {
            if (size.scarfWidth <= 0 || size.quantity <= 0 || fabricWidth <= 0) {
                 results.set(size.id, { scarvesPerRow: 0, totalRows: 0, totalFabricLengthM: 0, error: "Invalid inputs" });
                 return;
            }

            const scarfWidthWithGap = size.scarfWidth + gapBetweenScarves;
            if (scarfWidthWithGap <= 0) {
                 results.set(size.id, { scarvesPerRow: 0, totalRows: 0, totalFabricLengthM: 0, error: "Invalid gap" });
                return;
            }
            
            const scarvesPerRow = Math.floor((fabricWidth + gapBetweenScarves) / scarfWidthWithGap);

            if (scarvesPerRow === 0) {
                results.set(size.id, { scarvesPerRow: 0, totalRows: 0, totalFabricLengthM: 0, error: "Scarf wider than fabric" });
                return;
            }
            
            const totalRows = Math.ceil(size.quantity / scarvesPerRow);
            const totalFabricLengthCm = totalRows * (size.scarfHeight + gapBetweenScarves) - gapBetweenScarves;
            const totalFabricLengthM = totalFabricLengthCm / 100;

            results.set(size.id, {
                scarvesPerRow,
                totalRows,
                totalFabricLengthM,
            });
        });
        return results;
    }, [scarfSizes, fabricWidth, gapBetweenScarves]);

    const totalFabricNeededBeforeShrinkage = useMemo(() => {
        return Array.from(calculationResults.values()).reduce((acc, result) => {
            return acc + (result.totalFabricLengthM || 0);
        }, 0);
    }, [calculationResults]);

    const totalFabricNeeded = useMemo(() => {
        return totalFabricNeededBeforeShrinkage * (1 + shrinkagePercentage / 100);
    }, [totalFabricNeededBeforeShrinkage, shrinkagePercentage]);


    return (
        <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Fabric Consumption Calculator</h1>
                <p className="text-muted-foreground mt-1 max-w-2xl">
                    Calculate the total fabric needed based on scarf sizes, fabric width, gaps, and shrinkage.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Fabric & Shrinkage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-1.5">
                                <Label htmlFor="fabric-width">Fabric Width</Label>
                                <Select value={String(fabricWidth)} onValueChange={(value) => setFabricWidth(parseInt(value, 10))}>
                                    <SelectTrigger id="fabric-width">
                                        <SelectValue placeholder="Select fabric width" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FABRIC_WIDTHS.map(width => (
                                            <SelectItem key={width.value} value={String(width.value)}>
                                                {width.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="gap">Gap Between Scarves (cm)</Label>
                                <Input id="gap" type="number" value={gapBetweenScarves} onChange={e => setGapBetweenScarves(parseFloat(e.target.value) || 0)} onWheel={(e) => (e.target as HTMLElement).blur()} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="shrinkage">Shrinkage (%)</Label>
                                <Input id="shrinkage" type="number" value={shrinkagePercentage} onChange={e => handleShrinkageChange(parseFloat(e.target.value) || 0)} onWheel={(e) => (e.target as HTMLElement).blur()} />
                            </div>
                        </CardContent>
                    </Card>

                     <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Scarf Sizes & Quantities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {scarfSizes.map((size, index) => (
                                <div key={size.id} className="p-4 border rounded-lg relative space-y-3">
                                    {scarfSizes.length > 1 && (
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveScarfSize(size.id)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor={`scarf-width-${size.id}`}>Width (cm)</Label>
                                            <Input id={`scarf-width-${size.id}`} type="number" value={size.scarfWidth} onChange={e => handleScarfSizeChange(size.id, 'scarfWidth', parseFloat(e.target.value) || 0)} onWheel={(e) => (e.target as HTMLElement).blur()} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor={`scarf-height-${size.id}`}>Height (cm)</Label>
                                            <Input id={`scarf-height-${size.id}`} type="number" value={size.scarfHeight} onChange={e => handleScarfSizeChange(size.id, 'scarfHeight', parseFloat(e.target.value) || 0)} onWheel={(e) => (e.target as HTMLElement).blur()} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor={`quantity-${size.id}`}>Quantity</Label>
                                        <Input id={`quantity-${size.id}`} type="number" value={size.quantity} onChange={e => handleScarfSizeChange(size.id, 'quantity', parseInt(e.target.value, 10) || 0)} onWheel={(e) => (e.target as HTMLElement).blur()} />
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full" onClick={handleAddScarfSize}>
                                <Plus className="mr-2 h-4 w-4" /> Add Scarf Size
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-8">
                     <Card className="bg-card shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg text-primary">Calculation Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {scarfSizes.map(size => {
                                const result = calculationResults.get(size.id);
                                if (!result) return null;

                                return (
                                <div key={size.id}>
                                    <h3 className="font-semibold text-foreground mb-2">
                                        For {size.scarfWidth}x{size.scarfHeight} cm Scarf ({size.quantity} pcs)
                                    </h3>
                                    {result.error ? (
                                        <p className="text-red-500 text-sm">{result.error}</p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                            <p className="text-muted-foreground">Scarves per Row:</p>
                                            <p className="font-medium">{result.scarvesPerRow}</p>
                                            <p className="text-muted-foreground">Total Rows Needed:</p>
                                            <p className="font-medium">{result.totalRows}</p>
                                            <p className="text-muted-foreground font-bold">Fabric Length Needed:</p>
                                            <p className="font-bold text-primary">{formatNumber(result.totalFabricLengthM)} m</p>
                                        </div>
                                    )}
                                </div>
                                )
                            })}
                            
                            <Separator />

                            <div className="p-4 bg-primary/5 rounded-lg space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <p className="text-muted-foreground">Total Fabric (before shrinkage)</p>
                                    <p className="font-medium">{formatNumber(totalFabricNeededBeforeShrinkage)} m</p>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <p className="text-muted-foreground">Shrinkage ({shrinkagePercentage}%)</p>
                                    <p className="font-medium">{formatNumber(totalFabricNeeded - totalFabricNeededBeforeShrinkage)} m</p>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <p className="text-base font-bold text-primary uppercase tracking-wider">Total Fabric Required</p>
                                    <p className="text-2xl font-bold text-primary tracking-tight">
                                        {formatNumber(totalFabricNeeded)} m
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                     </Card>
                </div>
            </div>
        </div>
    );
}
