import { useState } from 'react';
import { useApp } from '../AppContext';
import { Search, X } from 'lucide-react';

export default function AddFoodModal({ meal, onClose }) {
  const { state, dispatch, allFoods, today } = useApp();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [servings, setServings] = useState(1);
  const [tab, setTab] = useState('search');
  const [custom, setCustom] = useState({ name:'', calories:'', protein:'', carbs:'', fat:'', fiber:'' });

  const filtered = query.length > 1
    ? allFoods.filter(f => f.name.toLowerCase().includes(query.toLowerCase())).slice(0, 20)
    : allFoods.slice(0, 20);

  const addSelected = () => {
    if (!selected) return;
    dispatch({ type:'ADD_FOOD', date:today(), meal, food:{ ...selected, servings: parseFloat(servings)||1 } });
    onClose();
  };

  const addCustom = () => {
    if (!custom.name || !custom.calories) return;
    const food = { name:custom.name, calories:+custom.calories||0, protein:+custom.protein||0, carbs:+custom.carbs||0, fat:+custom.fat||0, fiber:+custom.fiber||0 };
    dispatch({ type:'ADD_CUSTOM_FOOD', food });
    dispatch({ type:'ADD_FOOD', date:today(), meal, food:{ ...food, id:`cf${Date.now()}`, servings:1 } });
    onClose();
  };

  const mealLabel = meal.charAt(0).toUpperCase() + meal.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ maxWidth:430, margin:'0 auto' }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full" style={{ maxHeight:'88vh', display:'flex', flexDirection:'column' }}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Add to {mealLabel}</h2>
          <button onClick={onClose} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="flex gap-1 px-4 pt-3 flex-shrink-0">
          {['search','custom','scan'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab===t?'bg-emerald-500 text-white':'bg-gray-100 text-gray-600'}`}>
              {t==='search'?'🔍 Search':t==='custom'?'✏️ Custom':'📷 Barcode'}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tab === 'search' && (
            <>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input autoFocus value={query} onChange={e => { setQuery(e.target.value); setSelected(null); }}
                  placeholder="Search foods..." className="w-full pl-9 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              </div>
              {selected ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-4">
                  <p className="font-bold text-gray-800">{selected.name}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[['Cal', Math.round(selected.calories*servings),'text-orange-600'],['Pro',`${Math.round(selected.protein*servings)}g`,'text-emerald-600'],['Carb',`${Math.round(selected.carbs*servings)}g`,'text-yellow-600'],['Fat',`${Math.round(selected.fat*servings)}g`,'text-red-600']].map(([l,v,c]) => (
                      <div key={l} className="bg-white rounded-xl p-2 text-center"><p className={`text-sm font-bold ${c}`}>{v}</p><p className="text-[10px] text-gray-500">{l}</p></div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-600">Servings</span>
                    <button onClick={() => setServings(Math.max(0.5, servings-0.5))} className="w-9 h-9 bg-gray-200 rounded-full font-bold text-lg flex items-center justify-center">-</button>
                    <input type="number" value={servings} onChange={e => setServings(+e.target.value||1)} className="flex-1 text-center py-2 border-2 border-gray-200 rounded-xl font-bold focus:outline-none focus:border-emerald-400" />
                    <button onClick={() => setServings(servings+0.5)} className="w-9 h-9 bg-gray-200 rounded-full font-bold text-lg flex items-center justify-center">+</button>
                  </div>
                  <button onClick={addSelected} className="w-full py-3.5 bg-emerald-500 text-white rounded-xl font-bold active:scale-98 transition-transform">
                    Add to {mealLabel}
                  </button>
                  <button onClick={() => setSelected(null)} className="w-full text-sm text-gray-400">← Back to list</button>
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map(f => (
                    <button key={f.id} onClick={() => setSelected(f)}
                      className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-colors text-left active:scale-99">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{f.name}</p>
                        <p className="text-xs text-gray-400">P:{f.protein}g · C:{f.carbs}g · F:{f.fat}g</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-orange-500">{f.calories}</p>
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
              <input value={custom.name} onChange={e => setCustom({...custom,name:e.target.value})} placeholder="Food name *" className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              <div className="grid grid-cols-2 gap-2">
                {[['calories','Calories (kcal) *'],['protein','Protein (g)'],['carbs','Carbs (g)'],['fat','Fat (g)'],['fiber','Fiber (g)']].map(([k,l]) => (
                  <input key={k} type="number" value={custom[k]} onChange={e => setCustom({...custom,[k]:e.target.value})} placeholder={l}
                    className="px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                ))}
              </div>
              <button onClick={addCustom} disabled={!custom.name||!custom.calories}
                className="w-full py-3.5 bg-emerald-500 text-white rounded-xl font-bold disabled:opacity-40">Add Food</button>
            </div>
          )}
          {tab === 'scan' && (
            <div className="text-center py-10 space-y-4">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-5xl mb-2">📷</span>
                <p className="text-xs text-gray-400 px-4">Barcode scanner</p>
              </div>
              <p className="text-xs text-gray-400">Camera integration available in native build</p>
              <input placeholder="Or type barcode number..." className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
