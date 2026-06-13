import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

const today = () => new Date().toISOString().split('T')[0];

const defaultProfile = {
  name: 'Alex',
  age: 28,
  gender: 'male',
  height: 175,
  weight: 75,
  goalWeight: 70,
  activityLevel: 'moderate',
  goal: 'lose',
  calorieTarget: 2000,
  proteinTarget: 150,
  carbTarget: 200,
  fatTarget: 65,
  fiberTarget: 30,
  waterTarget: 2500,
  stepTarget: 10000,
  sleepTarget: 8,
  avatar: null,
};

const defaultDay = (date) => ({
  date,
  meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
  water: 0,
  steps: 0,
  weight: null,
  sleep: null,
  exercises: [],
});

function calculateBMR(profile) {
  const { weight, height, age, gender } = profile;
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
}

function calculateTDEE(profile) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return Math.round(calculateBMR(profile) * (multipliers[profile.activityLevel] || 1.55));
}

function calculateBMI(profile) {
  const heightM = profile.height / 100;
  return (profile.weight / (heightM * heightM)).toFixed(1);
}

const INITIAL_FOOD_DB = [
  { id: 'f1', name: 'Oatmeal (1 cup cooked)', calories: 154, protein: 6, carbs: 27, fat: 3, fiber: 4 },
  { id: 'f2', name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3 },
  { id: 'f3', name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 4, fiber: 0 },
  { id: 'f4', name: 'Brown Rice (1 cup cooked)', calories: 215, protein: 5, carbs: 45, fat: 2, fiber: 4 },
  { id: 'f5', name: 'Greek Yogurt (150g)', calories: 100, protein: 17, carbs: 6, fat: 1, fiber: 0 },
  { id: 'f6', name: 'Egg (1 large)', calories: 72, protein: 6, carbs: 0, fat: 5, fiber: 0 },
  { id: 'f7', name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
  { id: 'f8', name: 'Broccoli (1 cup)', calories: 55, protein: 4, carbs: 11, fat: 1, fiber: 5 },
  { id: 'f9', name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 4 },
  { id: 'f10', name: 'Whole Milk (240ml)', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0 },
  { id: 'f11', name: 'Sweet Potato (medium)', calories: 103, protein: 2, carbs: 24, fat: 0, fiber: 4 },
  { id: 'f12', name: 'Avocado (half)', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 },
  { id: 'f13', name: 'Quinoa (1 cup cooked)', calories: 222, protein: 8, carbs: 39, fat: 4, fiber: 5 },
  { id: 'f14', name: 'Tuna (100g, canned)', calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0 },
  { id: 'f15', name: 'Spinach (1 cup raw)', calories: 7, protein: 1, carbs: 1, fat: 0, fiber: 1 },
  { id: 'f16', name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0, fiber: 4 },
  { id: 'f17', name: 'Whey Protein (1 scoop)', calories: 120, protein: 25, carbs: 3, fat: 2, fiber: 0 },
  { id: 'f18', name: 'Peanut Butter (2 tbsp)', calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 2 },
  { id: 'f19', name: 'Blueberries (1 cup)', calories: 84, protein: 1, carbs: 21, fat: 0, fiber: 4 },
  { id: 'f20', name: 'Cottage Cheese (100g)', calories: 98, protein: 11, carbs: 3, fat: 4, fiber: 0 },
  { id: 'f21', name: 'Lentils (1 cup cooked)', calories: 230, protein: 18, carbs: 40, fat: 1, fiber: 16 },
  { id: 'f22', name: 'Olive Oil (1 tbsp)', calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0 },
  { id: 'f23', name: 'Orange', calories: 62, protein: 1, carbs: 15, fat: 0, fiber: 3 },
  { id: 'f24', name: 'Turkey Breast (100g)', calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0 },
  { id: 'f25', name: 'Whole Wheat Bread (1 slice)', calories: 69, protein: 4, carbs: 12, fat: 1, fiber: 2 },
];

const EXERCISE_DB = [
  { id: 'e1', name: 'Running', category: 'cardio', metValue: 8, unit: 'min' },
  { id: 'e2', name: 'Walking', category: 'cardio', metValue: 3.5, unit: 'min' },
  { id: 'e3', name: 'Cycling', category: 'cardio', metValue: 6, unit: 'min' },
  { id: 'e4', name: 'Swimming', category: 'cardio', metValue: 7, unit: 'min' },
  { id: 'e5', name: 'HIIT', category: 'cardio', metValue: 10, unit: 'min' },
  { id: 'e6', name: 'Jump Rope', category: 'cardio', metValue: 11, unit: 'min' },
  { id: 'e7', name: 'Bench Press', category: 'strength', metValue: 5, unit: 'min' },
  { id: 'e8', name: 'Squats', category: 'strength', metValue: 5.5, unit: 'min' },
  { id: 'e9', name: 'Deadlift', category: 'strength', metValue: 6, unit: 'min' },
  { id: 'e10', name: 'Pull-ups', category: 'strength', metValue: 4.5, unit: 'min' },
  { id: 'e11', name: 'Push-ups', category: 'strength', metValue: 4, unit: 'min' },
  { id: 'e12', name: 'Yoga', category: 'flexibility', metValue: 2.5, unit: 'min' },
  { id: 'e13', name: 'Pilates', category: 'flexibility', metValue: 3, unit: 'min' },
  { id: 'e14', name: 'Rowing', category: 'cardio', metValue: 7, unit: 'min' },
  { id: 'e15', name: 'Elliptical', category: 'cardio', metValue: 5, unit: 'min' },
];

const ACHIEVEMENTS = [
  { id: 'a1', name: '7-Day Streak', icon: '🔥', condition: (s) => s >= 7 },
  { id: 'a2', name: '30-Day Streak', icon: '⚡', condition: (s) => s >= 30 },
  { id: 'a3', name: 'Century Club', icon: '💯', condition: (s) => s >= 100 },
  { id: 'a4', name: 'First Log', icon: '🥗', condition: (s) => s >= 1 },
  { id: 'a5', name: 'Week Warrior', icon: '🏆', condition: (s) => s >= 14 },
];

function getInitialState() {
  if (typeof window === 'undefined') return buildInitialState();
  try {
    const saved = localStorage.getItem('nutritionist-app-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.days[today()]) {
        parsed.days[today()] = defaultDay(today());
      }
      return parsed;
    }
  } catch (e) {}
  return buildInitialState();
}

