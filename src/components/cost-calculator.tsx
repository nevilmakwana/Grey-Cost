
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CostInput } from '@/components/cost-input';
import { ResultDisplay } from '@/components/result-display';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CalculationBreakdown } from '@/components/calculation-breakdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PdfDocument } from './pdf-document';
import { renderToString } from 'react-dom/server';

const formatCurrency = (value: number) => {
  if (isNaN(value)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
};

const FABRIC_WIDTH = 1.07; // 1.07 meters

const PRESETS = {
  '90x90 cm': {
    printingSize: '93.54x93.54 cm',
    stitchingCost: 15,
    ironingCost: 2,
    packagingCost: 5,
  },
  '50x50 cm': {
    printingSize: '53.54x53.54 cm',
    stitchingCost: 8,
    ironingCost: 1,
    packagingCost: 4,
  }
};


export function CostCalculator() {
  // Product Specifications
  const [scarfSizes, setScarfSizes] = useState(['90x90 cm', '50x50 cm']);
  const [scarfSize, setScarfSize] = useState(scarfSizes[0] || '');
  const { toast } = useToast();

  const [printingSize, setPrintingSize] = useState('');
  const [fabricPerPiece, setFabricPerPiece] = useState(0);

  const [fabricPrice, setFabricPrice] = useState(38);
  const [printingPrice, setPrintingPrice] = useState(20);
  const [shrinkage, setShrinkage] = useState(2); 

  // Operational Costs
  const [cuttingCost, setCuttingCost] = useState(2);
  const [stitchingCost, setStitchingCost] = useState(14);
  const [ironingCost, setIroningCost] = useState(4);
  const [packagingCost, setPackagingCost] = useState(9.18);
  const [deliveryCost, setDeliveryCost] = useState(69);

  // Losses & Margins
  const [defective, setDefective] = useState(2);
  const [returns, setReturns] = useState(10);
  const [deadStock, setDeadStock] = useState(5);
  const [officeMaintenance, setOfficeMaintenance] = useState(10);
  const [agentCommission, setAgentCommission] = useState(0);
  const [salesOffer, setSalesOffer] = useState(0);
  const [advertisement, setAdvertisement] = useState(5);
  const [profitMargin, setProfitMargin] = useState(25);

  const handleScarfSizeChange = (newSize: string) => {
    setScarfSize(newSize);
    const preset = PRESETS[newSize as keyof typeof PRESETS];
    if (preset) {
        setPrintingSize(preset.printingSize);
        setStitchingCost(preset.stitchingCost);
        setIroningCost(preset.ironingCost);
        setPackagingCost(preset.packagingCost);

        if (newSize === '50x50 cm') {
            const fabricLength = (53.54 * 2) / 100 / 4;
            setFabricPerPiece(parseFloat(fabricLength.toFixed(2)));
        } else if (newSize === '90x90 cm') {
            setFabricPerPiece(1);
        } else {
            const [width] = preset.printingSize.replace(/ cm/g, '').split('x').map(Number);
            const fabricLength = (width / 100);
            setFabricPerPiece(parseFloat(fabricLength.toFixed(2)));
        }
    }
};
  
  useEffect(() => {
    handleScarfSizeChange(scarfSize);
  }, []);

  useEffect(() => {
    const storedShrinkage = localStorage.getItem('shrinkagePercentage');
    if (storedShrinkage) {
        setShrinkage(parseFloat(storedShrinkage));
    }

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'shrinkagePercentage' && event.newValue) {
            setShrinkage(parseFloat(event.newValue));
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const results = useMemo(() => {
    const costOfFabric = fabricPerPiece * fabricPrice * (1 + shrinkage / 100);
    const totalPrintingCost = printingPrice * fabricPerPiece;
    const costOfProduction = costOfFabric + totalPrintingCost + cuttingCost + stitchingCost + ironingCost;
    const totalCostOfProduct = costOfProduction + packagingCost + deliveryCost;

    const percentageOverheads = defective + returns + officeMaintenance + agentCommission + salesOffer + deadStock;
    const percentageOverheadsValue = totalCostOfProduct * (percentageOverheads / 100);
    const totalOverheadsValue = percentageOverheadsValue + advertisement;
    const totalCostWithOverheads = totalCostOfProduct + totalOverheadsValue;
    
    const profitValue = totalCostWithOverheads * (profitMargin / 100);
    const sellingPrice = totalCostWithOverheads + profitValue;

    return {
      costOfFabric,
      totalPrintingCost,
      costOfProduction,
      totalCostOfProduct,
      totalOverheadsValue,
      totalCostWithOverheads,
      profitValue,
      sellingPrice,
      percentageOverheadsValue,
    };
  }, [
    fabricPerPiece, fabricPrice, printingPrice, shrinkage,
    cuttingCost, stitchingCost, ironingCost, packagingCost, deliveryCost,
    defective, returns, officeMaintenance, agentCommission,
    salesOffer, advertisement, profitMargin, deadStock
  ]);
  
  const handleSave = () => {
    const dataToSave = {
        sellingPrice: results.sellingPrice,
        baseCost: results.totalCostWithOverheads,
        productionCost: results.costOfProduction,
        overheadCost: results.totalOverheadsValue,
    };

    if (scarfSize === '90x90 cm') {
        localStorage.setItem('price90cm', JSON.stringify(dataToSave));
    } else if (scarfSize === '50x50 cm') {
        localStorage.setItem('price50cm', JSON.stringify(dataToSave));
    }
    
    toast({
        title: "Calculation Saved",
        description: `The pricing for ${scarfSize} has been saved and will be available in the Combo Offer page.`,
    });
};

  const handleSavePdf = () => {
    handleSave(); // Save data to localStorage first

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfContainer = document.createElement('div');
    
    pdfContainer.style.position = 'fixed';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    
    const data = {
        scarfSize,
        ...results,
        cuttingCost,
        stitchingCost,
        ironingCost,
        packagingCost,
        deliveryCost,
        defective,
        returns,
        deadStock,
        officeMaintenance,
        agentCommission,
        salesOffer,
        advertisement,
        profitMargin,
    };

    const pdfElement = document.createElement('div');
    pdfElement.innerHTML = renderToString(<PdfDocument data={data} />);
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
        pdf.save('cost-calculation.pdf');
        document.body.removeChild(pdfContainer);
        toast({
            title: "PDF Saved",
            description: "The cost calculation has been saved as a PDF.",
        });
    });
};

 const handleShrinkageChange = (value: number) => {
    setShrinkage(value);
    localStorage.setItem('shrinkagePercentage', String(value));
 };

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Scarf Cost Calculator</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          An intuitive tool to accurately calculate the cost and selling price of your textile products. Adjust the parameters below to see real-time price updates.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-3 bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Product Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="scarf-size" className="text-xs text-muted-foreground">Scarf Size</Label>
                <Select value={scarfSize} onValueChange={handleScarfSizeChange}>
                  <SelectTrigger id="scarf-size">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {scarfSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                  <Label htmlFor="printing-size" className="text-xs text-muted-foreground">Printing Size</Label>
                  <Input id="printing-size" value={printingSize} disabled className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fabric-per-piece" className="text-xs text-muted-foreground">Fabric per Piece</Label>
                <div className="relative">
                    <Input id="fabric-per-piece" value={fabricPerPiece} disabled className="text-sm pr-10" />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-muted-foreground pointer-events-none">m</span>
                </div>
              </div>
              <CostInput label="Fabric Price" id="fabric-price" value={fabricPrice} setValue={setFabricPrice} unit="/ m" />
              <CostInput label="Printing Price" id="printing-price" value={printingPrice} setValue={setPrintingPrice} unit="/ m" />
              <CostInput label="Shrinkage" id="shrinkage" value={shrinkage} setValue={handleShrinkageChange} unit="%" />
            </CardContent>
          </Card>

          <Card className="md:col-span-3 bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Operational Costs</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <CostInput label="Cutting" id="cutting-cost" value={cuttingCost} setValue={setCuttingCost} unit="/ pc" />
              <CostInput label="Stitching" id="stitching-cost" value={stitchingCost} setValue={setStitchingCost} unit="/ pc" />
              <CostInput label="Ironing" id="ironing-cost" value={ironingCost} setValue={setIroningCost} unit="/ pc" />
              <CostInput label="Packaging" id="packaging-cost" value={packagingCost} setValue={setPackagingCost} unit="/ pc" />
              <CostInput label="Delivery" id="delivery-cost" value={deliveryCost} setValue={setDeliveryCost} unit="/ pc" />
            </CardContent>
          </Card>

          <Card className="md:col-span-3 bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Losses &amp; Margins</CardTitle>
              <CardDescription>Percentages are calculated on the total cost of the product.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
              <CostInput label="Defective" id="defective" value={defective} setValue={setDefective} unit="%" />
              <CostInput label="Returns" id="returns" value={returns} setValue={setReturns} unit="%" />
              <CostInput label="Dead Stock" id="dead-stock" value={deadStock} setValue={setDeadStock} unit="%" />
              <CostInput label="Maintenance" id="office-maintenance" value={officeMaintenance} setValue={setOfficeMaintenance} unit="%" />
              <CostInput label="Commission" id="agent-commission" value={agentCommission} setValue={setAgentCommission} unit="%" />
              <CostInput label="Sales Offer" id="sales-offer" value={salesOffer} setValue={setSalesOffer} unit="%" />
              <CostInput label="Advertisement" id="advertisement" value={advertisement} setValue={setAdvertisement} unit="₹" />
              <CostInput label="Profit Margin" id="profit-margin" value={profitMargin} setValue={setProfitMargin} unit="%" />
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-8">
          <Card className="shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Cost &amp; Pricing Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <ResultDisplay
                label="Raw Material Cost"
                value={results.costOfFabric}
                breakdown={(
                  <CalculationBreakdown
                    title="Raw Material Cost Breakdown"
                    items={[
                      { label: 'Fabric per Piece', value: `${fabricPerPiece}m` },
                      { label: 'Fabric Price', value: formatCurrency(fabricPrice) + '/m' },
                      { label: 'Shrinkage', value: `${shrinkage}%` },
                    ]}
                    formula={`(${fabricPerPiece}m * ${formatCurrency(fabricPrice)}/m) * (1 + ${shrinkage}%)`}
                    total={results.costOfFabric}
                  />
                )}
              />
              <ResultDisplay
                label="Total Production Cost"
                value={results.costOfProduction}
                 breakdown={(
                  <CalculationBreakdown
                    title="Total Production Cost Breakdown"
                    items={[
                      { label: 'Cost of Fabric', value: formatCurrency(results.costOfFabric) },
                      { label: 'Total Printing Cost', value: formatCurrency(results.totalPrintingCost) },
                      { label: 'Cutting Cost', value: formatCurrency(cuttingCost) },
                      { label: 'Stitching Cost', value: formatCurrency(stitchingCost) },
                      { label: 'Ironing Cost', value: formatCurrency(ironingCost) },
                    ]}
                    formula={`${formatCurrency(results.costOfFabric)} + ${formatCurrency(results.totalPrintingCost)} + ${formatCurrency(cuttingCost)} + ${formatCurrency(stitchingCost)} + ${formatCurrency(ironingCost)}`}
                    total={results.costOfProduction}
                  />
                )}
              />
              <ResultDisplay
                label="Finished Product Cost"
                value={results.totalCostOfProduct}
                isEmphasized
                breakdown={(
                  <CalculationBreakdown
                    title="Finished Product Cost Breakdown"
                    items={[
                      { label: 'Cost of Production', value: formatCurrency(results.costOfProduction) },
                      { label: 'Packaging Cost', value: formatCurrency(packagingCost) },
                      { label: 'Delivery Cost', value: formatCurrency(deliveryCost) },
                    ]}
                    formula={`${formatCurrency(results.costOfProduction)} + ${formatCurrency(packagingCost)} + ${formatCurrency(deliveryCost)}`}
                    total={results.totalCostOfProduct}
                  />
                )}
              />
              <ResultDisplay
                label="Overhead Cost"
                value={results.totalOverheadsValue}
                 breakdown={(
                  <CalculationBreakdown
                    title="Overhead Cost Breakdown"
                    items={[
                      { label: 'Percentage Overheads', value: formatCurrency(results.percentageOverheadsValue) },
                      { label: 'Defective %', value: `${defective}%` },
                      { label: 'Return %', value: `${returns}%` },
                      { label: 'Dead Stock %', value: `${deadStock}%` },
                      { label: 'Office Maintenance %', value: `${officeMaintenance}%` },
                      { label: 'Agent Commission %', value: `${agentCommission}%` },
                      { label: 'Sales Offer %', value: `${salesOffer}%` },
                      { label: 'Advertisement', value: formatCurrency(advertisement) },
                    ]}
                    formula={`${formatCurrency(results.percentageOverheadsValue)} + ${formatCurrency(advertisement)}`}
                    total={results.totalOverheadsValue}
                  />
                )}
              />
              <Separator />
              <ResultDisplay
                label="Grand Total Cost"
                value={results.totalCostWithOverheads}
                 breakdown={(
                  <CalculationBreakdown
                    title="Grand Total Cost Breakdown"
                    items={[
                      { label: 'Total Cost of Product', value: formatCurrency(results.totalCostOfProduct) },
                      { label: 'Total Overheads', value: formatCurrency(results.totalOverheadsValue) },
                    ]}
                    formula={`${formatCurrency(results.totalCostOfProduct)} + ${formatCurrency(results.totalOverheadsValue)}`}
                    total={results.totalCostWithOverheads}
                  />
                )}
              />
              <ResultDisplay
                label="Target Profit"
                value={results.profitValue}
                 breakdown={(
                  <CalculationBreakdown
                    title="Target Profit Breakdown"
                    items={[
                      { label: 'Total Cost with Overheads', value: formatCurrency(results.totalCostWithOverheads) },
                      { label: 'Profit Margin', value: `${profitMargin}%` },
                    ]}
                    formula={`${formatCurrency(results.totalCostWithOverheads)} * ${profitMargin}%`}
                    total={results.profitValue}
                  />
                )}
              />
              
              <Separator className="my-4" />
              
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary/80 uppercase tracking-wider">Final Selling Price</p>
                <p className="text-4xl font-bold text-primary tracking-tight mt-1">
                  {formatCurrency(results.sellingPrice)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button className="w-full" onClick={handleSave}>Save for Combo</Button>
                <Button className="w-full" onClick={handleSavePdf} variant="outline">Download PDF</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
