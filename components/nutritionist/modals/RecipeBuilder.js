import { useState } from 'react';
import { useApp } from '../AppContext';
import { X, Plus, Trash2, Search } from 'lucide-react';

export default function RecipeBuilder({ onClose }) {
  const { state, dispatch, today } = useApp();
  const [recipeName, setRecipeName] = useState('');
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(false);

  const filtered = query.length > 1
    ? state.foodDB.filter((f) => f.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
    : [];

  const addIngredient = (food) => {
    const existing = ingredients.find((i) => i.id === food.id);
    if (existing) {
      setIngredients(ingredients.map((i) => i.id === food.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setIngredients([...ingredients, { ...food, qty: 1 }]);
    }
    setQuery('');
  };

  const removeIngredient = (id) => setIngredients(ingredients.filter((i) => i.id !== id));
  const updateQty = (id, qty) => setIngredients(ingredients.map((i) => i.id === id ? { ...i, qty: Math.max(0.5, qty) } : i));

  const totals = ingredients.reduce((acc, ing) => ({
    calories: acc.calories + ing.calories * ing.qty,
    protein: acc.protein + ing.protein * ing.qty,
    carbs: acc.carbs + ing.carbs * ing.qty,
    fat: acc.fat + ing.fat * ing.qty,
    fiber: acc.fiber + ing.fiber * ing.qty,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  const perServing = Object.fromEntries(
    Object.entries(totals).map(([k, v]) => [k, Math.round(v / servings)])
  );

  const saveRecipe = () => {
    if (!recipeName || ingredients.length === 0) return;
    const recipe = {
      name: recipeName,
      servings,
      ingredients,
      perServing,
      total: totals,
    };
    dispatch({ type: 'ADD_RECIPE', recipe });
    dispatch({
      type: 'ADD_FOOD',
      date: today(),
      meal: 'lunch',
      food: { ...perServing, id: `r${Date.now()}`, name: recipeName, servings: 1 },
    });
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: '430px', margin: '0 auto' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Recipe Builder</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {saved ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-3">🎉</div>
              <p className="font-bold text-gray-800">Recipe Saved!</p>
              <p className="text-sm text-gray-500">Added to your food log</p>
            </div>
          ) : (
            <>
              <input
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Recipe name..."
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
              />

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Servings:</span>
                <input
                  type="number" min="1"
                  value={servings}
                  onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center px-3 py-2 bg-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Ingredient Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-9 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Search ingredients..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {filtered.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    {filtered.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => addIngredient(food)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-50 border-b border-gray-50 last:border-0 text-left"
                      >
                        <span className="text-sm font-medium text-gray-800">{food.name}</span>
                        <span className="text-xs text-orange-500 font-bold">{food.calories} kcal</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ingredients List */}
              {ingredients.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-700 text-sm">Ingredients ({ingredients.length})</h3>
                  {ingredients.map((ing) => (
                    <div key={ing.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{ing.name}</p>
                        <p className="text-xs text-gray-500">{Math.round(ing.calories * ing.qty)} kcal</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(ing.id, ing.qty - 0.5)} className="w-6 h-6 bg-gray-200 rounded-full text-xs font-bold">-</button>
                        <span className="w-8 text-center text-sm font-bold">{ing.qty}</span>
                        <button onClick={() => updateQty(ing.id, ing.qty + 0.5)} className="w-6 h-6 bg-gray-200 rounded-full text-xs font-bold">+</button>
                      </div>
                      <button onClick={() => removeIngredient(ing.id)} className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center">
                        <Trash2 size={12} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Nutrition Preview */}
              {ingredients.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-emerald-700 mb-2">Per Serving Nutrition</p>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: 'Cal', value: perServing.calories, color: 'text-orange-600' },
                      { label: 'Protein', value: `${perServing.protein}g`, color: 'text-emerald-600' },
                      { label: 'Carbs', value: `${perServing.carbs}g`, color: 'text-yellow-600' },
                      { label: 'Fat', value: `${perServing.fat}g`, color: 'text-red-600' },
                      { label: 'Fiber', value: `${perServing.fiber}g`, color: 'text-purple-600' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center bg-white rounded-xl p-2">
                        <p className={`text-xs font-bold ${color}`}>{value}</p>
                        <p className="text-[10px] text-gray-500">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={saveRecipe}
                disabled={!recipeName || ingredients.length === 0}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm disabled:opacity-40 transition-opacity"
              >
                Save Recipe & Add to Log
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
