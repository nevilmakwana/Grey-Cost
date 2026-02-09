"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from './ui/button';
import { Info, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CalculationBreakdown } from './calculation-breakdown';

const formatCurrency = (value: number) => {
  if (isNaN(value)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value);
};

export function FabricLogisticsCalculator() {
    // Stage 1 Inputs
    const [totalRawFabric, setTotalRawFabric] = useState(0);
    const [rawFabricDeliveryCost, setRawFabricDeliveryCost] = useState(0);

    // Stage 2 Inputs
    const [fabricForProcessing, setFabricForProcessing] = useState(0);
    const [processingDeliveryCost, setProcessingDeliveryCost] = useState(0);
    
    // Production Quantities
    const [num90cm, setNum90cm] = useState(0);
    const [num50cm, setNum50cm] = useState(0);

    const handleReset = () => {
        setTotalRawFabric(0);
        setRawFabricDeliveryCost(0);
        setFabricForProcessing(0);
        setProcessingDeliveryCost(0);
        setNum90cm(0);
        setNum50cm(0);
    };

    const calculations = useMemo(() => {
        // Calculate cost from Stage 1 attributed to this processing lot
        const stage1CostForLot = totalRawFabric > 0 ? (fabricForProcessing / totalRawFabric) * rawFabricDeliveryCost : 0;
        
        // Total delivery cost for this specific lot of scarves
        const totalLotDeliveryCost = stage1CostForLot + processingDeliveryCost;
        
        // Distribute the total lot cost across the produced scarves based on weight/area
        const weightFactor90cm = 1.0;
        const weightFactor50cm = 0.265;
        const totalEquivalentUnits = (num90cm * weightFactor90cm) + (num50cm * weightFactor50cm);
        
        const costPerEquivalentUnit = totalEquivalentUnits > 0 ? totalLotDeliveryCost / totalEquivalentUnits : 0;
        
        const deliveryCostPerPiece90cm = costPerEquivalentUnit * weightFactor90cm;
        const deliveryCostPerPiece50cm = costPerEquivalentUnit * weightFactor50cm;
        
        return {
            stage1CostForLot,
            totalLotDeliveryCost,
            totalEquivalentUnits,
            deliveryCostPerPiece90cm,
            deliveryCostPerPiece50cm,
        };
    }, [
        totalRawFabric, rawFabricDeliveryCost,
        fabricForProcessing, processingDeliveryCost,
        num90cm, num50cm
    ]);


    return (
        <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Multi-Stage Logistics</h1>
                <p className="text-muted-foreground mt-1 max-w-2xl">
                    Calculate the total delivery cost per piece across multiple logistics stages, from raw material to finished goods.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="md:col-span-1 space-y-6">
                    <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle>Stage 1: Market to Factory</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="total-raw-fabric">Total Raw Fabric Purchased (m)</Label>
                                <Input
                                    type="number"
                                    inputMode="decimal"
                                    id="total-raw-fabric"
                                    value={totalRawFabric === 0 ? '' : String(totalRawFabric)}
                                    onChange={(e) => setTotalRawFabric(parseFloat(e.target.value) || 0)}
                                    onWheel={(e) => (e.target as HTMLElement).blur()}
                                    placeholder=""
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="raw-fabric-delivery-cost">Delivery Cost (Market to Factory) (₹)</Label>
                                <Input
                                    type="number"
                                    inputMode="decimal"
                                    id="raw-fabric-delivery-cost"
                                    value={rawFabricDeliveryCost === 0 ? '' : String(rawFabricDeliveryCost)}
                                    onChange={(e) => setRawFabricDeliveryCost(parseFloat(e.target.value) || 0)}
                                    onWheel={(e) => (e.target as HTMLElement).blur()}
                                    placeholder=""
                                />
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle>Stage 2: Factory to Warehouse</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-1.5">
                                <Label htmlFor="fabric-for-processing">Fabric Sent for Processing (m)</Label>
                                <Input
                                    type="number"
                                    inputMode="decimal"
                                    id="fabric-for-processing"
                                    value={fabricForProcessing === 0 ? '' : String(fabricForProcessing)}
                                    onChange={(e) => setFabricForProcessing(parseFloat(e.target.value) || 0)}
                                    onWheel={(e) => (e.target as HTMLElement).blur()}
                                    placeholder=""
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="processing-delivery-cost">Delivery Cost (Processing & Return) (₹)</Label>
                                <Input
                                    type="number"
                                    inputMode="decimal"
                                    id="processing-delivery-cost"
                                    value={processingDeliveryCost === 0 ? '' : String(processingDeliveryCost)}
                                    onChange={(e) => setProcessingDeliveryCost(parseFloat(e.target.value) || 0)}
                                    onWheel={(e) => (e.target as HTMLElement).blur()}
                                    placeholder=""
                                />
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle>Production Quantities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="num-90cm-stage2">Quantity (90x90 cm)</Label>
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        id="num-90cm-stage2"
                                        value={num90cm === 0 ? '' : String(num90cm)}
                                        onChange={(e) => setNum90cm(parseInt(e.target.value, 10) || 0)}
                                        onWheel={(e) => (e.target as HTMLElement).blur()}
                                        placeholder=""
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="num-50cm-stage2">Quantity (50x50 cm)</Label>
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        id="num-50cm-stage2"
                                        value={num50cm === 0 ? '' : String(num50cm)}
                                        onChange={(e) => setNum50cm(parseInt(e.target.value, 10) || 0)}
                                        onWheel={(e) => (e.target as HTMLElement).blur()}
                                        placeholder=""
                                    />
                                </div>
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
                </div>

                <div className="md:col-span-1 md:sticky md:top-8">
                     <Card className="bg-card shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary">Logistics Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                                <div className="flex justify-between text-sm">
                                    <p className="text-muted-foreground">Stage 1 Cost for Lot</p>
                                    <p className="font-medium">{formatCurrency(calculations.stage1CostForLot)}</p>
                                </div>
                                 <div className="flex justify-between text-sm">
                                    <p className="text-muted-foreground">Stage 2 Cost</p>
                                    <p className="font-medium">{formatCurrency(processingDeliveryCost)}</p>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                     <div className="flex items-center">
                                        <p className="text-muted-foreground font-semibold">Total Lot Delivery Cost</p>
                                         <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-5 w-5 ml-1.5 hover:bg-transparent">
                                                    <Info className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Total Lot Cost Breakdown</DialogTitle>
                                                </DialogHeader>
                                                <CalculationBreakdown
                                                    title="Total Delivery Cost for this Lot"
                                                    items={[
                                                        { label: 'Attributed Stage 1 Cost', value: formatCurrency(calculations.stage1CostForLot) },
                                                        { label: 'Stage 2 Cost', value: formatCurrency(processingDeliveryCost) },
                                                    ]}
                                                    formula={`${formatCurrency(calculations.stage1CostForLot)} + ${formatCurrency(processingDeliveryCost)}`}
                                                    total={calculations.totalLotDeliveryCost}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <p className="font-bold text-lg text-primary">{formatCurrency(calculations.totalLotDeliveryCost)}</p>
                                </div>
                            </div>
                            
                            <Separator />

                            <div>
                                <h3 className="text-lg font-bold text-primary mb-4">Final Delivery Cost per Piece</h3>
                                <div className="space-y-4">
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <h4 className="font-semibold text-foreground">For 90x90 cm Scarf</h4>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-5 w-5 ml-1.5 hover:bg-transparent">
                                                            <Info className="h-4 w-4 text-muted-foreground" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Cost Breakdown (90cm)</DialogTitle>
                                                        </DialogHeader>
                                                        <CalculationBreakdown
                                                            title="Cost per 90cm Piece"
                                                            items={[
                                                                { label: 'Total Lot Delivery Cost', value: formatCurrency(calculations.totalLotDeliveryCost) },
                                                                { label: 'Total Equivalent Units', value: `${calculations.totalEquivalentUnits.toFixed(2)}` },
                                                                { label: 'Weight Factor', value: '1.0' },
                                                            ]}
                                                            formula={`(${formatCurrency(calculations.totalLotDeliveryCost)} / ${calculations.totalEquivalentUnits.toFixed(2)}) * 1.0`}
                                                            total={calculations.deliveryCostPerPiece90cm}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <p className="text-xl font-bold text-primary tracking-tight">{formatCurrency(calculations.deliveryCostPerPiece90cm)}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <h4 className="font-semibold text-foreground">For 50x50 cm Scarf</h4>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-5 w-5 ml-1.5 hover:bg-transparent">
                                                            <Info className="h-4 w-4 text-muted-foreground" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Cost Breakdown (50cm)</DialogTitle>
                                                        </DialogHeader>
                                                        <CalculationBreakdown
                                                            title="Cost per 50cm Piece"
                                                            items={[
                                                                { label: 'Total Lot Delivery Cost', value: formatCurrency(calculations.totalLotDeliveryCost) },
                                                                { label: 'Total Equivalent Units', value: `${calculations.totalEquivalentUnits.toFixed(2)}` },
                                                                { label: 'Weight Factor', value: '0.265' },
                                                            ]}
                                                            formula={`(${formatCurrency(calculations.totalLotDeliveryCost)} / ${calculations.totalEquivalentUnits.toFixed(2)}) * 0.265`}
                                                            total={calculations.deliveryCostPerPiece50cm}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <p className="text-xl font-bold text-primary tracking-tight">{formatCurrency(calculations.deliveryCostPerPiece50cm)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}