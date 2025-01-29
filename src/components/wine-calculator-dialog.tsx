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
  TooltipProvider,
} from "@/components/ui/tooltip";
import { calculateWineNutrition } from "@/lib/wine-utils";

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
    const abv = parseFloat(alcoholByVolume) || 0;
    const sugar = parseFloat(residualSugar) || 0;
    const acidity = parseFloat(totalAcidity) || 0;
    const glycerolValue = parseFloat(glycerol) || 0;

    const result = calculateWineNutrition({
      abv,
      residualSugar: sugar,
      totalAcidity: acidity,
      glycerol: glycerolValue,
    });

    onCalculate({
      energyKj: result.energyKj,
      energyKcal: result.energyKcal,
      carbohydrate: result.carbohydrate,
      sugars: result.sugars,
    });

    setOpen(false);
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Calculator className="h-4 w-4" />
            Calcular Energía
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Calcular Energía
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Calcula la energía, carbohidratos y azúcares de tu vino
                    proporcionando información básica contenida en un análisis
                    de laboratorio estándar.
                  </p>
                </TooltipContent>
              </Tooltip>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="alcohol">
                Alcohol por Volumen
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="ml-1 inline h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">El contenido de alcohol en porcentaje por volumen.</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="alcohol"
                  value={alcoholByVolume}
                  onChange={(e) => setAlcoholByVolume(e.target.value)}
                  placeholder="13.5"
                  className="flex-1"
                  type="number"
                  step="0.1"
                />
                <span className="text-sm text-muted-foreground">% (Vol.)</span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sugar">
                Azúcar Residual
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="ml-1 inline h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">La cantidad de azúcar que queda después de la fermentación.</p>
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
                  type="number"
                  step="0.1"
                />
                <span className="text-sm text-muted-foreground">g/L</span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="acidity">
                Acidez Total
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="ml-1 inline h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">El contenido total de ácido del vino.</p>
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
                  type="number"
                  step="0.1"
                />
                <span className="text-sm text-muted-foreground">g/L</span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="glycerol">
                Glicerol
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="ml-1 inline h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">El contenido de glicerol producido durante la fermentación.</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="glycerol"
                  value={glycerol}
                  onChange={(e) => setGlycerol(e.target.value)}
                  placeholder="8.0"
                  className="flex-1"
                  type="number"
                  step="0.1"
                />
                <span className="text-sm text-muted-foreground">g/L</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={calculateNutrients}>Calcular</Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
} 