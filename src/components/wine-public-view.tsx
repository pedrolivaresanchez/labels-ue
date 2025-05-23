'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Wine } from "@/app/public/wines/[id]/page";
import Image from "next/image";

type Labels = {
  reference: string;
  nutritionalInfo: string;
  additionalDetails: string;
  name: string;
  eanCode: string;
  foodName: string;
  ingredients: string;
  netQuantity: string;
  alcohol: string;
  energyValue: string;
  fats: string;
  saturatedFats: string;
  carbohydrates: string;
  sugars: string;
  proteins: string;
  salt: string;
  countryOfOrigin: string;
  placeOfOrigin: string;
  productionVariants: string;
  certifications: string;
  instructionsForUse: string;
  conservationConditions: string;
  drainedWeight: string;
  operatorData: string;
  operatorName: string;
  operatorAddress: string;
  registration: string;
  grams: string;
  centiliters: string;
  optionalLabelling: string;
  recyclableComponents: string;
  glassBottle: string;
  glassContainer: string;
  aluminumCap: string;
  yellowContainer: string;
  cardboardBox: string;
  blueContainer: string;
  corkStopper: string;
  brownContainer: string;
  recyclingNote: string;
  containsSulfites: string;
  bottle: string;
  greenContainerText: string;
  corkAndCap: string;
  yellowContainerText: string;
  box: string;
  blueContainerText: string;
  plasticFilmAndLabels: string;
}

