'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, HelpCircle, Info } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { calculateWineNutrition } from "@/lib/wine-utils";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

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
  const [preview, setPreview] = useState<{
    energyKj: number;
    energyKcal: number;
    carbohydrate: number;
    sugars: number;
  } | null>(null);

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

    const values = {
      energyKj: result.energyKj,
      energyKcal: result.energyKcal,
      carbohydrate: result.carbohydrate,
      sugars: result.sugars,
    };

    // Store the ABV value in the alcohol input for the form to use
    const alcoholInput = document.getElementById('alcohol');
    if (alcoholInput) {
      alcoholInput.setAttribute('data-abv', abv.toString());
    }

    setPreview(values);
    onCalculate(values);
    setOpen(false);
  };

  const handleCalculatePreview = () => {
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

    setPreview({
      energyKj: result.energyKj,
      energyKcal: result.energyKcal,
      carbohydrate: result.carbohydrate,
      sugars: result.sugars,
    });
  };

  useEffect(() => {
    handleCalculatePreview();
  }, [alcoholByVolume, residualSugar, totalAcidity, glycerol]);

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Calculator className="h-4 w-4" />
            Calcular Energía
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="alcohol">
                    Alcohol por Volumen
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="alcohol"
                      value={alcoholByVolume}
                      onChange={(e) => {
                        setAlcoholByVolume(e.target.value);
                        // Actualizar automáticamente el glicerol
                        const abv = parseFloat(e.target.value) || 0;
                        setGlycerol((abv * 0.79).toFixed(1));
                      }}
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
                        <p className="max-w-xs">
                          Proporciona la acidez total para obtener un cálculo más preciso de la energía. 
                          Puedes introducir 0 para la acidez total, lo que podría causar una variación en el resultado final. 
                          Alternativamente, puedes usar valores generalmente aceptados según la categoría de tu producto. 
                          Siempre recomendamos consultar con asesores legales y autoridades reguladoras para confirmación final.
                        </p>
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
                        <p className="max-w-xs">
                          Para la mayoría de los vinos, el contenido de glicerol se puede aproximar multiplicando el contenido 
                          de alcohol por 0,79. Este campo se actualiza automáticamente basado en el alcohol introducido.
                        </p>
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
            </div>
            <div className="hidden md:block space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Valores nutricionales por 100ml</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Energía (kJ)</TableCell>
                        <TableCell className="text-right">{preview?.energyKj || 0} kJ</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Energía (kcal)</TableCell>
                        <TableCell className="text-right">{preview?.energyKcal || 0} kcal</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Hidratos de carbono</TableCell>
                        <TableCell className="text-right">{preview?.carbohydrate || 0} g</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8">de los cuales azúcares</TableCell>
                        <TableCell className="text-right">{preview?.sugars || 0} g</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={calculateNutrients}>Aplicar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
} 