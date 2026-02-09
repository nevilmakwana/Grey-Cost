"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const formatNumber = (value: number, decimals = 2) => {
    if (isNaN(value)) return '0.00';
    return value.toFixed(decimals);
};

export function ShrinkageReport() {
    const [totalFabricLength, setTotalFabricLength] = useState(0);
    const [shrinkagePercentage, setShrinkagePercentage] = useState(0);

    const handleReset = () => {
        setTotalFabricLength(0);
        setShrinkagePercentage(0);
    };

    const results = useMemo(() => {
        const shrinkageLoss = totalFabricLength * (shrinkagePercentage / 100);
        const usableFabricLength = totalFabricLength - shrinkageLoss;
        const shrinkagePerMeter = shrinkageLoss / totalFabricLength;
        return {
            shrinkageLoss,
            usableFabricLength,
            shrinkagePerMeter,
        };
    }, [totalFabricLength, shrinkagePercentage]);

    return (
        <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Shrinkage Report</h1>
                <p className="text-muted-foreground mt-1 max-w-2xl">
                    Calculate fabric loss due to shrinkage.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Input</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="total-fabric-length" className="text-sm">Total Fabric Length (m)</Label>
                            <Input
                                type="number"
                                inputMode="decimal"
                                id="total-fabric-length"
                                value={totalFabricLength === 0 ? '' : String(totalFabricLength)}
                                onChange={(e) => setTotalFabricLength(parseFloat(e.target.value) || 0)}
                                onWheel={(e) => (e.target as HTMLElement).blur()}
                                className="font-sans text-sm"
                                placeholder=""
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="shrinkage-percentage" className="text-sm">Shrinkage (%)</Label>
                            <Input
                                type="number"
                                inputMode="decimal"
                                id="shrinkage-percentage"
                                value={shrinkagePercentage === 0 ? '' : String(shrinkagePercentage)}
                                onChange={(e) => setShrinkagePercentage(parseFloat(e.target.value) || 0)}
                                onWheel={(e) => (e.target as HTMLElement).blur()}
                                className="font-sans text-sm"
                                placeholder=""
                            />
                        </div>
                        <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleReset}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-card shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg text-primary">Calculation Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Shrinkage Loss (m)</p>
                            <p className="font-medium text-foreground">{formatNumber(results.shrinkageLoss)}</p>
                        </div>
                         <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Usable Fabric Length (m)</p>
                            <p className="font-medium text-foreground">{formatNumber(results.usableFabricLength)}</p>
                        </div>
                         <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Shrinkage per Meter (m)</p>
                            <p className="font-medium text-foreground">{formatNumber(results.shrinkagePerMeter, 4)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}