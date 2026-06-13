import { useState } from 'react';
import { useApp, EXERCISE_DB } from '../AppContext';
import { Plus, Trash2, Clock, Flame, Watch } from 'lucide-react';

const CATS = [
  { key:'all', label:'All' }, { key:'cardio', label:'❤️ Cardio' },
  { key:'strength', label:'💪 Strength' }, { key:'flexibility', label:'🧘 Flex' }
];
const CAT_ICON = { cardio:'❤️', strength:'💪', flexibility:'🧘' };
const CAT_BG   = { cardio:'bg-red-100', strength:'bg-blue-100', flexibility:'bg-green-100' };

function AddModal({ onClose }) {
  const { state, dispatch, today } = useApp();
  const [cat, setCat] = useState('all');
  const [sel, setSel] = useState(null);
  const [dur, setDur] = useState(30);
  const [tab, setTab] = useState('library');
  const [cu, setCu] = useState({ name:'', calories:'', duration:30, category:'cardio' });

  const list = EXERCISE_DB.filter(e => cat === 'all' || e.category === cat);
  const estCal = sel ? Math.round(sel.met * state.profile.weight * (dur/60)) : 0;

  const add = () => {
    if (!sel) return;
    dispatch({ type:'ADD_EXERCISE', date:today(), exercise:{ exerciseId:sel.id, name:sel.name, category:sel.category, duration:dur, calories:estCal } });
    onClose();
  };
  const addCustom = () => {
    if (!cu.name) return;
    dispatch({ type:'ADD_EXERCISE', date:today(), exercise:{ exerciseId:`c${Date.now()}`, name:cu.name, category:cu.category, duration:+cu.duration||30, calories:+cu.calories||0 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ maxWidth:430, margin:'0 auto' }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full flex flex-col" style={{ maxHeight:'88vh' }}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold">Log Exercise</h2>
          <button onClick={onClose} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">✕</button>
        </div>
        <div className="flex gap-1 px-4 pt-3 flex-shrink-0">
          {['library','custom'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold ${tab===t?'bg-purple-500 text-white':'bg-gray-100 text-gray-600'}`}>
              {t==='library'?'📚 Library':'✏️ Custom'}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'library' ? (
            <>
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {CATS.map(({ key, label }) => (
                  <button key={key} onClick={() => setCat(key)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${cat===key?'bg-purple-500 text-white':'bg-gray-100 text-gray-600'}`}>{label}</button>
                ))}
              </div>
              {sel ? (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-4">
                  <p className="font-bold text-gray-800">{sel.name}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 text-center"><p className="text-2xl font-bold text-purple-600">{estCal}</p><p className="text-xs text-gray-500">Est. Cal</p></div>
                    <div className="bg-white rounded-xl p-3 text-center"><p className="text-2xl font-bold text-orange-500">{sel.met}</p><p className="text-xs text-gray-500">MET</p></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setDur(Math.max(5,dur-5))} className="w-11 h-11 bg-gray-200 rounded-full font-bold text-xl flex items-center justify-center">-</button>
                      <input type="number" value={dur} onChange={e => setDur(+e.target.value||30)} className="flex-1 text-center py-2.5 border-2 border-gray-200 rounded-xl font-bold text-xl focus:outline-none focus:border-purple-400" />
                      <button onClick={() => setDur(dur+5)} className="w-11 h-11 bg-gray-200 rounded-full font-bold text-xl flex items-center justify-center">+</button>
                    </div>
                  </div>
                  <button onClick={add} className="w-full py-3.5 bg-purple-500 text-white rounded-xl font-bold active:scale-98">Add Exercise</button>
                  <button onClick={() => setSel(null)} className="w-full text-sm text-gray-400">← Back to list</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {list.map(ex => (
                    <button key={ex.id} onClick={() => setSel(ex)}
                      className="w-full flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-purple-50 rounded-xl transition-colors text-left active:scale-99">
                      <div className={`w-11 h-11 ${CAT_BG[ex.category]} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>{CAT_ICON[ex.category]}</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{ex.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{ex.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-purple-600">MET {ex.met}</p>
                        <p className="text-[10px] text-gray-400">~{Math.round(ex.met*state.profile.weight*0.5)} cal/30m</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <input value={cu.name} onChange={e => setCu({...cu,name:e.target.value})} placeholder="Exercise name *" className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={cu.duration} onChange={e => setCu({...cu,duration:e.target.value})} placeholder="Duration (min)" className="px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <input type="number" value={cu.calories} onChange={e => setCu({...cu,calories:e.target.value})} placeholder="Calories burned" className="px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div className="flex gap-2">
                {['cardio','strength','flexibility'].map(c => (
                  <button key={c} onClick={() => setCu({...cu,category:c})} className={`flex-1 py-2 rounded-xl text-xs font-bold ${cu.category===c?'bg-purple-500 text-white':'bg-gray-100 text-gray-600'}`}>{c}</button>
                ))}
              </div>
              <button onClick={addCustom} disabled={!cu.name} className="w-full py-3.5 bg-purple-500 text-white rounded-xl font-bold disabled:opacity-40 active:scale-98">Log Exercise</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExerciseLog() {
  const { state, dispatch, getDay, getDayTotals, today } = useApp();
  const [modal, setModal] = useState(false);
  const day = getDay(today());
  const totals = getDayTotals(today());
  const totalDur = day.exercises.reduce((s,e) => s+e.duration, 0);

  return (
    <div className="pb-4">
      <div className="bg-gradient-to-br from-purple-600 to-violet-700 px-5 pt-14 pb-6">
        <h1 className="text-white text-2xl font-extrabold">Exercise Log</h1>
        <p className="text-purple-100 text-sm mb-4">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
        <div className="grid grid-cols-3 gap-3">
          {[['Workouts',day.exercises.length,'🏋️'],['Duration',`${totalDur}m`,'⏱️'],['Burned',totals.exerciseCalories,'🔥']].map(([l,v,i]) => (
            <div key={l} className="bg-white/20 rounded-2xl p-3 text-center">
              <p className="text-2xl mb-0.5">{i}</p>
              <p className="text-xl font-bold text-white">{v}</p>
              <p className="text-xs text-purple-200">{l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-4 space-y-4">
        {/* Steps */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Watch size={18} className="text-purple-500" /><h3 className="font-bold text-gray-800 text-sm">Steps Today</h3></div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Sync ready</span>
          </div>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-3xl font-extrabold text-purple-600">{day.steps.toLocaleString()}</span>
            <span className="text-sm text-gray-400 mb-1">/ {state.profile.stepTarget.toLocaleString()}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full transition-all duration-500"
              style={{ width:`${Math.min(100,(day.steps/state.profile.stepTarget)*100)}%` }} />
          </div>
          <p className="text-xs text-gray-400 mb-3">{Math.max(0,state.profile.stepTarget-day.steps).toLocaleString()} steps remaining</p>
          <div className="flex gap-2 mb-2">
            {[1000,3000,5000,10000].map(s => (
              <button key={s} onClick={() => dispatch({ type:'SET_STEPS', date:today(), steps:Math.min(20000,day.steps+s) })}
                className="flex-1 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold active:scale-95 transition-transform">
                +{s>=1000?`${s/1000}k`:s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 bg-gray-100 rounded-xl text-xs text-gray-600 font-semibold">🍎 Apple Health</button>
            <button className="flex-1 py-2.5 bg-gray-100 rounded-xl text-xs text-gray-600 font-semibold">🤖 Google Fit</button>
          </div>
        </div>

        <button onClick={() => setModal(true)}
          className="w-full flex items-center justify-center gap-2 py-4 bg-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-purple-200 active:scale-98 transition-transform">
          <Plus size={20} /> Log Exercise
        </button>

        {day.exercises.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-3">🏃</div>
            <p className="font-bold text-gray-600">No workouts logged yet</p>
            <p className="text-sm text-gray-400 mt-1">Tap the button above to add one</p>
          </div>
        ) : (
          <div className="space-y-2">
            {day.exercises.map(ex => (
              <div key={ex.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className={`w-12 h-12 ${CAT_BG[ex.category]||'bg-gray-100'} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0`}>
                  {CAT_ICON[ex.category]||'⚡'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm">{ex.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} />{ex.duration}min</span>
                    <span className="text-xs text-orange-500 flex items-center gap-1"><Flame size={11} />{ex.calories}kcal</span>
                  </div>
                </div>
                <button onClick={() => dispatch({ type:'REMOVE_EXERCISE', date:today(), exerciseId:ex.id })}
                  className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center active:scale-95 flex-shrink-0">
                  <Trash2 size={15} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {modal && <AddModal onClose={() => setModal(false)} />}
    </div>
  );
}
