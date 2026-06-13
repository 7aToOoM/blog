import { useState } from 'react';
import { useApp } from '../AppContext';
import CircularProgress from '../ui/CircularProgress';
import MacroBar from '../ui/MacroBar';
import { Droplets, Footprints, Flame, Moon, Zap, Trophy, Bell, ChevronRight, Plus, Minus } from 'lucide-react';
import AICoaching from '../AICoaching';

function WaterGlass({ filled }) {
  return (
    <div className={`w-7 h-10 rounded-b-lg border-2 transition-all duration-300 ${filled ? 'bg-blue-400 border-blue-500' : 'bg-gray-50 border-gray-200'}`} />
  );
}

export default function Home() {
  const { state, dispatch, getDay, getDayTotals, today } = useApp();
  const { profile } = state;
  const day = getDay(today());
  const totals = getDayTotals(today());
  const [showAI, setShowAI] = useState(false);

  const netCalories = totals.calories - totals.exerciseCalories;
  const remaining = Math.max(0, profile.calorieTarget - netCalories);
  const waterGlasses = 8;
  const waterPerGlass = profile.waterTarget / waterGlasses;
  const filledGlasses = Math.floor(day.water / waterPerGlass);

  const addWater = (amt) => {
    dispatch({ type: 'SET_WATER', date: today(), amount: Math.max(0, day.water + amt) });
  };

  const quickStats = [
    { label: 'Burned', value: totals.exerciseCalories, unit: 'kcal', Icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Steps', value: day.steps.toLocaleString(), unit: '', Icon: Footprints, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Sleep', value: day.sleep ? `${day.sleep}h` : '--', unit: '', Icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Streak', value: `${state.streak}d`, unit: '', Icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  ];

  const meals = [
    { key: 'breakfast', label: 'Breakfast', icon: '☀️', cal: state.days[today()]?.meals.breakfast.reduce((s, f) => s + f.calories * f.servings, 0) || 0 },
    { key: 'lunch', label: 'Lunch', icon: '🌤️', cal: state.days[today()]?.meals.lunch.reduce((s, f) => s + f.calories * f.servings, 0) || 0 },
    { key: 'dinner', label: 'Dinner', icon: '🌙', cal: state.days[today()]?.meals.dinner.reduce((s, f) => s + f.calories * f.servings, 0) || 0 },
    { key: 'snacks', label: 'Snacks', icon: '🍎', cal: state.days[today()]?.meals.snacks.reduce((s, f) => s + f.calories * f.servings, 0) || 0 },
  ];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-emerald-100 text-sm">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},</p>
            <h1 className="text-white text-2xl font-bold">{profile.name} 👋</h1>
          </div>
          <button onClick={() => setShowAI(!showAI)} className="relative bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <Zap size={20} className="text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[9px] font-bold text-gray-800 flex items-center justify-center">AI</span>
          </button>
        </div>

        {/* Calorie Ring */}
        <div className="flex items-center justify-center gap-8">
          <CircularProgress
            value={netCalories}
            max={profile.calorieTarget}
            size={140}
            strokeWidth={12}
            color="#ffffff"
            label={`${Math.round(netCalories)}`}
            sublabel="kcal eaten"
          />
          <div className="space-y-3">
            <div className="text-white/90">
              <p className="text-xs text-emerald-100">Goal</p>
              <p className="font-bold">{profile.calorieTarget} kcal</p>
            </div>
            <div className="text-white/90">
              <p className="text-xs text-emerald-100">Remaining</p>
              <p className="font-bold text-yellow-300">{remaining} kcal</p>
            </div>
            <div className="text-white/90">
              <p className="text-xs text-emerald-100">Exercise</p>
              <p className="font-bold text-emerald-200">+{totals.exerciseCalories} kcal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* AI Coaching Panel */}
        {showAI && <AICoaching />}

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          {quickStats.map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-3 shadow-sm text-center">
              <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mx-auto mb-1`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-xs font-bold text-gray-800">{value}</p>
              <p className="text-[10px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Macros */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Today&apos;s Macros</h3>
          <div className="space-y-3">
            <MacroBar label="Protein" value={totals.protein} max={profile.proteinTarget} color="#10b981" />
            <MacroBar label="Carbs" value={totals.carbs} max={profile.carbTarget} color="#f59e0b" />
            <MacroBar label="Fat" value={totals.fat} max={profile.fatTarget} color="#ef4444" />
            <MacroBar label="Fiber" value={totals.fiber} max={profile.fiberTarget} color="#8b5cf6" />
          </div>
        </div>

        {/* Water Tracker */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Droplets size={18} className="text-blue-500" />
              <h3 className="font-bold text-gray-800 text-sm">Water Intake</h3>
            </div>
            <span className="text-sm font-bold text-blue-600">{day.water}ml / {profile.waterTarget}ml</span>
          </div>
          <div className="flex gap-2 mb-3 justify-center">
            {Array.from({ length: waterGlasses }).map((_, i) => (
              <WaterGlass key={i} filled={i < filledGlasses} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => addWater(-250)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 rounded-xl text-gray-600 text-sm font-medium">
              <Minus size={14} /> 250ml
            </button>
            <button onClick={() => addWater(250)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-500 rounded-xl text-white text-sm font-medium">
              <Plus size={14} /> 250ml
            </button>
            <button onClick={() => addWater(500)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-600 rounded-xl text-white text-sm font-medium">
              <Plus size={14} /> 500ml
            </button>
          </div>
        </div>

        {/* Meals Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Meals Today</h3>
            <button
              onClick={() => dispatch({ type: 'SET_TAB', tab: 'food' })}
              className="text-emerald-600 text-xs font-medium flex items-center gap-1"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {meals.map(({ key, label, icon, cal }) => (
              <button
                key={key}
                onClick={() => dispatch({ type: 'SET_TAB', tab: 'food' })}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                <span className="text-2xl">{icon}</span>
                <div className="text-left">
                  <p className="text-xs font-semibold text-gray-700">{label}</p>
                  <p className="text-xs text-gray-500">{Math.round(cal)} kcal</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Active Challenges</h3>
          <div className="space-y-2">
            {state.challenges.filter((c) => c.joined).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <span className="text-2xl">🏆</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.participants} participants</p>
                </div>
                <span className="text-xs text-emerald-600 font-bold">Active</span>
              </div>
            ))}
            {state.challenges.filter((c) => c.joined).length === 0 && (
              <p className="text-xs text-gray-400 text-center py-2">No active challenges. Join one in your profile!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
