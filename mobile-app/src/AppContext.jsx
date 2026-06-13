import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);
export const today = () => new Date().toISOString().split('T')[0];

const defaultProfile = {
  name: 'Alex', age: 28, gender: 'male', height: 175, weight: 75,
  goalWeight: 70, activityLevel: 'moderate', goal: 'lose',
  calorieTarget: 2000, proteinTarget: 150, carbTarget: 200,
  fatTarget: 65, fiberTarget: 30, waterTarget: 2500, stepTarget: 10000, sleepTarget: 8,
};

const defaultDay = (date) => ({
  date, meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
  water: 0, steps: 0, weight: null, sleep: null, exercises: [],
});

export function calcBMR({ weight, height, age, gender }) {
  return Math.round(gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161);
}
export function calcTDEE(profile) {
  const m = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, veryActive:1.9 };
  return Math.round(calcBMR(profile) * (m[profile.activityLevel] || 1.55));
}
export function calcBMI({ weight, height }) {
  return (weight / ((height/100) ** 2)).toFixed(1);
}

export const FOOD_DB = [
  { id:'f1',  name:'Oatmeal (1 cup cooked)',      calories:154, protein:6,  carbs:27, fat:3,  fiber:4 },
  { id:'f2',  name:'Banana',                       calories:105, protein:1,  carbs:27, fat:0,  fiber:3 },
  { id:'f3',  name:'Chicken Breast (100g)',         calories:165, protein:31, carbs:0,  fat:4,  fiber:0 },
  { id:'f4',  name:'Brown Rice (1 cup cooked)',     calories:215, protein:5,  carbs:45, fat:2,  fiber:4 },
  { id:'f5',  name:'Greek Yogurt (150g)',           calories:100, protein:17, carbs:6,  fat:1,  fiber:0 },
  { id:'f6',  name:'Egg (1 large)',                 calories:72,  protein:6,  carbs:0,  fat:5,  fiber:0 },
  { id:'f7',  name:'Salmon (100g)',                 calories:208, protein:20, carbs:0,  fat:13, fiber:0 },
  { id:'f8',  name:'Broccoli (1 cup)',              calories:55,  protein:4,  carbs:11, fat:1,  fiber:5 },
  { id:'f9',  name:'Almonds (28g)',                 calories:164, protein:6,  carbs:6,  fat:14, fiber:4 },
  { id:'f10', name:'Whole Milk (240ml)',            calories:149, protein:8,  carbs:12, fat:8,  fiber:0 },
  { id:'f11', name:'Sweet Potato (medium)',         calories:103, protein:2,  carbs:24, fat:0,  fiber:4 },
  { id:'f12', name:'Avocado (half)',                calories:160, protein:2,  carbs:9,  fat:15, fiber:7 },
  { id:'f13', name:'Quinoa (1 cup cooked)',         calories:222, protein:8,  carbs:39, fat:4,  fiber:5 },
  { id:'f14', name:'Tuna (100g, canned)',           calories:116, protein:26, carbs:0,  fat:1,  fiber:0 },
  { id:'f15', name:'Spinach (1 cup raw)',           calories:7,   protein:1,  carbs:1,  fat:0,  fiber:1 },
  { id:'f16', name:'Apple',                         calories:95,  protein:0,  carbs:25, fat:0,  fiber:4 },
  { id:'f17', name:'Whey Protein (1 scoop)',        calories:120, protein:25, carbs:3,  fat:2,  fiber:0 },
  { id:'f18', name:'Peanut Butter (2 tbsp)',        calories:188, protein:8,  carbs:6,  fat:16, fiber:2 },
  { id:'f19', name:'Blueberries (1 cup)',           calories:84,  protein:1,  carbs:21, fat:0,  fiber:4 },
  { id:'f20', name:'Cottage Cheese (100g)',         calories:98,  protein:11, carbs:3,  fat:4,  fiber:0 },
  { id:'f21', name:'Lentils (1 cup cooked)',        calories:230, protein:18, carbs:40, fat:1,  fiber:16 },
  { id:'f22', name:'Olive Oil (1 tbsp)',            calories:119, protein:0,  carbs:0,  fat:14, fiber:0 },
  { id:'f23', name:'Orange',                        calories:62,  protein:1,  carbs:15, fat:0,  fiber:3 },
  { id:'f24', name:'Turkey Breast (100g)',          calories:135, protein:30, carbs:0,  fat:1,  fiber:0 },
  { id:'f25', name:'Whole Wheat Bread (1 slice)',   calories:69,  protein:4,  carbs:12, fat:1,  fiber:2 },
  { id:'f26', name:'Beef (100g, lean)',             calories:250, protein:26, carbs:0,  fat:15, fiber:0 },
  { id:'f27', name:'Shrimp (100g)',                 calories:99,  protein:24, carbs:0,  fat:1,  fiber:0 },
  { id:'f28', name:'Edamame (1 cup)',               calories:189, protein:17, carbs:15, fat:8,  fiber:8 },
  { id:'f29', name:'Chia Seeds (28g)',              calories:138, protein:5,  carbs:12, fat:9,  fiber:10 },
  { id:'f30', name:'Pasta (1 cup cooked)',          calories:220, protein:8,  carbs:43, fat:1,  fiber:3 },
];

