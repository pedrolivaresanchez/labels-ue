"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { WinePreview } from "@/components/wine-preview"
import { uploadWineImage, deleteWineImage } from "@/lib/storage"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Ingredient = {
  ingredient_name: string;
  is_allergen: boolean;
};

type ProductionVariant = {
  variant_name: string;
};

type Certification = {
  certification_name: string;
};

interface WineFormProps {
  initialData?: any;
  isEditing?: boolean;
}

type FormData = {
  name?: string;
  eanCode?: string;
  foodName?: string;
  energyKj?: number;
  energyKcal?: number;
  fat?: number;
  saturatedFat?: number;
  carbohydrate?: number;
  sugars?: number;
  protein?: number;
  salt?: number;
  netQuantityCl?: number;
  hasEstimationSign?: boolean;
  alcoholPercentage?: number;
  optionalLabelling?: string | null;
  countryOfOrigin?: string;
  placeOfOrigin?: string;
  wineryInformation?: string;
  instructionsForUse?: string | null;
  conservationConditions?: string | null;
  drainedWeightGrams?: number | null;
  operatorName?: string;
  operatorAddress?: string;
  registrationNumber?: string;
  imageUrl?: string | null;
  ingredients: { ingredientName: string; isAllergen: boolean }[];
  productionVariants: { variantName: string }[];
  certifications: { certificationName: string }[];
}

