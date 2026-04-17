export type MacroTargets = {
  carbs: number;
  protein: number;
  fat: number;
};

export const calculateMacroTargets = (targetCalories: number): MacroTargets => {
  const carbs = Math.round((targetCalories * 0.5) / 4);
  const protein = Math.round((targetCalories * 0.3) / 4);
  const fat = Math.round((targetCalories * 0.2) / 9);

  return {
    carbs,
    protein,
    fat,
  };
};
