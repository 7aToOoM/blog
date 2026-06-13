import { useState } from 'react';
import { useApp } from '../AppContext';
import CircularProgress from '../ui/CircularProgress';
import MacroBar from '../ui/MacroBar';
import { Droplets, Footprints, Flame, Moon, Trophy, Zap, Plus, Minus, ChevronRight } from 'lucide-react';
import AICoaching from '../AICoaching';

export default function Home() {
  const { state, dispatch, getDay, getDayTotals, today } = useApp();
  const { profile } = state;
  const day = getDay(today());
  const totals = getDayTotals(today());
  const [showAI, setShowAI] = useState(false);

  const net = Math.round(totals.calories - totals.exerciseCalories);
  const remaining = Math.max(0, profile.calorieTarget - net);
  const waterGlasses = 8;
  const filled = Math.floor(day.water / (profile.waterTarget / waterGlasses));

  const addWater = (ml) => dispatch({ type:'SET_WATER', date:today(), amount: day.water + ml });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { label:'Burned',  value:`${totals.exerciseCalories}`, unit:'kcal', icon:'🔥', bg:'bg-orange-50', text:'text-orange-500' },
    { label:'Steps',   value:day.steps.toLocaleString(),   unit:'',    icon:'👟', bg:'bg-purple-50', text:'text-purple-500' },
    { label:'Sleep',   value:day.sleep?`${day.sleep}h`:'—', unit:'',  icon:'🌙', bg:'bg-indigo-50', text:'text-indigo-500' },
    { label:'Streak',  value:`${state.streak}d`,           unit:'',    icon:'⚡', bg:'bg-yellow-50', text:'text-yellow-500' },
  ];

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-5 pt-14 pb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-emerald-100 text-sm">{greeting},</p>
            <h1 className="text-white text-2xl font-extrabold">{profile.name} 👋</h1>
          </div>
          <button onClick={() => setShowAI(v => !v)}
            className="relative bg-white/20 backdrop-blur p-3 rounded-2xl active:scale-95 transition-transform">
            <Zap size={20} className="text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full text-[9px] font-black text-gray-800 flex items-center justify-center">AI</span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <CircularProgress value={net} max={profile.calorieTarget} label={net.toString()} sublabel="kcal eaten" />
          <div className="space-y-3 ml-6">
            <div><p className="text-[11px] text-emerald-200">Daily Goal</p><p className="text-white font-bold text-lg">{profile.calorieTarget} kcal</p></div>
            <div><p className="text-[11px] text-emerald-200">Remaining</p><p className="text-yellow-300 font-bold text-lg">{remaining} kcal</p></div>
            <div><p className="text-[11px] text-emerald-200">Exercise</p><p className="text-emerald-200 font-bold">+{totals.exerciseCalories} kcal</p></div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-3 space-y-4">
        {showAI && <AICoaching />}

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          {stats.map(({ label, value, icon, bg, text }) => (
            <div key={label} className="bg-white rounded-2xl p-3 shadow-sm text-center">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-1.5 text-lg`}>{icon}</div>
              <p className={`text-xs font-bold ${text}`}>{value}</p>
              <p className="text-[10px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Macros */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Today&apos;s Macros</h3>
          <div className="space-y-3">
            <MacroBar label="Protein" value={totals.protein} max={profile.proteinTarget} color="#10b981" />
            <MacroBar label="Carbs"   value={totals.carbs}   max={profile.carbTarget}    color="#f59e0b" />
            <MacroBar label="Fat"     value={totals.fat}     max={profile.fatTarget}     color="#ef4444" />
            <MacroBar label="Fiber"   value={totals.fiber}   max={profile.fiberTarget}   color="#8b5cf6" />
          </div>
        </div>

        {/* Water */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Droplets size={18} className="text-blue-500" />
              <h3 className="font-bold text-gray-800 text-sm">Water Intake</h3>
            </div>
            <span className="text-sm font-bold text-blue-600">{day.water}ml</span>
          </div>
          <div className="flex gap-1.5 mb-3 justify-center">
            {Array.from({ length: waterGlasses }).map((_, i) => (
              <div key={i} className={`w-7 h-10 rounded-b-xl border-2 transition-all duration-300 ${i < filled ? 'bg-blue-400 border-blue-500' : 'bg-gray-50 border-gray-200'}`} />
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mb-3">{day.water}ml / {profile.waterTarget}ml</p>
          <div className="flex gap-2">
            <button onClick={() => addWater(-250)} className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-gray-100 rounded-xl text-gray-700 text-sm font-semibold active:scale-95 transition-transform">
              <Minus size={14} /> 250ml
            </button>
            <button onClick={() => addWater(250)} className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-blue-500 rounded-xl text-white text-sm font-semibold active:scale-95 transition-transform">
              <Plus size={14} /> 250ml
            </button>
            <button onClick={() => addWater(500)} className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-blue-600 rounded-xl text-white text-sm font-semibold active:scale-95 transition-transform">
              <Plus size={14} /> 500ml
            </button>
          </div>
        </div>

        {/* Meal Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Meals Today</h3>
            <button onClick={() => dispatch({ type:'SET_TAB', tab:'food' })} className="text-emerald-600 text-xs font-semibold flex items-center gap-0.5">
              Log food <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key:'breakfast', label:'Breakfast', icon:'☀️' },
              { key:'lunch',     label:'Lunch',     icon:'🌤️' },
              { key:'dinner',    label:'Dinner',    icon:'🌙' },
              { key:'snacks',    label:'Snacks',    icon:'🍎' },
            ].map(({ key, label, icon }) => {
              const cal = (day.meals[key]||[]).reduce((s,f) => s + f.calories*(f.servings||1), 0);
              return (
                <button key={key} onClick={() => dispatch({ type:'SET_TAB', tab:'food' })}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-colors active:scale-95">
                  <span className="text-2xl">{icon}</span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{Math.round(cal)} kcal</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Challenges */}
        {state.challenges.filter(c => c.joined).length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-3">Active Challenges</h3>
            {state.challenges.filter(c => c.joined).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <span className="text-2xl">🏆</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.participants} participants</p>
                </div>
                <span className="text-xs text-emerald-600 font-bold">Active</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
