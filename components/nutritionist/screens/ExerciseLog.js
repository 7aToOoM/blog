import { useState } from 'react';
import { useApp } from '../AppContext';
import { Plus, Trash2, Dumbbell, Heart, Zap, Clock, Flame, Watch } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'cardio', label: '❤️ Cardio' },
  { key: 'strength', label: '💪 Strength' },
  { key: 'flexibility', label: '🧘 Flexibility' },
  { key: 'custom', label: '⚡ Custom' },
];

function AddExerciseModal({ onClose }) {
  const { state, dispatch, today } = useApp();
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState(null);
  const [duration, setDuration] = useState(30);
  const [tab, setTab] = useState('library');
  const [custom, setCustom] = useState({ name: '', calories: '', duration: 30, category: 'cardio' });

  const filtered = state.exerciseDB.filter(
    (e) => category === 'all' || e.category === category
  );

  const estimatedCal = selected
    ? Math.round(selected.metValue * state.profile.weight * (duration / 60))
    : 0;

  const handleAdd = () => {
    if (!selected) return;
    dispatch({
      type: 'ADD_EXERCISE',
      date: today(),
      exercise: {
        exerciseId: selected.id,
        name: selected.name,
        category: selected.category,
        duration,
        calories: estimatedCal,
      },
    });
    onClose();
  };

  const handleAddCustom = () => {
    if (!custom.name) return;
    dispatch({
      type: 'ADD_EXERCISE',
      date: today(),
      exercise: {
        exerciseId: `custom_${Date.now()}`,
        name: custom.name,
        category: custom.category,
        duration: parseInt(custom.duration) || 30,
        calories: parseInt(custom.calories) || 0,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: '430px', margin: '0 auto' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Log Exercise</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-600">✕</button>
        </div>

        <div className="flex gap-1 px-4 pt-3">
          {['library', 'custom'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {t === 'library' ? '📚 Library' : '✏️ Custom'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'library' ? (
            <>
              {/* Category Filter */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {CATEGORIES.map(({ key, label }) => (
                  <button key={key} onClick={() => setCategory(key)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${category === key ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {selected ? (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-4">
                  <h4 className="font-bold text-gray-800">{selected.name}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-purple-600">{estimatedCal}</p>
                      <p className="text-xs text-gray-500">Est. Calories</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-orange-500">{selected.metValue}</p>
                      <p className="text-xs text-gray-500">MET Value</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Duration (minutes)</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setDuration(Math.max(5, duration - 5))} className="w-10 h-10 bg-gray-200 rounded-full font-bold text-lg">-</button>
                      <input
                        type="number" min="1" max="300"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                        className="flex-1 text-center py-2 bg-white border border-gray-200 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <button onClick={() => setDuration(duration + 5)} className="w-10 h-10 bg-gray-200 rounded-full font-bold text-lg">+</button>
                    </div>
                  </div>
                  <button onClick={handleAdd} className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold">
                    Add Exercise
                  </button>
                  <button onClick={() => setSelected(null)} className="w-full py-2 text-gray-500 text-sm">← Back to list</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((ex) => (
                    <button key={ex.id} onClick={() => setSelected(ex)} className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-purple-50 rounded-xl transition-colors text-left">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        ex.category === 'cardio' ? 'bg-red-100' : ex.category === 'strength' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {ex.category === 'cardio' ? '❤️' : ex.category === 'strength' ? '💪' : '🧘'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{ex.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{ex.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-purple-600">MET {ex.metValue}</p>
                        <p className="text-[10px] text-gray-400">~{Math.round(ex.metValue * state.profile.weight * 0.5)} cal/30m</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <input
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Exercise name *"
                value={custom.name}
                onChange={(e) => setCustom({ ...custom, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  className="px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Duration (min)"
                  value={custom.duration}
                  onChange={(e) => setCustom({ ...custom, duration: e.target.value })}
                />
                <input
                  type="number"
                  className="px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Calories burned"
                  value={custom.calories}
                  onChange={(e) => setCustom({ ...custom, calories: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                {['cardio', 'strength', 'flexibility'].map((c) => (
                  <button key={c} onClick={() => setCustom({ ...custom, category: c })} className={`flex-1 py-2 rounded-xl text-xs font-semibold ${custom.category === c ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <button onClick={handleAddCustom} disabled={!custom.name} className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold text-sm disabled:opacity-50">
                Log Exercise
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExerciseLog() {
  const { state, dispatch, getDay, getDayTotals, today } = useApp();
  const [showModal, setShowModal] = useState(false);
  const day = getDay(today());
  const totals = getDayTotals(today());
  const totalDuration = day.exercises.reduce((s, e) => s + e.duration, 0);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-violet-700 px-5 pt-12 pb-6">
        <h1 className="text-white text-2xl font-bold mb-1">Exercise Log</h1>
        <p className="text-purple-100 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Workouts', value: day.exercises.length, Icon: Dumbbell },
            { label: 'Duration', value: `${totalDuration}m`, Icon: Clock },
            { label: 'Burned', value: `${totals.exerciseCalories}`, Icon: Flame },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
              <Icon size={20} className="text-white/70 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-purple-200">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Steps & Wearable */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Watch size={18} className="text-purple-500" />
              <h3 className="font-bold text-gray-800 text-sm">Steps & Activity</h3>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Sync ready</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-end gap-1 mb-2">
                <span className="text-3xl font-bold text-purple-600">{day.steps.toLocaleString()}</span>
                <span className="text-sm text-gray-400 mb-1">/ {state.profile.stepTarget.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (day.steps / state.profile.stepTarget) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.max(0, state.profile.stepTarget - day.steps).toLocaleString()} steps to goal</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {[2000, 5000, 10000].map((s) => (
              <button
                key={s}
                onClick={() => dispatch({ type: 'SET_STEPS', date: today(), steps: Math.min(s, 20000) })}
                className="flex-1 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-semibold"
              >
                +{(s / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button className="flex-1 py-2 bg-gray-100 rounded-xl text-xs text-gray-600 font-medium flex items-center justify-center gap-1">
              <span>🍎</span> Apple Health
            </button>
            <button className="flex-1 py-2 bg-gray-100 rounded-xl text-xs text-gray-600 font-medium flex items-center justify-center gap-1">
              <span>🤖</span> Google Fit
            </button>
          </div>
        </div>

        {/* Add Exercise Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 py-4 bg-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-purple-200"
        >
          <Plus size={20} />
          Log Exercise
        </button>

        {/* Exercise List */}
        {day.exercises.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
            <div className="text-5xl mb-3">🏃</div>
            <p className="font-semibold text-gray-600">No exercises logged yet</p>
            <p className="text-sm text-gray-400 mt-1">Tap the button above to add a workout</p>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="font-bold text-gray-800 text-sm">Today&apos;s Workouts</h3>
            {day.exercises.map((ex) => (
              <div key={ex.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                  ex.category === 'cardio' ? 'bg-red-100' : ex.category === 'strength' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {ex.category === 'cardio' ? '❤️' : ex.category === 'strength' ? '💪' : '🧘'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{ex.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={11} /> {ex.duration} min
                    </span>
                    <span className="text-xs text-orange-500 flex items-center gap-1">
                      <Flame size={11} /> {ex.calories} kcal
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_EXERCISE', date: today(), exerciseId: ex.id })}
                  className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AddExerciseModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
