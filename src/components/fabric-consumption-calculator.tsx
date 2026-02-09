"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ================= TYPES ================= */

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

/* ================= CONSTANTS ================= */

const FABRIC_WIDTHS = [
  { label: "36 inches / 91cm", value: 91 },
  { label: "40 inches / 102cm", value: 102 },
  { label: "42 inches / 107cm", value: 107 },
  { label: "44 inches / 112cm", value: 112 },
  { label: "46 inches / 117cm", value: 117 },
  { label: "50 inches / 127cm", value: 127 },
  { label: "52 inches / 132cm", value: 132 },
  { label: "54 inches / 137cm", value: 137 },
  { label: "56 inches / 142cm", value: 142 },
  { label: "58 inches / 147cm", value: 147 },
  { label: "59 inches / 150cm", value: 150 },
  { label: "60 inches / 152cm", value: 152 },
];

const formatNumber = (value: number, decimals = 2) =>
  isNaN(value) ? "0.00" : value.toFixed(decimals);

/* ================= COMPONENT ================= */

export function FabricConsumptionCalculator() {
  const [fabricWidth, setFabricWidth] = useState(107);
  const [gapBetweenScarves, setGapBetweenScarves] = useState(0);
  const [shrinkagePercentage, setShrinkagePercentage] = useState(0);

  const [scarfSizes, setScarfSizes] = useState<ScarfSize[]>([
    { id: 1, scarfWidth: 0, scarfHeight: 0, quantity: 0 },
  ]);

  useEffect(() => {
    setGapBetweenScarves(0);
    setShrinkagePercentage(0);
    setScarfSizes([{ id: Date.now(), scarfWidth: 0, scarfHeight: 0, quantity: 0 }]);
  }, [fabricWidth]);

  /* ================= CALCULATIONS ================= */

  const calculationResults = useMemo<Map<number, CalculationResult>>(() => {
    const results = new Map<number, CalculationResult>();

    scarfSizes.forEach((size) => {
      if (
        size.scarfWidth <= 0 ||
        size.scarfHeight <= 0 ||
        size.quantity <= 0 ||
        fabricWidth <= 0
      ) {
        results.set(size.id, {
          scarvesPerRow: 0,
          totalRows: 0,
          totalFabricLengthM: 0,
          error: "Invalid inputs",
        });
        return;
      }

      const scarfWidthWithGap = size.scarfWidth + gapBetweenScarves;
      const scarvesPerRow = Math.floor(
        (fabricWidth + gapBetweenScarves) / scarfWidthWithGap
      );

      if (scarvesPerRow <= 0) {
        results.set(size.id, {
          scarvesPerRow: 0,
          totalRows: 0,
          totalFabricLengthM: 0,
          error: "Scarf wider than fabric",
        });
        return;
      }

      const totalRows = Math.ceil(size.quantity / scarvesPerRow);
      const totalFabricLengthCm =
        totalRows * (size.scarfHeight + gapBetweenScarves) -
        gapBetweenScarves;

      results.set(size.id, {
        scarvesPerRow,
        totalRows,
        totalFabricLengthM: totalFabricLengthCm / 100,
      });
    });

    return results;
  }, [scarfSizes, fabricWidth, gapBetweenScarves]);

  const totalBeforeShrinkage = useMemo(
    () =>
      Array.from(calculationResults.values()).reduce(
        (sum, r) => sum + r.totalFabricLengthM,
        0
      ),
    [calculationResults]
  );

  const totalAfterShrinkage = useMemo(
    () =>
      totalBeforeShrinkage * (1 + shrinkagePercentage / 100),
    [totalBeforeShrinkage, shrinkagePercentage]
  );

  /* ================= UI ================= */

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Fabric Consumption</h1>
        <p className="text-muted-foreground mt-1">
          Calculate the total fabric needed based on scarf sizes,
          fabric width, gaps, and shrinkage.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Fabric & Shrinkage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Fabric Width</Label>
                <Select
                  value={String(fabricWidth)}
                  onValueChange={(v) =>
                    setFabricWidth(parseInt(v, 10))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FABRIC_WIDTHS.map((w) => (
                      <SelectItem
                        key={w.value}
                        value={String(w.value)}
                      >
                        {w.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Gap Between Scarves (cm)</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={gapBetweenScarves === 0 ? '' : gapBetweenScarves}
                  onChange={(e) =>
                    setGapBetweenScarves(
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder=""
                />
              </div>

              <div>
                <Label>Shrinkage (%)</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={shrinkagePercentage === 0 ? '' : shrinkagePercentage}
                  onChange={(e) =>
                    setShrinkagePercentage(
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder=""
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Scarf Sizes & Quantities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scarfSizes.map((s) => (
                <div
                  key={s.id}
                  className="border rounded-lg p-4 relative space-y-3"
                >
                  {scarfSizes.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        setScarfSizes((prev) =>
                          prev.filter((x) => x.id !== s.id)
                        )
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Width (cm)</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={s.scarfWidth === 0 ? '' : s.scarfWidth}
                        onChange={(e) =>
                          setScarfSizes((prev) =>
                            prev.map((x) =>
                              x.id === s.id
                                ? {
                                    ...x,
                                    scarfWidth:
                                      parseFloat(e.target.value) || 0,
                                  }
                                : x
                            )
                          )
                        }
                        placeholder=""
                      />
                    </div>

                    <div>
                      <Label>Height (cm)</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={s.scarfHeight === 0 ? '' : s.scarfHeight}
                        onChange={(e) =>
                          setScarfSizes((prev) =>
                            prev.map((x) =>
                              x.id === s.id
                                ? {
                                    ...x,
                                    scarfHeight:
                                      parseFloat(e.target.value) || 0,
                                  }
                                : x
                            )
                          )
                        }
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={s.quantity === 0 ? '' : s.quantity}
                      onChange={(e) =>
                        setScarfSizes((prev) =>
                          prev.map((x) =>
                            x.id === s.id
                              ? {
                                  ...x,
                                  quantity:
                                    parseInt(e.target.value, 10) || 0,
                                }
                              : x
                          )
                        )
                      }
                      placeholder=""
                    />
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setScarfSizes((prev) => [
                    ...prev,
                    {
                      id: Date.now(),
                      scarfWidth: 0,
                      scarfHeight: 0,
                      quantity: 0,
                    },
                  ])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add Scarf Size
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 lg:sticky lg:top-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">
                Calculation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {scarfSizes.map((s) => {
                const r = calculationResults.get(s.id);
                if (!r) return null;

                return (
                  <div key={s.id}>
                    <h3 className="font-semibold mb-2">
                      For {s.scarfWidth}x{s.scarfHeight} cm Scarf (
                      {s.quantity} pcs)
                    </h3>

                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-muted-foreground">
                        Scarves per Row:
                      </span>
                      <span>{r.scarvesPerRow}</span>

                      <span className="text-muted-foreground">
                        Total Rows Needed:
                      </span>
                      <span>{r.totalRows}</span>

                      <span className="font-bold">
                        Fabric Length Needed:
                      </span>
                      <span className="font-bold text-primary">
                        {formatNumber(r.totalFabricLengthM)} m
                      </span>
                    </div>
                  </div>
                );
              })}

              <Separator />

              <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Fabric (before shrinkage)</span>
                  <span>
                    {formatNumber(totalBeforeShrinkage)} m
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>
                    Shrinkage ({shrinkagePercentage}%)
                  </span>
                  <span>
                    {formatNumber(
                      totalAfterShrinkage - totalBeforeShrinkage
                    )}{" "}
                    m
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-primary">
                  <span>TOTAL FABRIC REQUIRED</span>
                  <span>
                    {formatNumber(totalAfterShrinkage)} m
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}