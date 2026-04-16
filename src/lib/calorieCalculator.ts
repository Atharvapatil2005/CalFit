type CalculatorGender = 'male' | 'female';
type CalculatorActivityMultiplier = 1.2 | 1.375 | 1.55 | 1.725;
type CalculatorGoal =
  | 'cut'
  | 'maintain'
  | 'bulk'
  | 'lose_weight'
  | 'maintain_weight'
  | 'gain_weight';

type CalculateCaloriesInput = {
  age: number;
  height: number;
  weight: number;
  gender: CalculatorGender;
  activityMultiplier: CalculatorActivityMultiplier;
  goal: CalculatorGoal;
};

const goalAdjustmentMap: Record<CalculatorGoal, number> = {
  cut: -300,
  maintain: 0,
  bulk: 300,
  lose_weight: -300,
  maintain_weight: 0,
  gain_weight: 300,
};

export const calculateCalories = ({
  age,
  height,
  weight,
  gender,
  activityMultiplier,
  goal,
}: CalculateCaloriesInput) => {
  const bmr =
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = bmr * activityMultiplier;
  const calories = tdee + goalAdjustmentMap[goal];

  return Math.round(calories);
};
