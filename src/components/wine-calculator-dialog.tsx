'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import { useState } from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WineCalculatorDialogProps {
  onCalculate: (values: {
    energyKj: number;
    energyKcal: number;
    carbohydrate: number;
    sugars: number;
  }) => void;
}

export function WineCalculatorDialog({ onCalculate }: WineCalculatorDialogProps) {
  const [alcoholByVolume, setAlcoholByVolume] = useState<string>("");
  const [residualSugar, setResidualSugar] = useState<string>("");
  const [totalAcidity, setTotalAcidity] = useState<string>("");
  const [glycerol, setGlycerol] = useState<string>("");
  const [open, setOpen] = useState(false);

  const calculateNutrients = () => {
    const alcohol = parseFloat(alcoholByVolume) || 0;
    const sugar = parseFloat(residualSugar) || 0;
    const acidity = parseFloat(totalAcidity) || 0;
    const glycerolValue = parseFloat(glycerol) || 0;

    // Calculations based on standard wine composition formulas
    const alcoholEnergy = alcohol * 5.65; // kcal per gram of alcohol
    const sugarEnergy = sugar * 4; // kcal per gram of carbohydrates
    const glycerolEnergy = glycerolValue * 4.32; // kcal per gram of glycerol

    const totalKcal = alcoholEnergy + sugarEnergy + glycerolEnergy;
    const totalKj = totalKcal * 4.184; // Convert kcal to kJ

    const carbohydrates = sugar;
    const sugarsValue = sugar;

    onCalculate({
      energyKj: Math.round(totalKj * 10) / 10,
      energyKcal: Math.round(totalKcal * 10) / 10,
      carbohydrate: Math.round(carbohydrates * 10) / 10,
      sugars: Math.round(sugarsValue * 10) / 10,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calculator className="h-4 w-4" />
          Calculate Energy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Calculate Energy
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Calculate the energy, carbohydrates, and sugars of your wine by
                  providing some basic information contained in a standard laboratory
                  analysis.
                </p>
              </TooltipContent>
            </Tooltip>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="alcohol">
              Alcohol by Volume
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="ml-1 inline h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">The alcohol content in percentage by volume.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="alcohol"
                value={alcoholByVolume}
                onChange={(e) => setAlcoholByVolume(e.target.value)}
                placeholder="15.0"
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">% (Vol.)</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sugar">
              Residual Sugar
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="ml-1 inline h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">The amount of sugar remaining after fermentation.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="sugar"
                value={residualSugar}
                onChange={(e) => setResidualSugar(e.target.value)}
                placeholder="2.0"
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">g/L</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="acidity">
              Total Acidity
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="ml-1 inline h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">The total acid content of the wine.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="acidity"
                value={totalAcidity}
                onChange={(e) => setTotalAcidity(e.target.value)}
                placeholder="5.5"
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">g/L</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="glycerol">
              Glycerol
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="ml-1 inline h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">The glycerol content produced during fermentation.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="glycerol"
                value={glycerol}
                onChange={(e) => setGlycerol(e.target.value)}
                placeholder="12.0"
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">g/L</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={calculateNutrients}>Calculate</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 