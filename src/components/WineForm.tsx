"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { X, ImageIcon, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { WinePreview } from "@/components/wine-preview"
import { uploadWineImage, deleteWineImage } from "@/lib/storage"
import Image from "next/image"
import { Wine, WineFormData } from "@/types/wine"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { WineCalculatorDialog } from "@/components/wine-calculator-dialog"

interface FormIngredient {
  ingredient_name: string;
  is_allergen: boolean;
}

interface FormCertification {
  certification_name: string;
}

interface WineFormProps {
  initialData?: Wine;
  isEditing?: boolean;
  defaultOpen?: boolean;
}

interface FormData {
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
  optionalLabelling: string;
  countryOfOrigin: string;
  placeOfOrigin: string;
  wineryInformation?: string | null;
  instructionsForUse: string;
  conservationConditions: string;
  drainedWeightGrams: number;
  operatorName: string;
  operatorAddress: string;
  registrationNumber: string;
  imageUrl: string | null;
  ingredients: Array<{
    name: string;
    isAllergen: boolean;
  }>;
  certifications: Array<{
    certificationName: string;
  }>;
  hasGlassBottle: boolean;
  hasAluminumCap: boolean;
  hasCardboardBox: boolean;
  hasCorkStopper: boolean;
}

export function WineForm({ initialData, isEditing = false, defaultOpen = false }: WineFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [ingredients, setIngredients] = useState<Array<{ name: string; isAllergen: boolean }>>([]);
  const [certifications, setCertifications] = useState<Array<{ certificationName: string }>>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [isAllergen, setIsAllergen] = useState(false);
  const [newCertification, setNewCertification] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: '',
    eanCode: '',
    foodName: '',
    energyKj: 0,
    energyKcal: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrate: 0,
    sugars: 0,
    protein: 0,
    salt: 0,
    netQuantityCl: 0,
    hasEstimationSign: false,
    alcoholPercentage: 0,
    optionalLabelling: '',
    countryOfOrigin: '',
    placeOfOrigin: '',
    wineryInformation: '',
    instructionsForUse: '',
    conservationConditions: '',
    drainedWeightGrams: 0,
    operatorName: '',
    operatorAddress: '',
    registrationNumber: '',
    imageUrl: null,
    ingredients: [],
    certifications: [],
    hasGlassBottle: false,
    hasAluminumCap: false,
    hasCardboardBox: false,
    hasCorkStopper: false
  })
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [showDimensionsDialog, setShowDimensionsDialog] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (initialData && isEditing) {
      // Set ingredients from initialData
      const mappedIngredients = initialData.ingredients?.map(i => ({
        name: i.name,
        isAllergen: i.isAllergen
      })) || [];
      setIngredients(mappedIngredients);
      
      // Set certifications from initialData
      const mappedCertifications = initialData.certifications?.map(c => ({
        certificationName: typeof c === 'string' ? c : c.certificationName
      })) || [];
      setCertifications(mappedCertifications);

      // Set form data
      setFormData({
        name: initialData.name,
        eanCode: initialData.ean_code,
        foodName: initialData.food_name,
        energyKj: initialData.energy_kj,
        energyKcal: initialData.energy_kcal,
        fat: initialData.fat,
        saturatedFat: initialData.saturated_fat,
        carbohydrate: initialData.carbohydrate,
        sugars: initialData.sugars,
        protein: initialData.protein,
        salt: initialData.salt,
        netQuantityCl: initialData.net_quantity_cl,
        hasEstimationSign: initialData.has_estimation_sign,
        alcoholPercentage: initialData.alcohol_percentage,
        optionalLabelling: initialData.optional_labelling ?? '',
        countryOfOrigin: initialData.country_of_origin,
        placeOfOrigin: initialData.place_of_origin,
        wineryInformation: initialData.winery_information,
        instructionsForUse: initialData.instructions_for_use ?? '',
        conservationConditions: initialData.conservation_conditions ?? '',
        drainedWeightGrams: initialData.drained_weight_grams ?? 0,
        operatorName: initialData.operator_name,
        operatorAddress: initialData.operator_address,
        registrationNumber: initialData.registration_number,
        imageUrl: initialData.image_url ?? null,
        ingredients: mappedIngredients,
        certifications: mappedCertifications,
        hasGlassBottle: initialData.has_glass_bottle ?? false,
        hasAluminumCap: initialData.has_aluminum_cap ?? false,
        hasCardboardBox: initialData.has_cardboard_box ?? false,
        hasCorkStopper: initialData.has_cork_stopper ?? false
      });

      if (initialData.image_url) {
        setImagePreview(initialData.image_url);
      }
    }
  }, [initialData, isEditing]);

  // Update preview data when ingredients change
  useEffect(() => {
    if (ingredients.length > 0) {
      setFormData(prev => ({
        ...prev,
        ingredients
      }));
    }
  }, [ingredients]);

  // Update preview data when certifications change
  useEffect(() => {
    if (certifications.length > 0) {
      setFormData(prev => ({
        ...prev,
        certifications
      }));
    }
  }, [certifications]);

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const newIngredients = [...ingredients, { 
        name: newIngredient.trim(), 
        isAllergen 
      }];
      setIngredients(newIngredients);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
      setNewIngredient("");
      setIsAllergen(false);
    }
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      const newCertifications = [...certifications, { certificationName: newCertification.trim() }];
      setCertifications(newCertifications);
      setFormData(prev => ({
        ...prev,
        certifications: newCertifications
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
    setFormData(prev => ({
      ...prev,
      certifications: newCertifications
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    
    setFormData((prev: FormData) => {
      if (type === 'number') {
        return {
          ...prev,
          [name]: value ? Number(value) : 0
        }
      }
      if (type === 'checkbox') {
        return {
          ...prev,
          [name]: e.target.checked
        }
      }
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create image element to check dimensions
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = URL.createObjectURL(file);
      });

      if (image.width <= 300 || image.height <= 300) {
        setShowDimensionsDialog(true);
        // Clear the input
        e.target.value = '';
        // Clear the preview and file state
        setImagePreview(null);
        setImageFile(null);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    } catch (error) {
      console.error('Error handling image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al procesar la imagen",
      });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)

      // First create or update the wine without the image
      const endpoint = isEditing ? `/api/wines/${initialData?.id}` : '/api/wines'
      const method = isEditing ? 'PUT' : 'POST'

      // Convert form data to snake_case for the API
      const apiData = {
        name: formData.name || '',
        ean_code: formData.eanCode || '',
        food_name: formData.foodName || '',
        energy_kj: formData.energyKj || 0,
        energy_kcal: formData.energyKcal || 0,
        fat: formData.fat || 0,
        saturated_fat: formData.saturatedFat || 0,
        carbohydrate: formData.carbohydrate || 0,
        sugars: formData.sugars || 0,
        protein: formData.protein || 0,
        salt: formData.salt || 0,
        net_quantity_cl: formData.netQuantityCl || 0,
        has_estimation_sign: formData.hasEstimationSign || false,
        alcohol_percentage: formData.alcoholPercentage || 0,
        optional_labelling: formData.optionalLabelling || '',
        country_of_origin: formData.countryOfOrigin || '',
        place_of_origin: formData.placeOfOrigin || '',
        winery_information: formData.wineryInformation || '',
        instructions_for_use: formData.instructionsForUse || '',
        conservation_conditions: formData.conservationConditions || '',
        drained_weight_grams: formData.drainedWeightGrams || 0,
        operator_name: formData.operatorName || '',
        operator_address: formData.operatorAddress || '',
        registration_number: formData.registrationNumber || '',
        image_url: imageFile ? null : initialData?.image_url,
        ingredients: formData.ingredients.map(i => ({
          ingredient_name: i.name,
          is_allergen: i.isAllergen
        })) || [],
        certifications: formData.certifications.map(c => ({
          certification_name: c.certificationName
        })) || [],
        has_glass_bottle: formData.hasGlassBottle || false,
        has_aluminum_cap: formData.hasAluminumCap || false,
        has_cardboard_box: formData.hasCardboardBox || false,
        has_cork_stopper: formData.hasCorkStopper || false
      }

      console.log('Form Data:', formData);
      console.log('API Data being sent:', apiData);

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      })

      if (!response.ok) {
        throw new Error('Error al guardar el vino')
      }

      const wine = await response.json()

      // Now handle the image upload if there's a new image
      if (imageFile) {
        try {
          // If editing and there's an existing image, delete it
          if (isEditing && initialData?.image_url) {
            await deleteWineImage(initialData.image_url)
          }
          
          // Upload new image with the wine's ID
          const imageUrl = await uploadWineImage(imageFile, wine.id)

          // Update the wine with the new image URL
          const imageUpdateResponse = await fetch(`/api/wines/${wine.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...apiData,
              image_url: imageUrl
            })
          })

          if (!imageUpdateResponse.ok) {
            throw new Error('Error al actualizar la imagen del vino')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al subir la imagen'
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
          })
          // Continue even if image upload fails
        }
      }

      toast({
        title: "Éxito",
        description: isEditing ? "Vino actualizado correctamente" : "Vino creado correctamente",
      })

      router.push('/wines')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al procesar la solicitud",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="grid lg:grid-cols-[1fr,400px] gap-8 items-start">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del producto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-8">
                  {/* Image Upload */}
                  <div className="grid gap-4">
                    <Label>Imagen del producto</Label>
                    <div className="flex flex-col gap-4">
                      {imagePreview ? (
                        <div className="relative w-40 h-40 mx-auto">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 bg-background"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed rounded-lg mx-auto hover:bg-accent/50 transition-colors cursor-pointer"
                             onClick={() => document.getElementById('image-upload')?.click()}>
                          <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Click para subir</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="cursor-pointer"
                        />
                        <p className="text-sm text-muted-foreground text-center">
                          JPG, PNG o WebP. Máximo 2MB.<br/>
                          Dimensiones recomendadas: 1200×1200px
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      defaultValue={initialData?.name} 
                      required 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="eanCode">Código EAN</Label>
                    <Input 
                      id="eanCode" 
                      name="eanCode" 
                      defaultValue={initialData?.ean_code}
                      placeholder="Opcional"
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Introduce el código EAN-13 del producto (código de barras) si lo tienes.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="foodName">Denominación del alimento</Label>
                    <Input 
                      id="foodName" 
                      name="foodName" 
                      defaultValue={initialData?.food_name}
                      required 
                      onChange={(e) => {
                        handleInputChange(e);
                        console.log('Food Name changed:', e.target.value);
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Indicar tipo de vino: tinto, blanco, espumoso, de licor, etc.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Información nutricional</CardTitle>
                    <Dialog defaultOpen={defaultOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Info className="h-4 w-4" />
                          Tolerancias UE
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Tolerancias en la declaración nutricional</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm text-muted-foreground">
                            En las directrices de etiquetado nutricional de la UE (EU 1169/2011), se puede usar "0g" para indicar 
                            niveles insignificantes de grasas, grasas saturadas, proteínas y sal. Estas directrices se encuentran 
                            en la sección 6, tabla 4 de los documentos de orientación de la UE sobre etiquetado nutricional.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Usted es responsable de declarar los valores que excedan estas tolerancias, aunque cuando se trata de 
                            vinos típicos, muchos expertos sugieren que no se necesitan pruebas adicionales si los valores están 
                            dentro de estas tolerancias. Las tolerancias permitidas para el vino están armonizadas dentro de la UE.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Para vinos con menos de 100 g/l de azúcar (que es el caso de la mayoría de los vinos excepto los vinos 
                            dulces), se permite una tolerancia de 2 g/100 ml (equivalente a 20 g/l) para la declaración de azúcares 
                            e hidratos de carbono.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      Introduce los valores nutricionales medios por 100 ml. Utiliza la calculadora para obtener los valores de energía en kJ y kcal.
                    </p>
                    <div className="shrink-0">
                      <WineCalculatorDialog 
                        onCalculate={(values) => {
                          const abv = parseFloat(document.getElementById('alcohol')?.getAttribute('data-abv') || '0');
                          setFormData(prev => ({
                            ...prev,
                            energyKj: values.energyKj,
                            energyKcal: values.energyKcal,
                            carbohydrate: values.carbohydrate,
                            sugars: values.sugars,
                            alcoholPercentage: abv,
                            fat: 0,
                            saturatedFat: 0,
                            protein: 0.1,
                            salt: 0,
                          }));

                          // Actualizar los valores en los inputs
                          const inputs = {
                            energyKj: values.energyKj,
                            energyKcal: values.energyKcal,
                            carbohydrate: values.carbohydrate,
                            sugars: values.sugars,
                            alcoholPercentage: abv,
                            fat: 0,
                            saturatedFat: 0,
                            protein: 0.1,
                            salt: 0,
                          };

                          Object.entries(inputs).forEach(([key, value]) => {
                            const input = document.getElementById(key) as HTMLInputElement;
                            if (input) {
                              input.value = value.toString();
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="energyKj">Energía (kJ)</Label>
                      <Input 
                        id="energyKj" 
                        name="energyKj" 
                        type="number" 
                        step="1"
                        defaultValue={initialData?.energy_kj}
                        required 
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="energyKcal">Energía (kcal)</Label>
                      <Input 
                        id="energyKcal" 
                        name="energyKcal" 
                        type="number" 
                        step="1"
                        defaultValue={initialData?.energy_kcal}
                        required 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fat">Grasas (g)</Label>
                      <Input 
                        id="fat" 
                        name="fat" 
                        type="number" 
                        step="0.1"
                        defaultValue={initialData?.fat}
                        required 
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="saturatedFat">de las cuales saturadas (g)</Label>
                      <Input 
                        id="saturatedFat" 
                        name="saturatedFat" 
                        type="number" 
                        step="0.1"
                        defaultValue={initialData?.saturated_fat}
                        required 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="carbohydrate">Hidratos de carbono (g)</Label>
                      <Input 
                        id="carbohydrate" 
                        name="carbohydrate" 
                        type="number" 
                        step="0.1"
                        defaultValue={initialData?.carbohydrate}
                        required 
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sugars">de los cuales azúcares (g)</Label>
                      <Input 
                        id="sugars" 
                        name="sugars" 
                        type="number" 
                        step="0.1"
                        defaultValue={initialData?.sugars}
                        required 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="protein">Proteínas (g)</Label>
                      <Input 
                        id="protein" 
                        name="protein" 
                        type="number" 
                        step="0.1"
                        defaultValue={initialData?.protein}
                        required 
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="salt">Sal (g)</Label>
                      <Input 
                        id="salt" 
                        name="salt" 
                        type="number" 
                        step="0.1"
                        defaultValue={initialData?.salt}
                        required 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalles del producto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="netQuantityCl">Cantidad neta (cl)</Label>
                      <Input 
                        id="netQuantityCl" 
                        name="netQuantityCl" 
                        type="number" 
                        step="0.1"
                        defaultValue={initialData?.net_quantity_cl}
                        required 
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="alcoholPercentage">Alcohol por Vol. %</Label>
                      <Input 
                        id="alcoholPercentage" 
                        name="alcoholPercentage" 
                        type="number" 
                        step="0.1"
                        defaultValue={initialData?.alcohol_percentage}
                        required 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="hasEstimationSign" className="flex items-center gap-2">
                      Signo de estimación
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                        e
                      </span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasEstimationSign"
                        name="hasEstimationSign"
                        defaultChecked={initialData?.has_estimation_sign}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            hasEstimationSign: checked as boolean
                          }))
                        }}
                      />
                      <Label htmlFor="hasEstimationSign" className="text-sm text-muted-foreground font-normal">
                        Incluir el signo de estimación en la etiqueta
                      </Label>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="optionalLabelling">Otras menciones obligatorias o facultativas</Label>
                    <Input 
                      id="optionalLabelling" 
                      name="optionalLabelling" 
                      defaultValue={initialData?.optional_labelling || ''}
                      placeholder="Opcional"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Origen y procedencia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="countryOfOrigin">País de origen</Label>
                    <Input 
                      id="countryOfOrigin" 
                      name="countryOfOrigin" 
                      defaultValue={initialData?.country_of_origin}
                      required 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="placeOfOrigin">Lugar de procedencia</Label>
                    <Input 
                      id="placeOfOrigin" 
                      name="placeOfOrigin" 
                      defaultValue={initialData?.place_of_origin}
                      required 
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Región específica de origen del vino (ej: Ribera del Duero, Rioja, Penedès, etc.).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del operador</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Datos de la bodega o empresa responsable del producto.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="operatorName">Nombre de la bodega</Label>
                    <Input 
                      id="operatorName" 
                      name="operatorName" 
                      defaultValue={initialData?.operator_name}
                      required 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="operatorAddress">Dirección de la bodega</Label>
                    <Input 
                      id="operatorAddress" 
                      name="operatorAddress" 
                      defaultValue={initialData?.operator_address}
                      required 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="registrationNumber">Número de registro</Label>
                    <Input 
                      id="registrationNumber" 
                      name="registrationNumber" 
                      defaultValue={initialData?.registration_number}
                      required 
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Número de registro sanitario de la bodega.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información adicional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="instructionsForUse">Modo de empleo</Label>
                    <Input 
                      id="instructionsForUse" 
                      name="instructionsForUse" 
                      defaultValue={initialData?.instructions_for_use || ''}
                      placeholder="Opcional"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="conservationConditions">Condiciones de conservación</Label>
                    <Input 
                      id="conservationConditions" 
                      name="conservationConditions" 
                      defaultValue={initialData?.conservation_conditions || ''}
                      placeholder="Opcional"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="drainedWeightGrams">Peso escurrido (g)</Label>
                    <Input 
                      id="drainedWeightGrams" 
                      name="drainedWeightGrams" 
                      type="number"
                      step="1"
                      min="0"
                      defaultValue={initialData?.drained_weight_grams || undefined}
                      placeholder="Opcional"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Materiales reciclables</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Selecciona los materiales reciclables presentes en el producto.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-4 border rounded-lg p-4">
                    <Image
                      src="/icons/reciclado/Verde.webp"
                      alt="GL 70"
                      width={40}
                      height={40}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasGlassBottle"
                          checked={formData.hasGlassBottle}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              hasGlassBottle: checked as boolean
                            }))
                          }}
                        />
                        <Label htmlFor="hasGlassBottle">GL 70</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Botella de vidrio transparente</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 border rounded-lg p-4">
                    <Image
                      src="/icons/reciclado/Amarillo.webp"
                      alt="ALU 41"
                      width={40}
                      height={40}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasAluminumCap"
                          checked={formData.hasAluminumCap}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              hasAluminumCap: checked as boolean
                            }))
                          }}
                        />
                        <Label htmlFor="hasAluminumCap">ALU 41</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Cápsula de aluminio</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 border rounded-lg p-4">
                    <Image
                      src="/icons/reciclado/Azul.webp"
                      alt="PAP 20"
                      width={40}
                      height={40}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasCardboardBox"
                          checked={formData.hasCardboardBox}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              hasCardboardBox: checked as boolean
                            }))
                          }}
                        />
                        <Label htmlFor="hasCardboardBox">PAP 20</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Caja de cartón</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 border rounded-lg p-4">
                    <Image
                      src="/icons/reciclado/Marron.webp"
                      alt="FOR 50"
                      width={40}
                      height={40}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasCorkStopper"
                          checked={formData.hasCorkStopper}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              hasCorkStopper: checked as boolean
                            }))
                          }}
                        />
                        <Label htmlFor="hasCorkStopper">FOR 50</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Tapón de corcho natural</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingredientes</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Lista los ingredientes en orden descendente de peso. Marca la casilla si el ingrediente es un alérgeno.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      placeholder="Añadir ingrediente"
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="isAllergen"
                        checked={isAllergen}
                        onCheckedChange={(checked) => setIsAllergen(checked as boolean)}
                      />
                      <Label htmlFor="isAllergen" className="text-sm">Alérgeno</Label>
                    </div>
                    <Button 
                      type="button"
                      onClick={addIngredient}
                      disabled={!newIngredient.trim()}
                      className="w-full sm:w-auto whitespace-nowrap"
                    >
                      Añadir
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <span>{ingredient.name}</span>
                          {ingredient.isAllergen && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Alérgeno</span>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIngredient(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificaciones</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Añade las certificaciones del vino (D.O., agricultura ecológica, etc.).
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Añadir certificación"
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      onClick={addCertification}
                      disabled={!newCertification.trim()}
                      className="w-full sm:w-auto whitespace-nowrap"
                    >
                      Añadir
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span>{cert.certificationName}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCertification(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || ingredients.length === 0}>
              {loading ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")}
            </Button>
          </div>
        </form>

        <div className="hidden lg:block">
          <div className="sticky top-8">
            <Card>
              <CardContent className="p-6">
                <WinePreview formData={{ 
                  ...formData, 
                  imageUrl: imagePreview,
                  productionVariants: []
                }} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showDimensionsDialog} onOpenChange={setShowDimensionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Imagen demasiado pequeña</DialogTitle>
            <DialogDescription>
              La imagen debe tener un tamaño mínimo de 300x300 píxeles. Por favor, selecciona una imagen más grande.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowDimensionsDialog(false)}>
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
