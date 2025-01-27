import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NutritionalTable } from "@/components/NutritionalTable";
import { ChevronLeft, Eye } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
type Wine = {
  id: string;
  name: string;
  eanCode: string;
  foodName: string;
  energyKj: number;
  energyKcal: number;
  fat: number;
  saturatedFat: number;
  carbohydrate: number;
  sugars: number;
  protein: number;
  salt: number;
  netQuantityCl: number;
  hasEstimationSign: boolean;
  alcoholPercentage: number;
  optionalLabelling: string | null;
  countryOfOrigin: string;
  placeOfOrigin: string;
  wineryInformation: string;
  instructionsForUse: string | null;
  conservationConditions: string | null;
  drainedWeight: number | null;
  operatorName: string;
  operatorAddress: string;
  registrationNumber: string;
  ingredients: { ingredientName: string; isAllergen: boolean }[];
  certifications: { certificationName: string }[];
  productionVariants: { variantName: string }[];
  disclaimerIcons: { iconName: string }[];
  image_url?: string;
};

type DBIngredient = {
  ingredient_name: string;
  is_allergen: boolean;
};

type DBCertification = {
  certification_name: string;
};

type DBProductionVariant = {
  variant_name: string;
};

type DBDisclaimerIcon = {
  icon_name: string;
};

async function getWine(id: string): Promise<Wine> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { data: wine, error } = await supabase
    .from('wines')
    .select(`
      *,
      ingredients (
        id,
        wine_id,
        ingredient_name,
        is_allergen
      ),
      certifications (
        id,
        wine_id,
        certification_name
      ),
      production_variants (
        id,
        wine_id,
        variant_name
      ),
      disclaimer_icons (
        id,
        wine_id,
        icon_name
      )
    `)
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single();

  if (error || !wine) {
    console.error("[WINE_GET] Error:", error);
    notFound();
  }

  // Transform the data to match the expected format
  return {
    ...wine,
    name: wine.name,
    eanCode: wine.ean_code,
    foodName: wine.food_name,
    energyKj: wine.energy_kj,
    energyKcal: wine.energy_kcal,
    fat: wine.fat,
    saturatedFat: wine.saturated_fat,
    carbohydrate: wine.carbohydrate,
    sugars: wine.sugars,
    protein: wine.protein,
    salt: wine.salt,
    netQuantityCl: wine.net_quantity_cl,
    hasEstimationSign: wine.has_estimation_sign,
    alcoholPercentage: wine.alcohol_percentage,
    optionalLabelling: wine.optional_labelling,
    countryOfOrigin: wine.country_of_origin,
    placeOfOrigin: wine.place_of_origin,
    wineryInformation: wine.winery_information,
    instructionsForUse: wine.instructions_for_use,
    conservationConditions: wine.conservation_conditions,
    drainedWeight: wine.drained_weight_grams,
    operatorName: wine.operator_name,
    operatorAddress: wine.operator_address,
    registrationNumber: wine.registration_number,
    ingredients: wine.ingredients?.map((i: DBIngredient) => ({
      ingredientName: i.ingredient_name,
      isAllergen: i.is_allergen
    })) || [],
    certifications: wine.certifications?.map((c: DBCertification) => ({
      certificationName: c.certification_name
    })) || [],
    productionVariants: wine.production_variants?.map((v: DBProductionVariant) => ({
      variantName: v.variant_name
    })) || [],
    disclaimerIcons: wine.disclaimer_icons?.map((d: DBDisclaimerIcon) => ({
      iconName: d.icon_name
    })) || [],
    image_url: wine.image_url
  };
}

export default async function WineViewPage({ params }: { params: { id: string } }) {
  const id = await Promise.resolve(params.id);
  const wine = await getWine(id);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        {/* Breadcrumb and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/wines">
                <ChevronLeft className="h-4 w-4" />
                Volver a la lista
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link href={`/wines/edit/${wine.id}`} className="flex-1 sm:flex-initial">
              <Button className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90">Editar</Button>
            </Link>
            <Link href={`/public/wines/${wine.id}`} className="flex-1 sm:flex-initial">
              <Button variant="outline" className="w-full sm:w-auto">
                <Eye className="h-4 w-4 mr-2" />
                Vista pública
              </Button>
            </Link>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold">{wine.name}</h2>
      
        <div className="space-y-6">
          {/* Wine Image */}
          {wine.image_url && (
            <Card>
              <CardContent className="p-6">
                <div className="relative w-full max-w-md mx-auto aspect-square">
                  <Image
                    src={wine.image_url}
                    alt={wine.name}
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="referencia">
              <AccordionTrigger className="text-xl font-semibold">Referencia</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
                      <p className="text-lg">{wine.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Código EAN</h3>
                      <p className="text-lg">{wine.eanCode}</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="informacion-nutricional">
              <AccordionTrigger className="text-xl font-semibold">Información nutricional</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Denominación del alimento</h3>
                      <p className="text-lg">{wine.foodName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Lista de ingredientes</h3>
                      <p className="text-lg">
                        {wine.ingredients.map((ingredient, index) => (
                          <span key={index}>
                            {ingredient.ingredientName}
                            {index < wine.ingredients.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </p>
                    </div>

                    <NutritionalTable wine={wine} />

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Cantidad neta</h3>
                        <p className="text-lg">{wine.netQuantityCl} Centilitros</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Signo de estimación (e)</h3>
                        <p className="text-lg">{wine.hasEstimationSign ? 'Sí' : 'No'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Porcentaje de alcohol</h3>
                        <p className="text-lg">{wine.alcoholPercentage} % vol</p>
                      </div>
                      {wine.optionalLabelling && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Otras menciones obligatorias o facultativas en la etiqueta</h3>
                          <p className="text-lg">{wine.optionalLabelling}</p>
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">País de origen</h3>
                        <p className="text-lg">{wine.countryOfOrigin}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Lugar de procedencia</h3>
                        <p className="text-lg">{wine.placeOfOrigin}</p>
                      </div>
                      {wine.productionVariants.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Variantes de producción</h3>
                          <p className="text-lg">
                            {wine.productionVariants.map((variant, index) => (
                              <span key={index}>
                                {variant.variantName}
                                {index < wine.productionVariants.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </p>
                        </div>
                      )}
                      {wine.instructionsForUse && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Modo de empleo</h3>
                          <p className="text-lg">{wine.instructionsForUse}</p>
                        </div>
                      )}
                      {wine.conservationConditions && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Condiciones de conservación</h3>
                          <p className="text-lg">{wine.conservationConditions}</p>
                        </div>
                      )}
                      {wine.drainedWeight && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Peso escurrido</h3>
                          <p className="text-lg">{wine.drainedWeight} Gramos</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="datos-operador">
              <AccordionTrigger className="text-xl font-semibold">Datos del operador</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Nombre del operador / importador</h3>
                      <p className="text-lg">{wine.operatorName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Dirección del operador / importador</h3>
                      <p className="text-lg">{wine.operatorAddress}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Registro</h3>
                      <p className="text-lg">{wine.registrationNumber}</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}