export const EXERCISE_DB = [
  { id:'e1',  name:'Running',      category:'cardio',      met:8 },
  { id:'e2',  name:'Walking',      category:'cardio',      met:3.5 },
  { id:'e3',  name:'Cycling',      category:'cardio',      met:6 },
  { id:'e4',  name:'Swimming',     category:'cardio',      met:7 },
  { id:'e5',  name:'HIIT',         category:'cardio',      met:10 },
  { id:'e6',  name:'Jump Rope',    category:'cardio',      met:11 },
  { id:'e7',  name:'Rowing',       category:'cardio',      met:7 },
  { id:'e8',  name:'Elliptical',   category:'cardio',      met:5 },
  { id:'e9',  name:'Bench Press',  category:'strength',    met:5 },
  { id:'e10', name:'Squats',       category:'strength',    met:5.5 },
  { id:'e11', name:'Deadlift',     category:'strength',    met:6 },
  { id:'e12', name:'Pull-ups',     category:'strength',    met:4.5 },
  { id:'e13', name:'Push-ups',     category:'strength',    met:4 },
  { id:'e14', name:'Yoga',         category:'flexibility', met:2.5 },
  { id:'e15', name:'Pilates',      category:'flexibility', met:3 },
  { id:'e16', name:'Stretching',   category:'flexibility', met:2 },
];

function buildInitialState() {
  const profile = { ...defaultProfile };
  const days = {};
  for (let i = 29; i >= 1; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const day = defaultDay(ds);
    day.weight = parseFloat((profile.weight + i * 0.08 - (Math.random() * 0.4)).toFixed(1));
    day.steps  = Math.floor(5000 + Math.random() * 8000);
    day.water  = Math.floor(1200 + Math.random() * 1800);
    day.sleep  = parseFloat((5.5 + Math.random() * 3).toFixed(1));
    day.meals.breakfast = [{ id: i*10+1, name:'Oatmeal (1 cup cooked)', calories:154, protein:6, carbs:27, fat:3, fiber:4, servings:1 }];
    day.meals.lunch     = [{ id: i*10+2, name:'Chicken Breast (100g)',   calories:165, protein:31, carbs:0, fat:4, fiber:0, servings:1 }];
    if (i % 2 === 0) day.exercises = [{ id:i*10+3, name:'Running', category:'cardio', duration:30, calories:Math.round(8*profile.weight*30/60) }];
    days[ds] = day;
  }
  days[today()] = defaultDay(today());
  return {
    profile, days, customFoods: [], recipes: [], streak: 5, activeTab: 'home',
    challenges: [
      { id:'c1', name:'30-Day Step Challenge', goal:10000, type:'steps', participants:128, joined:false },
      { id:'c2', name:'Hydration Week',         goal:2500,  type:'water', participants:89,  joined:true },
      { id:'c3', name:'Protein Goal Sprint',    goal:150,   type:'protein',participants:204, joined:false },
    ],
    settings: { units:'metric', notifications:true, shareProgress:false },
  };
}

function getInitialState() {
  try {
    const s = localStorage.getItem('nutritionist-v2');
    if (s) {
      const p = JSON.parse(s);
      if (!p.days[today()]) p.days[today()] = defaultDay(today());
      return p;
    }
  } catch {}
  return buildInitialState();
}

