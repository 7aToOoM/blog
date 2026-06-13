import { useState } from 'react';
import { useApp } from '../AppContext';
import { Plus, Trash2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import AddFoodModal from '../modals/AddFoodModal';
import RecipeBuilder from '../modals/RecipeBuilder';

const MEAL_CONFIG = [
  { key: 'breakfast', label: 'Breakfast', icon: '☀️', color: 'bg-amber-50 border-amber-200' },
  { key: 'lunch', label: 'Lunch', icon: '🌤️', color: 'bg-sky-50 border-sky-200' },
  { key: 'dinner', label: 'Dinner', icon: '🌙', color: 'bg-indigo-50 border-indigo-200' },
  { key: 'snacks', label: 'Snacks', icon: '🍎', color: 'bg-rose-50 border-rose-200' },
];

function MealSection({ mealKey, label, icon, color, foods, onAdd, onRemove }) {
  const [expanded, setExpanded] = useState(true);
  const total = foods.reduce((s, f) => ({
    cal: s.cal + f.calories * f.servings,
    p: s.p + f.protein * f.servings,
    c: s.c + f.carbs * f.servings,
    f: s.f + f.fat * f.servings,
  }), { cal: 0, p: 0, c: 0, f: 0 });

  return (
    <div className={`rounded-2xl border ${color} overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div className="text-left">
            <p className="font-bold text-gray-800 text-sm">{label}</p>
            <p className="text-xs text-gray-500">{Math.round(total.cal)} kcal · {foods.length} items</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
          >
            <Plus size={16} className="text-white" />
          </button>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100">
          {foods.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-xs text-gray-400">No items logged. Tap + to add food.</p>
            </div>
          ) : (
            <>
              {foods.map((food) => (
                <div key={food.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{food.name}</p>
                    <p className="text-xs text-gray-500">
                      {food.servings !== 1 && `×${food.servings} · `}
                      P:{Math.round(food.protein * food.servings)}g · C:{Math.round(food.carbs * food.servings)}g · F:{Math.round(food.fat * food.servings)}g
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-500">{Math.round(food.calories * food.servings)}</p>
                      <p className="text-[10px] text-gray-400">kcal</p>
                    </div>
                    <button onClick={() => onRemove(food.id)} className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center">
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 px-4 py-3 bg-white/50">
                <div className="text-center flex-1">
                  <p className="text-xs font-bold text-emerald-600">{Math.round(total.p)}g</p>
                  <p className="text-[10px] text-gray-400">Protein</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs font-bold text-yellow-600">{Math.round(total.c)}g</p>
                  <p className="text-[10px] text-gray-400">Carbs</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs font-bold text-red-500">{Math.round(total.f)}g</p>
                  <p className="text-[10px] text-gray-400">Fat</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function FoodLog() {
  const { state, dispatch, getDay, getDayTotals, today } = useApp();
  const [addingTo, setAddingTo] = useState(null);
  const [showRecipe, setShowRecipe] = useState(false);
  const day = getDay(today());
  const totals = getDayTotals(today());
  const { profile } = state;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-5 pt-12 pb-6">
        <h1 className="text-white text-2xl font-bold mb-1">Food Log</h1>
        <p className="text-amber-100 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: 'Calories', value: Math.round(totals.calories), max: profile.calorieTarget, unit: 'kcal', color: 'text-yellow-300' },
            { label: 'Protein', value: Math.round(totals.protein), max: profile.proteinTarget, unit: 'g', color: 'text-green-300' },
            { label: 'Carbs', value: Math.round(totals.carbs), max: profile.carbTarget, unit: 'g', color: 'text-blue-300' },
            { label: 'Fat', value: Math.round(totals.fat), max: profile.fatTarget, unit: 'g', color: 'text-red-300' },
          ].map(({ label, value, max, unit, color }) => (
            <div key={label} className="text-center bg-white/20 backdrop-blur-sm rounded-2xl p-2">
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-white/70">{label}</p>
              <p className="text-[10px] text-white/50">{max}{unit}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Recipe Builder Button */}
        <button
          onClick={() => setShowRecipe(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-dashed border-emerald-300 rounded-2xl text-emerald-600 font-semibold text-sm hover:bg-emerald-50 transition-colors"
        >
          <BookOpen size={16} />
          Build a Recipe
        </button>

        {/* Meal Sections */}
        {MEAL_CONFIG.map(({ key, label, icon, color }) => (
          <MealSection
            key={key}
            mealKey={key}
            label={label}
            icon={icon}
            color={color}
            foods={day.meals[key] || []}
            onAdd={() => setAddingTo(key)}
            onRemove={(foodId) => dispatch({ type: 'REMOVE_FOOD', date: today(), meal: key, foodId })}
          />
        ))}

        {/* Daily Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Daily Nutrition Summary</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Fiber', value: `${Math.round(totals.fiber)}g`, target: `/${profile.fiberTarget}g`, color: 'text-purple-600' },
              { label: 'Net Carbs', value: `${Math.round(totals.carbs - totals.fiber)}g`, target: '', color: 'text-blue-600' },
              { label: 'Calories Left', value: `${Math.max(0, profile.calorieTarget - totals.calories)}`, target: 'kcal', color: 'text-emerald-600' },
            ].map(({ label, value, target, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className={`text-base font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-gray-400">{label}</p>
                {target && <p className="text-[10px] text-gray-400">{target}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {addingTo && <AddFoodModal meal={addingTo} onClose={() => setAddingTo(null)} />}
      {showRecipe && <RecipeBuilder onClose={() => setShowRecipe(false)} />}
    </div>
  );
}
