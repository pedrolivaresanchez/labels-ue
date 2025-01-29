interface WineNutritionInput {
  abv: number;
  residualSugar: number;
  totalAcidity: number;
  glycerol: number;
}

interface WineNutritionResult {
  totalCalories: number;  // kcal/L
  totalCarbohydrates: number;  // g/L
  residualSugar: number;  // g/L
  energyKj: number;  // kJ/100ml
  energyKcal: number;  // kcal/100ml
  carbohydrate: number;  // g/100ml
  sugars: number;  // g/100ml
}

/**
 * Calculates the energy, carbohydrates and sugars of a wine.
 * @param abv Alcohol by volume (% Vol.)
 * @param residualSugar Residual sugar (g/L)
 * @param totalAcidity Total acidity (g/L) - Does not directly impact energy
 * @param glycerol Glycerol (g/L)
 * @returns Object with calories, carbohydrates and sugars
 */
export function calculateWineNutrition({
  abv,
  residualSugar,
  totalAcidity,
  glycerol,
}: WineNutritionInput): WineNutritionResult {
  // Alcohol density in g/ml
  const alcoholDensity = 0.789;

  // Convert ABV to grams of alcohol per liter
  const alcoholGramsPerLiter = (abv * alcoholDensity / 100) * 1000;

  // Calories from each component (per liter)
  const caloriesFromAlcohol = alcoholGramsPerLiter * 7;
  const caloriesFromSugar = residualSugar * 4;
  const caloriesFromGlycerol = glycerol * 4;

  // Total calories per liter
  const totalCalories = caloriesFromAlcohol + caloriesFromSugar + caloriesFromGlycerol;

  // Calculate total carbohydrates (residual sugar + adjusted glycerol)
  const totalCarbohydrates = residualSugar + (glycerol * 0.7);

  // Convert to per 100ml for nutritional table
  const per100ml = (value: number) => (value / 10);

  return {
    totalCalories: Math.round(totalCalories * 100) / 100,
    totalCarbohydrates: Math.round(totalCarbohydrates * 100) / 100,
    residualSugar: Math.round(residualSugar * 100) / 100,
    // Values per 100ml for the nutritional table
    energyKj: Math.round(totalCalories * 4.184 * 0.1 * 10) / 10,  // Convert kcal to kJ and to 100ml
    energyKcal: Math.round(per100ml(totalCalories) * 10) / 10,
    carbohydrate: Math.round(per100ml(totalCarbohydrates) * 10) / 10,
    sugars: Math.round(per100ml(residualSugar) * 10) / 10,
  };
} 