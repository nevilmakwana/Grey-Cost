
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from './ui/separator';
import { CalculationBreakdown } from './calculation-breakdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Info } from 'lucide-react';

const formatNumber = (value: number, decimals = 2) => {
    if (isNaN(value)) return '0.00';
    return value.toFixed(decimals);
};

const formatCurrency = (value: number) => {
  if (isNaN(value)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value);
};

const INCH_TO_METER = 0.0254;

const ResultRow = ({ label, value, unit, breakdown }: { label: string, value: string | number, unit?: string, breakdown?: React.ReactNode }) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center">
            <p className="text-muted-foreground">{label}</p>
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
        <p className="font-medium">{value} {unit}</p>
    </div>
);


export function SewingThreadCalculator() {
    const [quantities, setQuantities] = useState({
        '90x90 cm': 100,
        '50x50 cm': 50,
    });
    const [reelLength, setReelLength] = useState('800');
    const [reelPriceRetail] = useState(7);
    const [reelPriceBulk] = useState(6);
    const [wastageInches, setWastageInches] = useState(12);
    
    const handleQuantityChange = (scarfSize: string, value: string) => {
        setQuantities(prev => ({
            ...prev,
            [scarfSize]: parseInt(value, 10) || 0,
        }));
    };

    const results = useMemo(() => {
        const selectedReelLength = parseInt(reelLength, 10);
        if (selectedReelLength <= 0) return {};

        const wastagePerScarfM = wastageInches * INCH_TO_METER;

        const scarfThreadConsumptionM = {
            '90x90 cm': (((90 * 4) / 100) * 2) + wastagePerScarfM,
            '50x50 cm': (((50 * 4) / 100) * 2) + wastagePerScarfM,
        };

        // Consumption calculations
        const threadFor90cm = quantities['90x90 cm'] * scarfThreadConsumptionM['90x90 cm'];
        const threadFor50cm = quantities['50x50 cm'] * scarfThreadConsumptionM['50x50 cm'];
        const totalThreadNeeded = threadFor90cm + threadFor50cm;

        const reelsNeeded = Math.ceil(totalThreadNeeded / selectedReelLength);
        
        const totalAvailableThread = reelsNeeded * selectedReelLength;
        const remainingThread = totalAvailableThread - totalThreadNeeded;

        const totalCostRetail = reelsNeeded * reelPriceRetail;
        const totalCostBulk = reelsNeeded * reelPriceBulk;

        // Capacity calculations
        const scarvesPerReel90cm = Math.floor(selectedReelLength / scarfThreadConsumptionM['90x90 cm']);
        const scarvesPerReel50cm = Math.floor(selectedReelLength / scarfThreadConsumptionM['50x50 cm']);


        return {
            threadFor90cm,
            threadFor50cm,
            totalThreadNeeded,
            reelsNeeded,
            totalCostRetail,
            totalCostBulk,
            remainingThread,
            scarvesPerReel90cm,
            scarvesPerReel50cm,
            scarfThreadConsumption90cm: scarfThreadConsumptionM['90x90 cm'],
            scarfThreadConsumption50cm: scarfThreadConsumptionM['50x50 cm'],
            wastagePerScarfM,
        }
    }, [quantities, reelLength, reelPriceRetail, reelPriceBulk, wastageInches]);

    return (
        <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Sewing Thread Calculator</h1>
                <p className="text-muted-foreground mt-1 max-w-2xl">
                    Calculate total thread consumption and cost for a batch of scarves with mixed sizes.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Reel Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="space-y-1.5">
                                <Label htmlFor="reel-length" className="text-sm">Reel Length (m)</Label>
                                <Select value={reelLength} onValueChange={setReelLength}>
                                    <SelectTrigger id="reel-length">
                                        <SelectValue placeholder="Select a length" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="300">300 m</SelectItem>
                                        <SelectItem value="800">800 m</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm">Reel Price (Retail)</Label>
                                <p className="font-sans text-sm font-medium">{formatCurrency(reelPriceRetail)}</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm">Reel Price (Bulk)</Label>
                                <p className="font-sans text-sm font-medium">{formatCurrency(reelPriceBulk)}</p>
                            </div>
                             <div className="space-y-1.5">
                                <Label htmlFor="wastage" className="text-sm">Thread Wastage per Scarf (inches)</Label>
                                <Input
                                    type="number"
                                    id="wastage"
                                    value={String(wastageInches)}
                                    onChange={(e) => setWastageInches(parseInt(e.target.value, 10) || 0)}
                                    onWheel={(e) => (e.target as HTMLElement).blur()}
                                    min="0"
                                    className="font-sans text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Scarf Quantities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.keys(quantities).map(size => (
                                <div className="space-y-1.5" key={size}>
                                    <Label htmlFor={`quantity-${size}`} className="text-sm">Quantity ({size})</Label>
                                    <Input
                                        type="number"
                                        id={`quantity-${size}`}
                                        value={String(quantities[size as keyof typeof quantities])}
                                        onChange={(e) => handleQuantityChange(size, e.target.value)}
                                        onWheel={(e) => (e.target as HTMLElement).blur()}
                                        min="0"
                                        className="font-sans text-sm"
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 lg:sticky lg:top-8">
                    <Card className="bg-card shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg text-primary">Consolidated Results</CardTitle>
                             <CardDescription>Calculations for the entire batch of scarves.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Thread Consumption Breakdown</h3>
                                <div className="space-y-2 text-sm">
                                    <ResultRow
                                        label={`Thread for 90x90cm (${quantities['90x90 cm']} pcs)`}
                                        value={formatNumber(results.threadFor90cm || 0)}
                                        unit="m"
                                        breakdown={
                                            <CalculationBreakdown
                                                title="Thread for 90x90cm Breakdown"
                                                items={[
                                                    { label: 'Consumption per Scarf', value: `${formatNumber(results.scarfThreadConsumption90cm || 0)} m`},
                                                    { label: 'Quantity', value: `${quantities['90x90 cm']} pcs`},
                                                ]}
                                                formula={`${formatNumber(results.scarfThreadConsumption90cm || 0)}m * ${quantities['90x90 cm']}`}
                                                total={results.threadFor90cm || 0}
                                                unit="m"
                                            />
                                        }
                                    />
                                     <ResultRow
                                        label={`Thread for 50x50cm (${quantities['50x50 cm']} pcs)`}
                                        value={formatNumber(results.threadFor50cm || 0)}
                                        unit="m"
                                        breakdown={
                                            <CalculationBreakdown
                                                title="Thread for 50x50cm Breakdown"
                                                items={[
                                                    { label: 'Consumption per Scarf', value: `${formatNumber(results.scarfThreadConsumption50cm || 0)} m`},
                                                    { label: 'Quantity', value: `${quantities['50x50 cm']} pcs`},
                                                ]}
                                                formula={`${formatNumber(results.scarfThreadConsumption50cm || 0)}m * ${quantities['50x50 cm']}`}
                                                total={results.threadFor50cm || 0}
                                                unit="m"
                                            />
                                        }
                                    />
                                </div>
                            </div>
                            
                            <Separator />

                            <div className="p-4 bg-primary/5 rounded-lg space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-muted-foreground">Grand Total Thread Required</p>
                                    <p className="font-bold text-primary">{formatNumber(results.totalThreadNeeded || 0)} m</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-muted-foreground">Total Reels Needed ({reelLength}m each)</p>
                                    <p className="font-bold text-primary">{results.reelsNeeded || 0}</p>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <p className="text-muted-foreground">Remaining Thread Length</p>
                                    <p className="font-bold text-primary">{formatNumber(results.remainingThread || 0)} m</p>
                                </div>
                            </div>

                             <Separator />

                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Production Capacity (Per Reel)</h3>
                                <div className="space-y-2 text-sm">
                                    <ResultRow
                                        label="90x90 cm Scarves"
                                        value={`${results.scarvesPerReel90cm || 0} pcs`}
                                        breakdown={
                                            <CalculationBreakdown
                                                title="90x90cm Scarves per Reel"
                                                items={[
                                                    { label: 'Reel Length', value: `${reelLength} m` },
                                                    { label: 'Consumption per Scarf', value: `${formatNumber(results.scarfThreadConsumption90cm || 0)} m`},
                                                ]}
                                                formula={`${reelLength}m / ${formatNumber(results.scarfThreadConsumption90cm || 0)}m`}
                                                total={results.scarvesPerReel90cm || 0}
                                                unit="m"
                                            />
                                        }
                                    />
                                     <ResultRow
                                        label="50x50 cm Scarves"
                                        value={`${results.scarvesPerReel50cm || 0} pcs`}
                                        breakdown={
                                             <CalculationBreakdown
                                                title="50x50cm Scarves per Reel"
                                                items={[
                                                    { label: 'Reel Length', value: `${reelLength} m` },
                                                    { label: 'Consumption per Scarf', value: `${formatNumber(results.scarfThreadConsumption50cm || 0)} m`},
                                                ]}
                                                formula={`${reelLength}m / ${formatNumber(results.scarfThreadConsumption50cm || 0)}m`}
                                                total={results.scarvesPerReel50cm || 0}
                                                unit="m"
                                            />
                                        }
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div className="p-4 border rounded-lg">
                                    <h4 className="font-semibold text-foreground mb-2">Total Cost (Retail)</h4>
                                    <p className="text-2xl font-bold text-primary tracking-tight">
                                        {formatCurrency(results.totalCostRetail || 0)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Based on {formatCurrency(reelPriceRetail)} per reel</p>
                               </div>
                                {reelPriceBulk > 0 && (
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-semibold text-foreground mb-2">Total Cost (Bulk)</h4>
                                        <p className="text-2xl font-bold text-primary tracking-tight">
                                            {formatCurrency(results.totalCostBulk || 0)}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Based on {formatCurrency(reelPriceBulk)} per reel</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
