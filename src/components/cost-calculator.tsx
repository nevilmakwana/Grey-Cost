"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

export function CostCalculator() {
  /* Product */
  const [scarfSize, setScarfSize] =
    useState<"90x90 cm" | "50x50 cm">("90x90 cm");

  const [printingSize, setPrintingSize] = useState("");
  const [fabricPerPiece, setFabricPerPiece] = useState(1);

  /* Prices */
  const [fabricPrice, setFabricPrice] = useState("");
  const [printingPrice, setPrintingPrice] = useState("");
  const [shrinkage, setShrinkage] = useState("");

  /* Costs */
  const [cuttingCost, setCuttingCost] = useState("");
  const [stitchingCost, setStitchingCost] = useState("");
  const [ironingCost, setIroningCost] = useState("");
  const [packagingCost, setPackagingCost] = useState("");
  const [deliveryCost, setDeliveryCost] = useState("");

  /* Overheads */
  const [defective, setDefective] = useState("");
  const [returns, setReturns] = useState("");
  const [deadStock, setDeadStock] = useState("");
  const [officeMaintenance, setOfficeMaintenance] = useState("");
  const [profitMargin, setProfitMargin] = useState("");

  /* -------- RESET INPUTS (KEY FIX) -------- */
  const resetInputs = () => {
    setFabricPrice("");
    setPrintingPrice("");
    setShrinkage("");

    setCuttingCost("");
    setStitchingCost("");
    setIroningCost("");
    setPackagingCost("");
    setDeliveryCost("");

    setDefective("");
    setReturns("");
    setDeadStock("");
    setOfficeMaintenance("");
    setProfitMargin("");
  };

  /* -------- PRESET EFFECT (UNCHANGED LOGIC) -------- */
  useEffect(() => {
    const preset = PRESETS[scarfSize];
    setPrintingSize(preset.printingSize);
    setFabricPerPiece(preset.fabricPerPiece);
  }, [scarfSize]);

  /* ---------------- Calculations ---------------- */
  const results = useMemo(() => {
    const num = (v: string) => Number(v) || 0;

    const fabricCost =
      fabricPerPiece *
      num(fabricPrice) *
      (1 + num(shrinkage) / 100);

    const productionCost =
      fabricCost +
      num(printingPrice) * fabricPerPiece +
      num(cuttingCost) +
      num(stitchingCost) +
      num(ironingCost);

    const finishedCost =
      productionCost +
      num(packagingCost) +
      num(deliveryCost);

    const overheadPercent =
      num(defective) +
      num(returns) +
      num(deadStock) +
      num(officeMaintenance);

    const overheadValue =
      finishedCost * (overheadPercent / 100);

    const grandTotal = finishedCost + overheadValue;
    const profit = grandTotal * (num(profitMargin) / 100);
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
                  onValueChange={(v) => {
                    setScarfSize(v as "90x90 cm" | "50x50 cm");
                    resetInputs(); // ✅ MAIN FIX
                  }}
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

              {[
                ["Fabric Price", fabricPrice, setFabricPrice],
                ["Printing Price", printingPrice, setPrintingPrice],
                ["Shrinkage", shrinkage, setShrinkage],
              ].map(([label, value, setter]) => (
                <div key={label as string}>
                  <Label>{label}</Label>
                  <Input
                    value={value as string}
                    onChange={(e) => setter(e.target.value)}
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter value"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Costs</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                ["Cutting", cuttingCost, setCuttingCost],
                ["Stitching", stitchingCost, setStitchingCost],
                ["Ironing", ironingCost, setIroningCost],
                ["Packaging", packagingCost, setPackagingCost],
                ["Delivery", deliveryCost, setDeliveryCost],
              ].map(([label, value, setter]) => (
                <div key={label as string}>
                  <Label>{label}</Label>
                  <Input
                    value={value as string}
                    onChange={(e) => setter(e.target.value)}
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter value"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

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
