import { useState } from 'react';
import { useApp } from '../AppContext';
import { X, Search, Trash2 } from 'lucide-react';

export default function RecipeBuilder({ onClose }) {
  const { dispatch, allFoods, today } = useApp();
  const [name, setName] = useState('');
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [query, setQuery] = useState('');
  const [done, setDone] = useState(false);

  const filtered = query.length > 1 ? allFoods.filter(f => f.name.toLowerCase().includes(query.toLowerCase())).slice(0,8) : [];
  const add = (f) => { setIngredients(p => [...p.filter(i => i.id!==f.id), { ...f, qty:1 }]); setQuery(''); };
  const setQty = (id, q) => setIngredients(p => p.map(i => i.id===id?{...i,qty:Math.max(0.5,q)}:i));
  const remove = (id) => setIngredients(p => p.filter(i => i.id!==id));

  const total = ingredients.reduce((a,i) => ({
    calories: a.calories + i.calories*i.qty, protein: a.protein+i.protein*i.qty,
    carbs: a.carbs+i.carbs*i.qty, fat: a.fat+i.fat*i.qty, fiber: a.fiber+i.fiber*i.qty
  }), {calories:0,protein:0,carbs:0,fat:0,fiber:0});
  const per = Object.fromEntries(Object.entries(total).map(([k,v]) => [k, Math.round(v/servings)]));

  const save = () => {
    if (!name || !ingredients.length) return;
    dispatch({ type:'ADD_RECIPE', recipe:{ name, servings, ingredients, perServing:per } });
    dispatch({ type:'ADD_FOOD', date:today(), meal:'lunch', food:{ ...per, id:`r${Date.now()}`, name, servings:1 } });
    setDone(true); setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ maxWidth:430, margin:'0 auto' }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full flex flex-col" style={{ maxHeight:'90vh' }}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold">Recipe Builder</h2>
          <button onClick={onClose} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {done ? (
            <div className="text-center py-16"><div className="text-6xl mb-3">🎉</div><p className="font-bold text-gray-800 text-lg">Recipe Saved!</p><p className="text-sm text-gray-500 mt-1">Added to today&apos;s lunch</p></div>
          ) : (
            <>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Recipe name..." className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Servings:</span>
                <input type="number" min="1" value={servings} onChange={e => setServings(Math.max(1,+e.target.value||1))}
                  className="w-20 text-center px-3 py-2 bg-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Add ingredient..."
                  className="w-full pl-9 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                {filtered.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                    {filtered.map(f => (
                      <button key={f.id} onClick={() => add(f)} className="w-full flex justify-between px-4 py-3 hover:bg-emerald-50 border-b border-gray-50 last:border-0 text-left">
                        <span className="text-sm font-medium">{f.name}</span>
                        <span className="text-xs text-orange-500 font-bold">{f.calories} kcal</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {ingredients.map(ing => (
                <div key={ing.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{ing.name}</p>
                    <p className="text-xs text-gray-400">{Math.round(ing.calories*ing.qty)} kcal</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setQty(ing.id,ing.qty-0.5)} className="w-7 h-7 bg-gray-200 rounded-full text-sm font-bold flex items-center justify-center">-</button>
                    <span className="w-8 text-center text-sm font-bold">{ing.qty}</span>
                    <button onClick={() => setQty(ing.id,ing.qty+0.5)} className="w-7 h-7 bg-gray-200 rounded-full text-sm font-bold flex items-center justify-center">+</button>
                  </div>
                  <button onClick={() => remove(ing.id)} className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0"><Trash2 size={13} className="text-red-400" /></button>
                </div>
              ))}
              {ingredients.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-emerald-700 mb-2">Per Serving</p>
                  <div className="flex gap-2">
                    {[['Cal',per.calories,'text-orange-600'],['Pro',`${per.protein}g`,'text-emerald-600'],['Carb',`${per.carbs}g`,'text-yellow-600'],['Fat',`${per.fat}g`,'text-red-600'],['Fib',`${per.fiber}g`,'text-purple-600']].map(([l,v,c]) => (
                      <div key={l} className="flex-1 bg-white rounded-xl p-2 text-center"><p className={`text-xs font-bold ${c}`}>{v}</p><p className="text-[10px] text-gray-400">{l}</p></div>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={save} disabled={!name||!ingredients.length}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold disabled:opacity-40 active:scale-98 transition-transform">
                Save Recipe & Add to Log
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
