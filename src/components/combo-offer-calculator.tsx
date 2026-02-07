
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from './ui/separator';
import { CostInput } from './cost-input';
import { CalculationBreakdown } from './calculation-breakdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { renderToString } from 'react-dom/server';
import { ComboPdfDocument } from './combo-pdf-document';
import { useToast } from '@/hooks/use-toast';


const formatCurrency = (value: number) => {
    if (isNaN(value)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(value);
};

const formatNumber = (value: number, decimals = 2) => {
    if (isNaN(value)) return '0.00';
    return value.toFixed(decimals);
};

const toTwoDecimals = (value: number) => {
    if (isNaN(value) || value === undefined || value === null) return 0;
    return parseFloat(value.toFixed(2));
}

export function ComboOfferCalculator() {
    const [num90cm, setNum90cm] = useState(1);
    const [num50cm, setNum50cm] = useState(1);
    const [comboDiscount, setComboDiscount] = useState(10); // in percentage

    // Pricing Assumptions
    const [sellingPrice90cm, setSellingPrice90cm] = useState(494.52);
    const [cost90cm, setCost90cm] = useState(395.61);
    const [sellingPrice50cm, setSellingPrice50cm] = useState(210.51);
    const [cost50cm, setCost50cm] = useState(168.41);

    const [costBreakdown90cm, setCostBreakdown90cm] = useState({ productionCost: 0, overheadCost: 0 });
    const [costBreakdown50cm, setCostBreakdown50cm] = useState({ productionCost: 0, overheadCost: 0 });


    const [comboPackagingCost, setComboPackagingCost] = useState(11);
    const [comboDeliveryCost, setComboDeliveryCost] = useState(69);

    const { toast } = useToast();

     useEffect(() => {
        const price90cmData = localStorage.getItem('price90cm');
        if (price90cmData) {
            const { sellingPrice, baseCost, productionCost, overheadCost } = JSON.parse(price90cmData);
            setSellingPrice90cm(toTwoDecimals(sellingPrice));
            setCost90cm(toTwoDecimals(baseCost));
            setCostBreakdown90cm({
                productionCost: toTwoDecimals(productionCost),
                overheadCost: toTwoDecimals(overheadCost)
            });
        }

        const price50cmData = localStorage.getItem('price50cm');
        if (price50cmData) {
            const { sellingPrice, baseCost, productionCost, overheadCost } = JSON.parse(price50cmData);
            setSellingPrice50cm(toTwoDecimals(sellingPrice));
            setCost50cm(toTwoDecimals(baseCost));
            setCostBreakdown50cm({
                productionCost: toTwoDecimals(productionCost),
                overheadCost: toTwoDecimals(overheadCost)
            });
        }
    }, []);

    const results = useMemo(() => {
        const totalScarves = num90cm + num50cm;
        
        const individualPrice90cm = num90cm * sellingPrice90cm;
        const individualPrice50cm = num50cm * sellingPrice50cm;
        const totalIndividualPrice = individualPrice90cm + individualPrice50cm;

        const totalCost = (num90cm * cost90cm) + (num50cm * cost50cm) + comboPackagingCost + comboDeliveryCost;

        const discountAmount = totalIndividualPrice * (comboDiscount / 100);
        const finalComboPrice = totalIndividualPrice - discountAmount;
        
        const customerSaving = totalIndividualPrice - finalComboPrice;
        const profit = finalComboPrice - totalCost;

        return {
            totalScarves,
            totalIndividualPrice,
            finalComboPrice,
            customerSaving,
            profit,
            totalCost
        };

    }, [num90cm, num50cm, comboDiscount, sellingPrice90cm, cost90cm, sellingPrice50cm, cost50cm, comboPackagingCost, comboDeliveryCost]);

    const handleSavePdf = () => {
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pdfContainer = document.createElement('div');
        
        pdfContainer.style.position = 'fixed';
        pdfContainer.style.left = '-9999px';
        pdfContainer.style.top = '0';
        
        const data = {
            num90cm,
            num50cm,
            comboDiscount,
            sellingPrice90cm,
            cost90cm,
            sellingPrice50cm,
            cost50cm,
            ...results,
        };

        const pdfElement = document.createElement('div');
        pdfElement.innerHTML = renderToString(<ComboPdfDocument data={data} />);
        pdfContainer.appendChild(pdfElement);
        document.body.appendChild(pdfContainer);
        
        const contentToCapture = pdfElement.firstChild as HTMLElement;

        if (!contentToCapture) {
          console.error("PDF content not found");
          document.body.removeChild(pdfContainer);
          return;
        }

        html2canvas(contentToCapture, {
            scale: 2,
            useCORS: true, 
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('combo-offer-analysis.pdf');
            document.body.removeChild(pdfContainer);
            toast({
                title: "PDF Saved",
                description: "The combo offer analysis has been saved as a PDF.",
            });
        });
    };

    return (
        <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Combo Offer Calculator</h1>
                <p className="text-muted-foreground mt-1 max-w-2xl">
                    Create and analyze combo deals for your scarves to boost sales and provide value.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-8">
                    <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Combo Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="num-90cm" className="text-sm">Number of 90x90cm Scarves</Label>
                                <Input
                                    type="number"
                                    id="num-90cm"
                                    value={String(num90cm)}
                                    onChange={(e) => setNum90cm(parseInt(e.target.value, 10) || 0)}
                                    onWheel={(e) => (e.target as HTMLElement).blur()}
                                    min="0"
                                    className="font-sans text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="num-50cm" className="text-sm">Number of 50x50cm Scarves</Label>
                                <Input
                                    type="number"
                                    id="num-50cm"
                                    value={String(num50cm)}
                                    onChange={(e) => setNum50cm(parseInt(e.target.value, 10) || 0)}
                                    onWheel={(e) => (e.target as HTMLElement).blur()}
                                    min="0"
                                    className="font-sans text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="combo-discount" className="text-sm">Combo Discount (%)</Label>
                                <Input
                                    type="number"
                                    id="combo-discount"
                                    value={String(comboDiscount)}
                                    onChange={(e) => setComboDiscount(parseFloat(e.target.value) || 0)}
                                    onWheel={(e) => (e.target as HTMLElement).blur()}
                                    className="font-sans text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Pricing Assumptions</CardTitle>
                            <CardDescription>Enter the price and cost for each scarf size. You can auto-fill these from the main calculator.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                             <CostInput label="Selling Price (90cm)" id="price-90cm" value={sellingPrice90cm} setValue={setSellingPrice90cm} unit="₹" />
                             <CostInput 
                                label="Cost (90cm)" 
                                id="cost-90cm" 
                                value={cost90cm} 
                                setValue={setCost90cm} 
                                unit="₹"
                                breakdown={(
                                    <CalculationBreakdown
                                      title="Cost Breakdown (90cm)"
                                      items={[
                                        { label: 'Total Production Cost', value: formatCurrency(costBreakdown90cm.productionCost) },
                                        { label: 'Overhead Cost', value: formatCurrency(costBreakdown90cm.overheadCost) },
                                      ]}
                                      formula={`${formatCurrency(costBreakdown90cm.productionCost)} + ${formatCurrency(costBreakdown90cm.overheadCost)}`}
                                      total={cost90cm}
                                    />
                                )}
                              />
                             <CostInput label="Selling Price (50cm)" id="price-50cm" value={sellingPrice50cm} setValue={setSellingPrice50cm} unit="₹" />
                             <CostInput 
                                label="Cost (50cm)" 
                                id="cost-50cm" 
                                value={cost50cm} 
                                setValue={setCost50cm} 
                                unit="₹" 
                                breakdown={(
                                    <CalculationBreakdown
                                      title="Cost Breakdown (50cm)"
                                      items={[
                                        { label: 'Total Production Cost', value: formatCurrency(costBreakdown50cm.productionCost) },
                                        { label: 'Overhead Cost', value: formatCurrency(costBreakdown50cm.overheadCost) },
                                      ]}
                                      formula={`${formatCurrency(costBreakdown50cm.productionCost)} + ${formatCurrency(costBreakdown50cm.overheadCost)}`}
                                      total={cost50cm}
                                    />
                                )}
                             />
                           </div>
                        </CardContent>
                    </Card>
                </div>


                <div className="md:col-span-2">
                    <Card className="bg-card shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg text-primary">Deal Analysis</CardTitle>
                            <CardDescription>Based on the pricing assumptions provided.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-muted-foreground">Total Scarves in Combo</p>
                                <p className="font-medium text-foreground">{results.totalScarves}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-muted-foreground">Total Price (If Bought Individually)</p>
                                <p className="font-medium text-foreground">{formatCurrency(results.totalIndividualPrice)}</p>
                            </div>
                            
                            <Separator />

                            <div className="flex justify-between items-center font-bold text-primary">
                                <p>Final Combo Price</p>
                                <p className="text-2xl">{formatCurrency(results.finalComboPrice)}</p>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center">
                                <p className="text-muted-foreground">Customer's Saving</p>
                                <p className="font-medium text-green-600 dark:text-green-500">
                                    {formatCurrency(results.customerSaving)} ({formatNumber(comboDiscount)}%)
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-muted-foreground">Your Profit on this Combo</p>
                                <p className="font-medium text-foreground">{formatCurrency(results.profit)}</p>
                            </div>

                             <Button className="w-full mt-4" onClick={handleSavePdf}>Download PDF</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