function reducer(state, action) {
  const ensureDay = (date) => state.days[date] || defaultDay(date);
  switch (action.type) {
    case 'SET_TAB': return { ...state, activeTab: action.tab };
    case 'UPDATE_PROFILE': return { ...state, profile: { ...state.profile, ...action.data } };
    case 'UPDATE_SETTINGS': return { ...state, settings: { ...state.settings, ...action.data } };
    case 'ADD_FOOD': {
      const day = ensureDay(action.date);
      return { ...state, days: { ...state.days, [action.date]: { ...day, meals: { ...day.meals, [action.meal]: [...day.meals[action.meal], { ...action.food, id: Date.now() }] } } } };
    }
    case 'REMOVE_FOOD': {
      const day = ensureDay(action.date);
      return { ...state, days: { ...state.days, [action.date]: { ...day, meals: { ...day.meals, [action.meal]: day.meals[action.meal].filter(f => f.id !== action.foodId) } } } };
    }
    case 'ADD_EXERCISE': {
      const day = ensureDay(action.date);
      return { ...state, days: { ...state.days, [action.date]: { ...day, exercises: [...day.exercises, { ...action.exercise, id: Date.now() }] } } };
    }
    case 'REMOVE_EXERCISE': {
      const day = ensureDay(action.date);
      return { ...state, days: { ...state.days, [action.date]: { ...day, exercises: day.exercises.filter(e => e.id !== action.exerciseId) } } };
    }
    case 'SET_WATER': {
      const day = ensureDay(action.date);
      return { ...state, days: { ...state.days, [action.date]: { ...day, water: Math.max(0, action.amount) } } };
    }
    case 'SET_STEPS': {
      const day = ensureDay(action.date);
      return { ...state, days: { ...state.days, [action.date]: { ...day, steps: action.steps } } };
    }
    case 'LOG_WEIGHT': {
      const day = ensureDay(action.date);
      return { ...state, profile: { ...state.profile, weight: action.weight }, days: { ...state.days, [action.date]: { ...day, weight: action.weight } } };
    }
    case 'LOG_SLEEP': {
      const day = ensureDay(action.date);
      return { ...state, days: { ...state.days, [action.date]: { ...day, sleep: action.hours } } };
    }
    case 'ADD_CUSTOM_FOOD':
      return { ...state, customFoods: [...state.customFoods, { ...action.food, id:`cf${Date.now()}` }] };
    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, { ...action.recipe, id:`r${Date.now()}` }] };
    case 'JOIN_CHALLENGE':
      return { ...state, challenges: state.challenges.map(c => c.id === action.id ? { ...c, joined: !c.joined } : c) };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  useEffect(() => {
    try { localStorage.setItem('nutritionist-v2', JSON.stringify(state)); } catch {}
  }, [state]);

  const getDay = (date = today()) => state.days[date] || defaultDay(date);

  const getDayTotals = (date = today()) => {
    const day = getDay(date);
    const foods = Object.values(day.meals).flat();
    return {
      calories: foods.reduce((s,f) => s + f.calories * (f.servings||1), 0),
      protein:  foods.reduce((s,f) => s + f.protein  * (f.servings||1), 0),
      carbs:    foods.reduce((s,f) => s + f.carbs    * (f.servings||1), 0),
      fat:      foods.reduce((s,f) => s + f.fat      * (f.servings||1), 0),
      fiber:    foods.reduce((s,f) => s + f.fiber    * (f.servings||1), 0),
      exerciseCalories: day.exercises.reduce((s,e) => s + e.calories, 0),
    };
  };

  const allFoods = [...FOOD_DB, ...state.customFoods];

  const getWeightHistory = () =>
    Object.values(state.days).filter(d => d.weight).sort((a,b) => a.date.localeCompare(b.date))
      .slice(-30).map(d => ({ date: d.date.slice(5), weight: +parseFloat(d.weight).toFixed(1) }));

  const getCalorieHistory = () =>
    Object.values(state.days).sort((a,b) => a.date.localeCompare(b.date)).slice(-14).map(d => {
      const foods = Object.values(d.meals).flat();
      return { date: d.date.slice(5), calories: Math.round(foods.reduce((s,f) => s + f.calories*(f.servings||1), 0)) };
    });

  const getAIInsights = () => {
    const t = getDayTotals(); const { calorieTarget, proteinTarget, waterTarget } = state.profile;
    const day = getDay(); const h = new Date().getHours(); const ins = [];
    if (t.calories < calorieTarget * 0.5 && h > 14) ins.push({ type:'warning', text:`You're well under your ${calorieTarget} kcal goal. Eat more to fuel your body and avoid muscle loss!` });
    if (t.protein < proteinTarget * 0.6) ins.push({ type:'tip', text:`Protein at ${Math.round(t.protein)}g — target is ${proteinTarget}g. Add chicken, Greek yogurt, or a protein shake.` });
    if (day.water < waterTarget * 0.5 && h > 12) ins.push({ type:'reminder', text:'Hydration alert! Drink more water to support metabolism and energy levels.' });
    if (state.streak >= 7) ins.push({ type:'achievement', text:`🔥 ${state.streak}-day streak! Consistency is the #1 predictor of long-term success.` });
    if (t.fiber < 15) ins.push({ type:'tip', text:'Low fiber today. Add vegetables, legumes, or whole grains to support gut health and satiety.' });
    if (day.exercises.length > 0) ins.push({ type:'success', text:`Great workout! You burned ${t.exerciseCalories} kcal today. Keep it up!` });
    if (ins.length === 0) ins.push({ type:'success', text:"You're on track today! Keep logging to maintain your streak." });
    return ins;
  };

  return (
    <AppContext.Provider value={{ state, dispatch, getDay, getDayTotals, getWeightHistory, getCalorieHistory, getAIInsights, allFoods, today }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp outside provider');
  return ctx;
}
