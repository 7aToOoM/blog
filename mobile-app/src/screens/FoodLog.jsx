import { useState } from 'react';
import { useApp } from '../AppContext';
import { Plus, Trash2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import AddFoodModal from '../modals/AddFoodModal';
import RecipeBuilder from '../modals/RecipeBuilder';

const MEALS = [
  { key:'breakfast', label:'Breakfast', icon:'☀️', color:'bg-amber-50 border-amber-200' },
  { key:'lunch',     label:'Lunch',     icon:'🌤️', color:'bg-sky-50 border-sky-200'   },
  { key:'dinner',    label:'Dinner',    icon:'🌙', color:'bg-indigo-50 border-indigo-200' },
  { key:'snacks',    label:'Snacks',    icon:'🍎', color:'bg-rose-50 border-rose-200'  },
];

function MealSection({ mealKey, label, icon, color, foods, onAdd, onRemove }) {
  const [open, setOpen] = useState(true);
  const cal = foods.reduce((s,f) => s+f.calories*(f.servings||1), 0);
  return (
    <div className={`rounded-2xl border ${color} overflow-hidden`}>
      <button onClick={() => setOpen(v=>!v)} className="w-full flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div className="text-left">
            <p className="font-bold text-gray-800 text-sm">{label}</p>
            <p className="text-xs text-gray-400">{foods.length} items · {Math.round(cal)} kcal</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={e => { e.stopPropagation(); onAdd(); }}
            className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center active:scale-95 transition-transform">
            <Plus size={16} className="text-white" />
          </button>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-100 bg-white/60">
          {foods.length === 0
            ? <p className="text-xs text-gray-400 text-center py-4">Tap + to add food</p>
            : foods.map(f => (
              <div key={f.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{f.name}</p>
                  <p className="text-xs text-gray-400">{f.servings!==1?`×${f.servings} · `:''}P:{Math.round(f.protein*(f.servings||1))}g C:{Math.round(f.carbs*(f.servings||1))}g F:{Math.round(f.fat*(f.servings||1))}g</p>
                </div>
                <div className="flex items-center gap-3 ml-2">
                  <div className="text-right">
                    <p className="text-sm font-bold text-orange-500">{Math.round(f.calories*(f.servings||1))}</p>
                    <p className="text-[10px] text-gray-400">kcal</p>
                  </div>
                  <button onClick={() => onRemove(f.id)} className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center active:scale-95 flex-shrink-0">
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))
          }
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
    <div className="pb-4">
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-5 pt-14 pb-6">
        <h1 className="text-white text-2xl font-extrabold">Food Log</h1>
        <p className="text-amber-100 text-sm mb-4">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
        <div className="grid grid-cols-4 gap-2">
          {[['Calories',Math.round(totals.calories),profile.calorieTarget,'kcal','text-yellow-300'],
            ['Protein', Math.round(totals.protein), profile.proteinTarget,'g','text-green-300'],
            ['Carbs',   Math.round(totals.carbs),   profile.carbTarget,  'g','text-blue-300'],
            ['Fat',     Math.round(totals.fat),      profile.fatTarget,   'g','text-red-300']
          ].map(([l,v,max,u,c]) => (
            <div key={l} className="bg-white/20 backdrop-blur rounded-2xl p-2 text-center">
              <p className={`text-lg font-extrabold ${c}`}>{v}</p>
              <p className="text-[10px] text-white/70">{l}</p>
              <p className="text-[10px] text-white/50">/{max}{u}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-4 space-y-3">
        <button onClick={() => setShowRecipe(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-dashed border-emerald-300 rounded-2xl text-emerald-600 font-bold text-sm active:scale-99 transition-transform">
          <BookOpen size={16} /> Build a Recipe
        </button>
        {MEALS.map(m => (
          <MealSection key={m.key} {...m}
            foods={day.meals[m.key]||[]}
            onAdd={() => setAddingTo(m.key)}
            onRemove={id => dispatch({ type:'REMOVE_FOOD', date:today(), meal:m.key, foodId:id })} />
        ))}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Daily Summary</h3>
          <div className="grid grid-cols-3 gap-3">
            {[['Fiber',`${Math.round(totals.fiber)}g`,`/${profile.fiberTarget}g`,'text-purple-600'],
              ['Net Carbs',`${Math.round(totals.carbs-totals.fiber)}g`,'','text-blue-600'],
              ['Remaining',`${Math.max(0,profile.calorieTarget-totals.calories)}`,'kcal','text-emerald-600']
            ].map(([l,v,s,c]) => (
              <div key={l} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className={`text-base font-bold ${c}`}>{v}</p>
                <p className="text-[10px] text-gray-400">{l}{s}</p>
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
