'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useState, useEffect } from "react";
import { WineFormData } from "@/types/wine";

// Constants for image dimensions
const MAX_IMAGE_DIMENSIONS = 3000;

type Ingredient = {
  ingredientName: string;
  isAllergen: boolean;
};

type ProductionVariant = {
  variantName: string;
};

type Certification = {
  certificationName: string;
};

interface WinePreviewProps {
  formData: WineFormData;
}

function NutritionalInfo({ formData }: WinePreviewProps) {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>valor energético kJ</TableCell>
          <TableCell className="text-right">{formData.energyKj || 0} kJ</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>valor energético kcal</TableCell>
          <TableCell className="text-right">{formData.energyKcal || 0} kcal</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>grasas</TableCell>
          <TableCell className="text-right">{formData.fat || 0} g</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="pl-8">de las cuales saturadas</TableCell>
          <TableCell className="text-right">{formData.saturatedFat || 0} g</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>hidratos de carbono</TableCell>
          <TableCell className="text-right">{formData.carbohydrate || 0} g</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="pl-8">de los cuales azúcares</TableCell>
          <TableCell className="text-right">{formData.sugars || 0} g</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>proteínas</TableCell>
          <TableCell className="text-right">{formData.protein || 0} g</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>sal</TableCell>
          <TableCell className="text-right">{formData.salt || 0} g</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export function WinePreview({ formData }: WinePreviewProps) {
  const [showDimensionsDialog, setShowDimensionsDialog] = useState(false);

  // Function to check image dimensions
  const checkImageDimensions = (url: string) => {
    const img = document.createElement('img');
    img.onload = () => {
      if (img.width > MAX_IMAGE_DIMENSIONS || img.height > MAX_IMAGE_DIMENSIONS) {
        setShowDimensionsDialog(true);
      }
    };
    img.src = url;
  };

  // Check dimensions when imageUrl changes
  useEffect(() => {
    if (formData.imageUrl) {
      checkImageDimensions(formData.imageUrl);
    }
  }, [formData.imageUrl]);

  const renderValue = (value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === 0 || value === '') {
      return '-';
    }
    return value;
  };

  return (
    <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
      <Dialog open={showDimensionsDialog} onOpenChange={setShowDimensionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Imagen demasiado grande</DialogTitle>
          </DialogHeader>
          <p>La imagen supera las dimensiones máximas permitidas de {MAX_IMAGE_DIMENSIONS}x{MAX_IMAGE_DIMENSIONS} píxeles. Por favor, seleccione una imagen más pequeña.</p>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{formData.name || 'Nombre del vino'}</h1>
          <p className="text-lg text-muted-foreground">{formData.foodName || 'Vino Tinto'}</p>
          <p className="text-lg">{formData.operatorName || 'Nombre del operador'}</p>
        </div>

        {/* Image */}
        {formData.imageUrl ? (
          <div className="relative w-full max-w-sm mx-auto aspect-square">
            <Image
              src={formData.imageUrl}
              alt={formData.name || "Vista previa del vino"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        ) : (
          <div className="w-full max-w-sm mx-auto aspect-square bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Sin imagen</p>
          </div>
        )}

        {/* Warning Icons */}
        <div className="flex justify-center gap-3">
          <Image
            src="/icons/cervezas_mas18.png"
            alt="Solo mayores de 18"
            width={40}
            height={40}
          />
          <Image
            src="/icons/cervezas_e.png"
            alt="No conducir"
            width={40}
            height={40}
          />
          <Image
            src="/icons/cervezas_c.png"
            alt="No embarazadas"
            width={40}
            height={40}
          />
        </div>

        {/* Ingredients */}
        {formData.ingredients.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Ingredientes:</h3>
            <p>
              {formData.ingredients.map((ingredient, index) => (
                <span key={index}>
                  <span className={ingredient.isAllergen ? "font-bold" : ""}>
                    {ingredient.name}
                  </span>
                  {index < formData.ingredients.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Production Variants */}
        {formData.productionVariants.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Variantes de producción:</h3>
            <p>
              {formData.productionVariants.map((variant, index) => (
                <span key={index}>
                  {variant.variantName}
                  {index < formData.productionVariants.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Certifications */}
        {formData.certifications.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Certificaciones:</h3>
            <p>
              {formData.certifications.map((cert, index) => (
                <span key={index}>
                  {cert.certificationName}
                  {index < formData.certifications.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>

      <Accordion type="single" collapsible defaultValue="referencia" className="w-full space-y-4">
        <AccordionItem value="referencia">
          <AccordionTrigger className="text-xl font-semibold">Referencia</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
                  <p className="text-lg">{formData.name || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Código EAN</h3>
                  <p className="text-lg">{formData.eanCode || '-'}</p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="informacion-nutricional">
          <AccordionTrigger className="text-xl font-semibold">Información nutricional</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-6">
              <Card>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Denominación del alimento</h3>
                    <p className="text-lg">{formData.foodName || '-'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Lista de ingredientes</h3>
                    <div className="text-lg space-x-1">
                      {formData.ingredients.map((ingredient, index) => (
                        <span key={index}>
                          <span className={ingredient.isAllergen ? "font-bold" : ""}>
                            {ingredient.name}
                          </span>
                          {index < formData.ingredients.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">100 ml</h3>
                  <NutritionalInfo formData={formData} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Cantidad neta</h3>
                    <p className="text-lg">{formData.netQuantityCl || 0} Centilitros</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Signo de estimación (e)</h3>
                    <p className="text-lg">{formData.hasEstimationSign ? 'Sí' : 'No'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Porcentaje de alcohol</h3>
                    <p className="text-lg">{formData.alcoholPercentage || 0}% vol</p>
                  </div>
                  {formData.optionalLabelling && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Otras menciones obligatorias o facultativas</h3>
                      <p className="text-lg">{formData.optionalLabelling}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="detalles">
          <AccordionTrigger className="text-xl font-semibold">Detalles adicionales</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              <Card>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">País de origen</h3>
                    <p className="text-lg">{renderValue(formData.countryOfOrigin)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Lugar de procedencia</h3>
                    <p className="text-lg">{renderValue(formData.placeOfOrigin)}</p>
                  </div>
                  {formData.productionVariants?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Variantes de producción</h3>
                      {formData.productionVariants.map((variant, index) => (
                        <p key={index} className="text-lg">{variant.variantName}</p>
                      ))}
                    </div>
                  )}
                  {formData.certifications?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Certificaciones</h3>
                      {formData.certifications.map((cert, index) => (
                        <p key={index} className="text-lg">{cert.certificationName}</p>
                      ))}
                    </div>
                  )}
                  {formData.instructionsForUse && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Modo de empleo</h3>
                      <p className="text-lg">{formData.instructionsForUse}</p>
                    </div>
                  )}
                  {formData.conservationConditions && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Condiciones de conservación</h3>
                      <p className="text-lg">{formData.conservationConditions}</p>
                    </div>
                  )}
                  {formData.drainedWeightGrams ? (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Peso escurrido</h3>
                      <p className="text-lg">{formData.drainedWeightGrams} Gramos</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-lg font-semibold mb-4">Datos del operador</h3>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Nombre del operador / importador</h3>
                    <p className="text-lg">{formData.operatorName || '-'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Dirección del operador / importador</h3>
                    <p className="text-lg">{formData.operatorAddress || '-'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Registro</h3>
                    <p className="text-lg">{formData.registrationNumber || '-'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 