function buildInitialState() {
  const profile = { ...defaultProfile };
  const days = {};
  // Populate 30 days of history for charts
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const day = defaultDay(dateStr);
    if (i > 0) {
      day.weight = profile.weight + (i * 0.1) - 1.5 + (Math.random() - 0.5) * 0.3;
      day.steps = Math.floor(6000 + Math.random() * 8000);
      day.water = Math.floor(1500 + Math.random() * 1500);
      day.sleep = parseFloat((6 + Math.random() * 3).toFixed(1));
      // Add sample food
      day.meals.breakfast = [{
        id: Date.now() + i,
        foodId: 'f1',
        name: 'Oatmeal (1 cup cooked)',
        calories: 154, protein: 6, carbs: 27, fat: 3, fiber: 4,
        servings: 1,
      }];
      day.meals.lunch = [{
        id: Date.now() + i + 1,
        foodId: 'f3',
        name: 'Chicken Breast (100g)',
        calories: 165, protein: 31, carbs: 0, fat: 4, fiber: 0,
        servings: 1,
      }];
      day.exercises = i % 2 === 0 ? [{
        id: Date.now() + i + 2,
        exerciseId: 'e1',
        name: 'Running',
        category: 'cardio',
        duration: 30,
        calories: Math.round(8 * profile.weight * 30 / 60),
      }] : [];
    }
  }
  return {
    profile,
    days,
    customFoods: [],
    recipes: [],
    challenges: [
      { id: 'c1', name: '30-Day Step Challenge', goal: 10000, type: 'steps', participants: 128, joined: false },
      { id: 'c2', name: 'Hydration Week', goal: 2500, type: 'water', participants: 89, joined: true },
      { id: 'c3', name: 'Protein Goal Sprint', goal: 150, type: 'protein', participants: 204, joined: false },
    ],
    streak: 5,
    activeTab: 'home',
    notifications: [],
    foodDB: INITIAL_FOOD_DB,
    exerciseDB: EXERCISE_DB,
    achievements: [],
    settings: {
      units: 'metric',
      theme: 'light',
      notifications: true,
      shareProgress: false,
    },
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };

    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.data } };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.data } };

    case 'ADD_FOOD': {
      const day = state.days[action.date] || defaultDay(action.date);
      const meals = { ...day.meals };
      meals[action.meal] = [...(meals[action.meal] || []), { ...action.food, id: Date.now() }];
      return {
        ...state,
        days: { ...state.days, [action.date]: { ...day, meals } },
      };
    }

    case 'REMOVE_FOOD': {
      const day = state.days[action.date] || defaultDay(action.date);
      const meals = { ...day.meals };
      meals[action.meal] = meals[action.meal].filter((f) => f.id !== action.foodId);
      return {
        ...state,
        days: { ...state.days, [action.date]: { ...day, meals } },
      };
    }

    case 'ADD_EXERCISE': {
      const day = state.days[action.date] || defaultDay(action.date);
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: {
            ...day,
            exercises: [...day.exercises, { ...action.exercise, id: Date.now() }],
          },
        },
      };
    }

    case 'REMOVE_EXERCISE': {
      const day = state.days[action.date] || defaultDay(action.date);
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: {
            ...day,
            exercises: day.exercises.filter((e) => e.id !== action.exerciseId),
          },
        },
      };
    }

    case 'SET_WATER': {
      const day = state.days[action.date] || defaultDay(action.date);
      return {
        ...state,
        days: { ...state.days, [action.date]: { ...day, water: action.amount } },
      };
    }

    case 'SET_STEPS': {
      const day = state.days[action.date] || defaultDay(action.date);
      return {
        ...state,
        days: { ...state.days, [action.date]: { ...day, steps: action.steps } },
      };
    }

    case 'LOG_WEIGHT': {
      const day = state.days[action.date] || defaultDay(action.date);
      return {
        ...state,
        profile: { ...state.profile, weight: action.weight },
        days: { ...state.days, [action.date]: { ...day, weight: action.weight } },
      };
    }

    case 'LOG_SLEEP': {
      const day = state.days[action.date] || defaultDay(action.date);
      return {
        ...state,
        days: { ...state.days, [action.date]: { ...day, sleep: action.hours } },
      };
    }

    case 'ADD_CUSTOM_FOOD':
      return {
        ...state,
        customFoods: [...state.customFoods, { ...action.food, id: `cf${Date.now()}` }],
        foodDB: [...state.foodDB, { ...action.food, id: `cf${Date.now()}` }],
      };

    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, { ...action.recipe, id: `r${Date.now()}` }] };

    case 'JOIN_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map((c) =>
          c.id === action.id ? { ...c, joined: !c.joined } : c
        ),
      };

    case 'INCREMENT_STREAK':
      return { ...state, streak: state.streak + 1 };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  useEffect(() => {
    if (!state.days[today()]) {
      dispatch({ type: 'SET_WATER', date: today(), amount: 0 });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('nutritionist-app-state', JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  const getDay = (date = today()) => state.days[date] || defaultDay(date);

  const getDayTotals = (date = today()) => {
    const day = getDay(date);
    const allFoods = Object.values(day.meals).flat();
    return {
      calories: allFoods.reduce((s, f) => s + (f.calories * f.servings), 0),
      protein: allFoods.reduce((s, f) => s + (f.protein * f.servings), 0),
      carbs: allFoods.reduce((s, f) => s + (f.carbs * f.servings), 0),
      fat: allFoods.reduce((s, f) => s + (f.fat * f.servings), 0),
      fiber: allFoods.reduce((s, f) => s + (f.fiber * f.servings), 0),
      exerciseCalories: day.exercises.reduce((s, e) => s + e.calories, 0),
    };
  };

  const getBMR = () => calculateBMR(state.profile);
  const getTDEE = () => calculateTDEE(state.profile);
  const getBMI = () => calculateBMI(state.profile);
  const getBMICategory = () => {
    const bmi = parseFloat(getBMI());
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  const getWeightHistory = () => {
    return Object.values(state.days)
      .filter((d) => d.weight !== null)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30)
      .map((d) => ({ date: d.date.slice(5), weight: parseFloat(d.weight.toFixed(1)) }));
  };

  const getCalorieHistory = () => {
    return Object.values(state.days)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14)
      .map((d) => {
        const allFoods = Object.values(d.meals).flat();
        const cal = allFoods.reduce((s, f) => s + (f.calories * (f.servings || 1)), 0);
        return { date: d.date.slice(5), calories: Math.round(cal) };
      });
  };

  const getAIInsights = () => {
    const totals = getDayTotals();
    const insights = [];
    const { calorieTarget, proteinTarget, waterTarget } = state.profile;

    if (totals.calories < calorieTarget * 0.5 && new Date().getHours() > 14) {
      insights.push({ type: 'warning', text: "You're significantly under your calorie goal. Make sure to eat enough to fuel your body!" });
    }
    if (totals.protein < proteinTarget * 0.6) {
      insights.push({ type: 'tip', text: `Boost your protein! Try adding chicken, Greek yogurt, or a protein shake to hit your ${proteinTarget}g target.` });
    }
    const day = getDay();
    if (day.water < waterTarget * 0.5 && new Date().getHours() > 12) {
      insights.push({ type: 'reminder', text: 'Hydration check! Drink more water to stay energized and support your metabolism.' });
    }
    if (state.streak >= 7) {
      insights.push({ type: 'achievement', text: `Amazing! You've maintained a ${state.streak}-day streak. Consistency is the key to lasting results!` });
    }
    if (totals.fiber < 20) {
      insights.push({ type: 'tip', text: 'Low fiber today. Add vegetables, fruits, or whole grains to support gut health and satiety.' });
    }
    if (insights.length === 0) {
      insights.push({ type: 'success', text: "Great job! You're on track today. Keep up the excellent work!" });
    }
    return insights;
  };

  return (
    <AppContext.Provider value={{ state, dispatch, getDay, getDayTotals, getBMR, getTDEE, getBMI, getBMICategory, getWeightHistory, getCalorieHistory, getAIInsights, today }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { today, calculateBMR, calculateTDEE, calculateBMI, EXERCISE_DB };
