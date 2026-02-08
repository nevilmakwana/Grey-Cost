"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CostInput } from "@/components/cost-input";
import { ResultDisplay } from "@/components/result-display";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

/* -------------------- Utils -------------------- */
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(isNaN(value) ? 0 : value);

/* ------------------- Presets ------------------- */
const PRESETS = {
  "90x90 cm": {
    printingSize: "93.54 x 93.54 cm",
    fabricPerPiece: 1,
  },
  "50x50 cm": {
    printingSize: "53.54 x 53.54 cm",
    fabricPerPiece: 0.27,
  },
};

/* ================= COMPONENT ================= */
export function CostCalculator() {
  /* Product */
  const [scarfSize, setScarfSize] =
    useState<"90x90 cm" | "50x50 cm">("90x90 cm");

  const [printingSize, setPrintingSize] = useState("");
  const [fabricPerPiece, setFabricPerPiece] = useState(1);

  /* Prices */
  const [fabricPrice, setFabricPrice] = useState(38);
  const [printingPrice, setPrintingPrice] = useState(20);
  const [shrinkage, setShrinkage] = useState(2);

  /* Costs */
  const [cuttingCost, setCuttingCost] = useState(2);
  const [stitchingCost, setStitchingCost] = useState(14);
  const [ironingCost, setIroningCost] = useState(4);
  const [packagingCost, setPackagingCost] = useState(9);
  const [deliveryCost, setDeliveryCost] = useState(69);

  /* Overheads */
  const [defective, setDefective] = useState(2);
  const [returns, setReturns] = useState(10);
  const [deadStock, setDeadStock] = useState(5);
  const [officeMaintenance, setOfficeMaintenance] = useState(10);
  const [profitMargin, setProfitMargin] = useState(25);

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    const preset = PRESETS[scarfSize];
    setPrintingSize(preset.printingSize);
    setFabricPerPiece(preset.fabricPerPiece);

    const stored = localStorage.getItem("shrinkagePercentage");
    if (stored) setShrinkage(Number(stored));
  }, [scarfSize]);

  /* -------- SHRINKAGE HANDLER (IMPORTANT FIX) -------- */
  const handleShrinkageChange = (value: number) => {
    setShrinkage(value);
    localStorage.setItem("shrinkagePercentage", String(value));
  };

  /* ---------------- Calculations ---------------- */
  const results = useMemo(() => {
    const fabricCost =
      fabricPerPiece * fabricPrice * (1 + shrinkage / 100);

    const productionCost =
      fabricCost +
      printingPrice * fabricPerPiece +
      cuttingCost +
      stitchingCost +
      ironingCost;

    const finishedCost =
      productionCost + packagingCost + deliveryCost;

    const overheadPercent =
      defective + returns + deadStock + officeMaintenance;

    const overheadValue =
      finishedCost * (overheadPercent / 100);

    const grandTotal = finishedCost + overheadValue;
    const profit = grandTotal * (profitMargin / 100);
    const sellingPrice = grandTotal + profit;

    return {
      fabricCost,
      productionCost,
      overheadValue,
      sellingPrice,
    };
  }, [
    fabricPerPiece,
    fabricPrice,
    printingPrice,
    shrinkage,
    cuttingCost,
    stitchingCost,
    ironingCost,
    packagingCost,
    deliveryCost,
    defective,
    returns,
    deadStock,
    officeMaintenance,
    profitMargin,
  ]);

  /* ================= JSX ================= */
  return (
    <div className="container mx-auto max-w-7xl p-6">
      <h1 className="text-3xl font-bold mb-6">Scarf Cost</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>

            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Scarf Size</Label>
                <Select
                  value={scarfSize}
                  onValueChange={(v) =>
                    setScarfSize(v as "90x90 cm" | "50x50 cm")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90x90 cm">90x90 cm</SelectItem>
                    <SelectItem value="50x50 cm">50x50 cm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Printing Size</Label>
                <Input value={printingSize} disabled />
              </div>

              <div>
                <Label>Fabric / Piece</Label>
                <Input value={`${fabricPerPiece} m`} disabled />
              </div>

              <CostInput
                id="fabric-price"
                label="Fabric Price"
                value={fabricPrice}
                setValue={setFabricPrice}
                unit="/m"
              />

              <CostInput
                id="printing-price"
                label="Printing Price"
                value={printingPrice}
                setValue={setPrintingPrice}
                unit="/m"
              />

              <CostInput
                id="shrinkage"
                label="Shrinkage"
                value={shrinkage}
                setValue={handleShrinkageChange}
                unit="%"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Costs</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <CostInput id="cutting" label="Cutting" value={cuttingCost} setValue={setCuttingCost} />
              <CostInput id="stitching" label="Stitching" value={stitchingCost} setValue={setStitchingCost} />
              <CostInput id="ironing" label="Ironing" value={ironingCost} setValue={setIroningCost} />
              <CostInput id="packaging" label="Packaging" value={packagingCost} setValue={setPackagingCost} />
              <CostInput id="delivery" label="Delivery" value={deliveryCost} setValue={setDeliveryCost} />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="lg:sticky lg:top-6">
          <Card>
            <CardHeader>
              <CardTitle>Final Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ResultDisplay label="Fabric Cost" value={results.fabricCost} />
              <ResultDisplay label="Production Cost" value={results.productionCost} />
              <ResultDisplay label="Overheads" value={results.overheadValue} />
              <Separator />
              <ResultDisplay
                label="Selling Price"
                value={results.sellingPrice}
                isEmphasized
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
