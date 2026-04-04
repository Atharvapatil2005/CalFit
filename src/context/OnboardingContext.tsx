import React, { createContext, useContext, useMemo, useState } from 'react';

export type Goal = 'lose_weight' | 'maintain_weight' | 'gain_weight';
export type AdditionalGoal =
  | 'living_longer'
  | 'feeling_energized'
  | 'athletic_performance'
  | 'healthier_habits'
  | 'mindset'
  | 'prevent_diseases';
export type Gender = 'male' | 'female';
export type DietaryPreference = 'none' | 'vegetarian' | 'vegan' | 'pescatarian';
export type DietaryRestriction = 'gluten' | 'dairy' | 'nuts' | 'eggs' | 'soy';

export type OnboardingState = {
  primaryGoal: Goal | null;
  additionalGoals: AdditionalGoal[];
  gender: Gender | null;
  height: string;
  weight: string;
  age: string;
  preference: DietaryPreference;
  restrictions: DietaryRestriction[];
};

const initialState: OnboardingState = {
  primaryGoal: null,
  additionalGoals: [],
  gender: null,
  height: '',
  weight: '',
  age: '',
  preference: 'none',
  restrictions: [],
};

type OnboardingContextType = {
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
  resetState: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);

  const updateState = (updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(initialState);
  };

  const value = useMemo(
    () => ({ state, updateState, resetState }),
    [state]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