export function WineForm({ initialData, isEditing = false }: WineFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [newIngredient, setNewIngredient] = useState("")
  const [isAllergen, setIsAllergen] = useState(false)
  const [productionVariants, setProductionVariants] = useState<ProductionVariant[]>([])
  const [newVariant, setNewVariant] = useState("")
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [newCertification, setNewCertification] = useState("")
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
    productionVariants: [],
    certifications: []
  })
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDimensionsDialog, setShowDimensionsDialog] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (initialData && isEditing) {
      setIngredients(initialData.ingredients?.map((i: any) => ({
        ingredient_name: i.ingredientName,
        is_allergen: i.isAllergen
      })) || [])
      setProductionVariants(initialData.productionVariants?.map((v: any) => ({
        variant_name: v.variantName
      })) || [])
      setCertifications(initialData.certifications?.map((c: any) => ({
        certification_name: c.certificationName
      })) || [])
      // Transform snake_case to camelCase when setting form data
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
        optionalLabelling: initialData.optional_labelling,
        countryOfOrigin: initialData.country_of_origin,
        placeOfOrigin: initialData.place_of_origin,
        wineryInformation: initialData.winery_information,
        instructionsForUse: initialData.instructions_for_use,
        conservationConditions: initialData.conservation_conditions,
        drainedWeightGrams: initialData.drained_weight_grams,
        operatorName: initialData.operator_name,
        operatorAddress: initialData.operator_address,
        registrationNumber: initialData.registration_number,
        imageUrl: initialData.image_url,
        ingredients: initialData.ingredients || [],
        productionVariants: initialData.productionVariants || [],
        certifications: initialData.certifications || []
      })
    }
  }, [initialData, isEditing])

  // Update preview data when ingredients change
  useEffect(() => {
    setFormData((prev: FormData) => ({
      ...prev,
      ingredients: ingredients.map(i => ({
        ingredientName: i.ingredient_name,
        isAllergen: i.is_allergen
      }))
    }))
  }, [ingredients])

  // Update preview data when production variants change
  useEffect(() => {
    setFormData((prev: FormData) => ({
      ...prev,
      productionVariants: productionVariants.map(v => ({
        variantName: v.variant_name
      }))
    }))
  }, [productionVariants])

  // Update preview data when certifications change
  useEffect(() => {
    setFormData((prev: FormData) => ({
      ...prev,
      certifications: certifications.map(c => ({
        certificationName: c.certification_name
      }))
    }))
  }, [certifications])

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, { 
        ingredient_name: newIngredient.trim(), 
        is_allergen: isAllergen 
      }]);
      setNewIngredient("");
      setIsAllergen(false);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    if (newVariant.trim()) {
      setProductionVariants([...productionVariants, { variant_name: newVariant.trim() }]);
      setNewVariant("");
    }
  };

  const removeVariant = (index: number) => {
    setProductionVariants(productionVariants.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, { certification_name: newCertification.trim() }]);
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
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

      if (image.width < 400 || image.height < 400) {
        setShowDimensionsDialog(true);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setImageFile(file);
    } catch (error) {
      console.error('Error handling image:', error);
      toast({
        title: "Error",
        description: "Error al procesar la imagen",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)

      let imageUrl = initialData?.imageUrl;

      // Handle image upload if there's a new image
      if (imageFile) {
        setUploadingImage(true);
        try {
          // If editing and there's an existing image, delete it
          if (isEditing && initialData?.imageUrl) {
            await deleteWineImage(initialData.imageUrl);
          }
          
          // Upload new image
          const tempId = isEditing ? initialData.id : Date.now().toString();
          imageUrl = await uploadWineImage(imageFile, tempId);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Error al subir la imagen",
          });
          setLoading(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // Get form values
      const data = {
        name: formData.name,
        eanCode: formData.eanCode,
        foodName: formData.foodName,
        energyKj: formData.energyKj,
        energyKcal: formData.energyKcal,
        fat: formData.fat,
        saturatedFat: formData.saturatedFat,
        carbohydrate: formData.carbohydrate,
        sugars: formData.sugars,
        protein: formData.protein,
        salt: formData.salt,
        netQuantityCl: formData.netQuantityCl,
        hasEstimationSign: formData.hasEstimationSign,
        alcoholPercentage: formData.alcoholPercentage,
        optionalLabelling: formData.optionalLabelling,
        countryOfOrigin: formData.countryOfOrigin,
        placeOfOrigin: formData.placeOfOrigin,
        wineryInformation: formData.wineryInformation,
        operatorName: formData.operatorName,
        operatorAddress: formData.operatorAddress,
        registrationNumber: formData.registrationNumber,
        imageUrl,
        instructionsForUse: formData.instructionsForUse,
        conservationConditions: formData.conservationConditions,
        drainedWeightGrams: formData.drainedWeightGrams,
        ingredients: ingredients.map(i => ({
          name: i.ingredient_name,
          is_allergen: i.is_allergen
        })),
        production_variants: productionVariants.map(v => ({
          name: v.variant_name
        })),
        certifications: certifications.map(c => ({
          name: c.certification_name
        }))
      };

      const response = await fetch(isEditing ? `/api/wines/${initialData.id}` : "/api/wines", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la etiqueta')
      }

      const wine = await response.json()

      toast({
        variant: "default",
        title: "¡Éxito!",
        description: "La etiqueta se ha guardado correctamente",
      })

      router.push(`/wines/view/${wine.id}`)
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al guardar la etiqueta",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
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
                      defaultValue={initialData?.eanCode}
                      required 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="foodName">Denominación del alimento</Label>
                    <Input 
                      id="foodName" 
                      name="foodName" 
                      defaultValue={initialData?.foodName}
                      required 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutritional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información nutricional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="energyKj">Energía (kJ)</Label>
                      <Input 
                        id="energyKj" 
                        name="energyKj" 
                        type="number" 
                        step="0.1"
                        defaultValue={initialData?.energyKj}
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
                        step="0.1"
                        defaultValue={initialData?.energyKcal}
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
                        defaultValue={initialData?.saturatedFat}
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

            {/* Product Details */}
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
                        defaultValue={initialData?.netQuantityCl}
                        required 
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="alcoholPercentage">Porcentaje de alcohol</Label>
                      <Input 
                        id="alcoholPercentage" 
                        name="alcoholPercentage" 
                        type="number" 
                        step="0.1"
                        defaultValue={initialData?.alcoholPercentage}
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
                        defaultChecked={initialData?.hasEstimationSign}
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
                      defaultValue={initialData?.optionalLabelling}
                      placeholder="Opcional"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Origin Information */}
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
                      defaultValue={initialData?.countryOfOrigin}
                      required 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="placeOfOrigin">Lugar de procedencia</Label>
                    <Input 
                      id="placeOfOrigin" 
                      name="placeOfOrigin" 
                      defaultValue={initialData?.placeOfOrigin}
                      required 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="wineryInformation">Información de la bodega</Label>
                    <Input 
                      id="wineryInformation" 
                      name="wineryInformation" 
                      defaultValue={initialData?.wineryInformation}
                      required 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operator Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información del operador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="operatorName">Nombre del operador</Label>
                    <Input 
                      id="operatorName" 
                      name="operatorName" 
                      defaultValue={initialData?.operatorName}
                      required 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="operatorAddress">Dirección del operador</Label>
                    <Input 
                      id="operatorAddress" 
                      name="operatorAddress" 
                      defaultValue={initialData?.operatorAddress}
                      required 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="registrationNumber">Número de registro</Label>
                    <Input 
                      id="registrationNumber" 
                      name="registrationNumber" 
                      defaultValue={initialData?.registrationNumber}
                      required 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
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
                      defaultValue={initialData?.instructionsForUse}
                      placeholder="Opcional"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="conservationConditions">Condiciones de conservación</Label>
                    <Input 
                      id="conservationConditions" 
                      name="conservationConditions" 
                      defaultValue={initialData?.conservationConditions}
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
                      defaultValue={initialData?.drainedWeightGrams}
                      placeholder="Opcional"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredientes</CardTitle>
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
                          <span>{ingredient.ingredient_name}</span>
                          {ingredient.is_allergen && (
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

            {/* Production Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Variantes de producción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      value={newVariant}
                      onChange={(e) => setNewVariant(e.target.value)}
                      placeholder="Añadir variante"
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      onClick={addVariant}
                      disabled={!newVariant.trim()}
                      className="w-full sm:w-auto whitespace-nowrap"
                    >
                      Añadir
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {productionVariants.map((variant, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span>{variant.variant_name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVariant(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certificaciones</CardTitle>
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
                        <span>{cert.certification_name}</span>
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
                <WinePreview formData={{ ...formData, imageUrl: imagePreview }} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showDimensionsDialog} onOpenChange={setShowDimensionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dimensiones de imagen no válidas</DialogTitle>
            <DialogDescription>
              La imagen debe tener un tamaño mínimo de 400x400 píxeles. Por favor, selecciona una imagen más grande.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowDimensionsDialog(false)}>
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
