import { useState } from 'react';
import { useApp } from '../AppContext';
import { Search, X, Camera, Plus, ChevronDown } from 'lucide-react';

export default function AddFoodModal({ meal, onClose }) {
  const { state, dispatch, today } = useApp();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [servings, setServings] = useState(1);
  const [tab, setTab] = useState('search');
  const [showScanner, setShowScanner] = useState(false);
  const [customFood, setCustomFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '' });

  const allFoods = [...state.foodDB, ...state.customFoods];
  const filtered = query.length > 1
    ? allFoods.filter((f) => f.name.toLowerCase().includes(query.toLowerCase())).slice(0, 20)
    : allFoods.slice(0, 15);

  const handleAdd = () => {
    if (!selected) return;
    dispatch({
      type: 'ADD_FOOD',
      date: today(),
      meal,
      food: { ...selected, servings: parseFloat(servings) || 1 },
    });
    onClose();
  };

  const handleAddCustom = () => {
    if (!customFood.name || !customFood.calories) return;
    const food = {
      name: customFood.name,
      calories: parseFloat(customFood.calories) || 0,
      protein: parseFloat(customFood.protein) || 0,
      carbs: parseFloat(customFood.carbs) || 0,
      fat: parseFloat(customFood.fat) || 0,
      fiber: parseFloat(customFood.fiber) || 0,
    };
    dispatch({ type: 'ADD_CUSTOM_FOOD', food });
    dispatch({ type: 'ADD_FOOD', date: today(), meal, food: { ...food, id: `cf${Date.now()}`, servings: 1 } });
    onClose();
  };

  const mealLabel = meal.charAt(0).toUpperCase() + meal.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: '430px', margin: '0 auto' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Add to {mealLabel}</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-3">
          {['search', 'custom', 'scanner'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === t ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {t === 'search' ? '🔍 Search' : t === 'custom' ? '✏️ Custom' : '📷 Scan'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tab === 'search' && (
            <>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-9 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Search foods..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
                  autoFocus
                />
              </div>

              {selected ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <h4 className="font-bold text-gray-800 text-sm mb-2">{selected.name}</h4>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: 'Cal', value: Math.round(selected.calories * servings), color: 'text-orange-600' },
                      { label: 'Protein', value: `${Math.round(selected.protein * servings)}g`, color: 'text-emerald-600' },
                      { label: 'Carbs', value: `${Math.round(selected.carbs * servings)}g`, color: 'text-yellow-600' },
                      { label: 'Fat', value: `${Math.round(selected.fat * servings)}g`, color: 'text-red-600' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center bg-white rounded-xl p-2">
                        <p className={`text-sm font-bold ${color}`}>{value}</p>
                        <p className="text-[10px] text-gray-500">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600 font-medium">Servings:</label>
                    <div className="flex items-center gap-2 flex-1">
                      <button onClick={() => setServings(Math.max(0.5, servings - 0.5))} className="w-8 h-8 bg-gray-200 rounded-full text-gray-700 font-bold">-</button>
                      <input
                        type="number" step="0.5" min="0.5"
                        value={servings}
                        onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
                        className="flex-1 text-center bg-white rounded-xl py-2 text-sm font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      <button onClick={() => setServings(servings + 0.5)} className="w-8 h-8 bg-gray-200 rounded-full text-gray-700 font-bold">+</button>
                    </div>
                  </div>
                  <button onClick={handleAdd} className="w-full mt-3 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm">
                    Add to {mealLabel}
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => setSelected(food)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-colors text-left"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{food.name}</p>
                        <p className="text-xs text-gray-500">P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-orange-500">{food.calories}</p>
                        <p className="text-[10px] text-gray-400">kcal</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'custom' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">Create a custom food entry</p>
              <input
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Food name *"
                value={customFood.name}
                onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'calories', label: 'Calories (kcal) *', required: true },
                  { key: 'protein', label: 'Protein (g)' },
                  { key: 'carbs', label: 'Carbs (g)' },
                  { key: 'fat', label: 'Fat (g)' },
                  { key: 'fiber', label: 'Fiber (g)' },
                ].map(({ key, label }) => (
                  <input
                    key={key}
                    type="number"
                    className="px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder={label}
                    value={customFood[key]}
                    onChange={(e) => setCustomFood({ ...customFood, [key]: e.target.value })}
                  />
                ))}
              </div>
              <button
                onClick={handleAddCustom}
                disabled={!customFood.name || !customFood.calories}
                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm disabled:opacity-50"
              >
                Add Custom Food
              </button>
            </div>
          )}

          {tab === 'scanner' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-48 h-48 bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <Camera size={40} className="text-gray-400 mb-3" />
                <p className="text-xs text-gray-400 text-center px-4">Barcode scanner ready</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 w-full border border-blue-200">
                <p className="text-xs text-blue-600 font-medium text-center">📱 Demo: Enter barcode number</p>
              </div>
              <input
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Enter barcode number..."
              />
              <p className="text-xs text-gray-400 text-center">In production, this integrates with Open Food Facts API or device camera</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