function NutritionalInfoSkeleton() {
  return (
    <Table>
      <TableBody>
        {Array.from({ length: 8 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function WineViewSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />

        <Accordion type="single" collapsible defaultValue="referencia" className="w-full space-y-4">
          <AccordionItem value="referencia">
            <AccordionTrigger className="text-xl font-semibold">Referencia</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-48" />
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
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-6 w-64" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-4" />
                    <NutritionalInfoSkeleton />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-4 p-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index}>
                        <Skeleton className="h-4 w-36 mb-2" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    ))}
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
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index}>
                        <Skeleton className="h-4 w-36 mb-2" />
                        <Skeleton className="h-6 w-64" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-4 p-6">
                    <Skeleton className="h-6 w-48 mb-4" />
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index}>
                        <Skeleton className="h-4 w-48 mb-2" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function NutritionalInfo({ wine, labels }: { wine: Wine; labels: Labels }) {
  return (
    <Table>
      <TableBody>
        <TableRow className="border-b">
          <TableCell className="font-bold">{labels.energyValue} kJ</TableCell>
          <TableCell className="text-right">{wine.energyKj} kJ</TableCell>
        </TableRow>
        <TableRow className="border-b">
          <TableCell className="font-bold">{labels.energyValue} kcal</TableCell>
          <TableCell className="text-right">{wine.energyKcal} kcal</TableCell>
        </TableRow>
        <TableRow className="border-b">
          <TableCell className="font-bold">{labels.fats}</TableCell>
          <TableCell className="text-right">{wine.fat} g</TableCell>
        </TableRow>
        <TableRow className="border-b">
          <TableCell className="pl-8">{labels.saturatedFats}</TableCell>
          <TableCell className="text-right">{wine.saturatedFat} g</TableCell>
        </TableRow>
        <TableRow className="border-b">
          <TableCell className="font-bold">{labels.carbohydrates}</TableCell>
          <TableCell className="text-right">{wine.carbohydrate} g</TableCell>
        </TableRow>
        <TableRow className="border-b">
          <TableCell className="pl-8">{labels.sugars}</TableCell>
          <TableCell className="text-right">{wine.sugars} g</TableCell>
        </TableRow>
        <TableRow className="border-b">
          <TableCell className="font-bold">{labels.proteins}</TableCell>
          <TableCell className="text-right">{wine.protein} g</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">{labels.salt}</TableCell>
          <TableCell className="text-right">{wine.salt} g</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export function WinePublicView({ wine, labels }: { wine: Wine; labels: Labels }) {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8">
      {/* Image Section - Full width on mobile */}
      {wine.image_url && (
        <div className="mb-8">
          <div className="relative w-full max-w-sm mx-auto aspect-square">
            <Image
              src={wine.image_url}
              alt={wine.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          </div>
        </div>
      )}

      {/* Product Details Card */}
      <Card className="mb-8">
        <CardContent className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{wine.name}</h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-2">{wine.foodName}</p>
            <p className="text-xl sm:text-2xl font-medium">{wine.operatorName}</p>
          </div>

          {/* Product Specifications - More compact on mobile */}
          <div className="flex justify-center items-center gap-4 pt-2">
            <div className="text-center">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{labels.netQuantity}</h3>
              <p className="text-lg sm:text-2xl font-semibold">{wine.netQuantityCl} {labels.centiliters}{wine.hasEstimationSign ? ' ℮' : ''}</p>
            </div>
            <div className="w-px h-8 bg-border" /> {/* Vertical divider */}
            <div className="text-center">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{labels.alcohol}</h3>
              <p className="text-lg sm:text-2xl font-semibold">{wine.alcoholPercentage}% vol</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Icons - Centered on mobile */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex justify-center gap-4">
          <Image
            src="/icons/cervezas_mas18.png"
            alt="Solo mayores de 18"
            width={50}
            height={50}
          />
          <Image
            src="/icons/cervezas_e.png"
            alt="No conducir"
            width={50}
            height={50}
          />
          <Image
            src="/icons/cervezas_c.png"
            alt="No embarazadas"
            width={50}
            height={50}
          />
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Contiene alcohol, consumir con moderación.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={["referencia", "informacion-nutricional", "detalles"]} className="w-full space-y-4">
        <AccordionItem value="referencia">
          <AccordionTrigger className="text-lg sm:text-xl font-semibold">{labels.reference}</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{labels.name}</h3>
                  <p className="text-base sm:text-lg">{wine.name}</p>
                </div>
                {wine.eanCode && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-sm font-medium text-muted-foreground">{labels.eanCode}</dt>
                    <dd className="text-sm">{wine.eanCode}</dd>
                  </div>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="informacion-nutricional">
          <AccordionTrigger className="text-lg sm:text-xl font-semibold">{labels.nutritionalInfo}</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 sm:gap-6">
              <Card>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{labels.foodName}</h3>
                    <p className="text-base sm:text-lg">{wine.foodName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{labels.ingredients}</h3>
                    <div className="text-base sm:text-lg space-x-1">
                      {wine.ingredients.map((ingredient, index) => (
                        <span key={index}>
                          <span className={ingredient.isAllergen ? "font-bold" : ""}>
                            {ingredient.name}
                          </span>
                          {index < wine.ingredients.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                    {wine.ingredients.some(ingredient => ingredient.isAllergen) && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {labels.containsSulfites}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">100 ml</h3>
                  <NutritionalInfo wine={wine} labels={labels} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{labels.netQuantity}</h3>
                    <p className="text-base sm:text-lg">{wine.netQuantityCl} {labels.centiliters}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{labels.alcohol}</h3>
                    <p className="text-base sm:text-lg">{wine.alcoholPercentage}% vol</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="detalles">
          <AccordionTrigger className="text-lg sm:text-xl font-semibold">{labels.additionalDetails}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{labels.ingredients}</h3>
                    <div className="text-base sm:text-lg space-x-1">
                      {wine.ingredients.map((ingredient, index) => (
                        <span key={index}>
                          <span className={ingredient.isAllergen ? "font-bold" : ""}>
                            {ingredient.name}
                          </span>
                          {index < wine.ingredients.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                    {wine.ingredients.some(ingredient => ingredient.isAllergen) && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {labels.containsSulfites}
                      </p>
                    )}
                  </div>

                  {wine.certifications && wine.certifications.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">{labels.certifications}</h3>
                      <div className="text-base sm:text-lg">
                        {wine.certifications.map((cert, index) => (
                          <span key={index}>
                            {cert.certificationName}
                            {index < wine.certifications.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {wine.productionVariants && wine.productionVariants.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">{labels.productionVariants}</h3>
                      <div className="text-base sm:text-lg">
                        {wine.productionVariants.map((variant, index) => (
                          <span key={index}>
                            {variant.variantName}
                            {index < wine.productionVariants.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{labels.countryOfOrigin}</h3>
                    <p className="text-base sm:text-lg">{wine.countryOfOrigin || ''}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{labels.placeOfOrigin}</h3>
                    <p className="text-base sm:text-lg">{typeof wine.placeOfOrigin === 'string' ? wine.placeOfOrigin : ''}</p>
                  </div>
                  {typeof wine.optional_labelling === 'string' && wine.optional_labelling && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">{labels.optionalLabelling}</h3>
                      <p className="text-base sm:text-lg">{wine.optional_labelling}</p>
                    </div>
                  )}
                  {typeof wine.instructionsForUse === 'string' && wine.instructionsForUse && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">{labels.instructionsForUse}</h3>
                      <p className="text-base sm:text-lg">{wine.instructionsForUse}</p>
                    </div>
                  )}
                  {typeof wine.conservationConditions === 'string' && wine.conservationConditions && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">{labels.conservationConditions}</h3>
                      <p className="text-base sm:text-lg">{wine.conservationConditions}</p>
                    </div>
                  )}
                  {typeof wine.drainedWeightGrams === 'number' && wine.drainedWeightGrams > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">{labels.drainedWeight}</h3>
                      <p className="text-base sm:text-lg">{wine.drainedWeightGrams} {labels.grams}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-lg font-semibold mb-4">{labels.operatorData}</h3>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{labels.operatorName}</h3>
                    <p className="text-base sm:text-lg">{wine.operatorName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{labels.operatorAddress}</h3>
                    <p className="text-base sm:text-lg">{wine.operatorAddress}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{labels.registration}</h3>
                    <p className="text-base sm:text-lg">{wine.registrationNumber}</p>
                  </div>
                </CardContent>
              </Card>

              {(wine.has_glass_bottle || wine.has_brown_glass_bottle || wine.has_green_glass_bottle || 
                wine.has_paper_label || wine.has_plastic_label || 
                wine.has_aluminum_cap || wine.has_pvc_cap || wine.has_polystyrene_cap || 
                wine.has_cork_stopper || wine.has_plastic_cork || 
                wine.has_cardboard_box || wine.has_plastic_wrapper) && (
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <h3 className="text-lg font-semibold mb-4">{labels.recyclableComponents}</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {labels.recyclingNote}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Botella */}
                      {(wine.has_glass_bottle || wine.has_brown_glass_bottle || wine.has_green_glass_bottle) && (
                        <div className="border rounded-md p-3">
                          <h4 className="text-base font-medium mb-3">{labels.bottle}</h4>
                          <div className="flex items-center gap-3">
                            <Image
                              src="/icons/reciclado/Verde.webp"
                              alt="Recicla al Verde"
                              width={50}
                              height={50}
                            />
                            <div>
                              <p className="text-sm text-muted-foreground">{labels.greenContainerText}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Corcho y cápsula */}
                      {(wine.has_aluminum_cap || wine.has_pvc_cap || wine.has_polystyrene_cap || 
                        wine.has_cork_stopper || wine.has_plastic_cork) && (
                        <div className="border rounded-md p-3">
                          <h4 className="text-base font-medium mb-3">{labels.corkAndCap}</h4>
                          <div className="flex items-center gap-3">
                            <Image
                              src="/icons/reciclado/Amarillo.webp"
                              alt="Recicla al Amarillo"
                              width={50}
                              height={50}
                            />
                            <div>
                              <p className="text-sm text-muted-foreground">{labels.yellowContainerText}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Caja */}
                      {(wine.has_cardboard_box || wine.has_paper_label) && (
                        <div className="border rounded-md p-3">
                          <h4 className="text-base font-medium mb-3">{labels.box}</h4>
                          <div className="flex items-center gap-3">
                            <Image
                              src="/icons/reciclado/Azul.webp"
                              alt="Recicla al Azul"
                              width={50}
                              height={50}
                            />
                            <div>
                              <p className="text-sm text-muted-foreground">{labels.blueContainerText}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Film plástico y etiquetas de plástico */}
                      {(wine.has_plastic_wrapper || wine.has_plastic_label) && (
                        <div className="border rounded-md p-3">
                          <h4 className="text-base font-medium mb-3">{labels.plasticFilmAndLabels}</h4>
                          <div className="flex items-center gap-3">
                            <Image
                              src="/icons/reciclado/Amarillo.webp"
                              alt="Recicla al Amarillo"
                              width={50}
                              height={50}
                            />
                            <div>
                              <p className="text-sm text-muted-foreground">{labels.yellowContainerText}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}