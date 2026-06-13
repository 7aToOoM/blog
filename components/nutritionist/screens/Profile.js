import { useState } from 'react';
import { useApp } from '../AppContext';
import { calculateBMR, calculateTDEE, calculateBMI } from '../AppContext';
import { User, Scale, Target, Bell, Moon, Droplets, ChevronRight, Trophy, Settings, Edit3, Check } from 'lucide-react';

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50">
        <h3 className="font-bold text-gray-700 text-sm">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', options }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  const save = () => { onChange(val); setEditing(false); };

  if (options) {
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
        <span className="text-sm text-gray-600">{label}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm font-semibold text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 text-right"
        >
          {options.map(({ val: v, label: l }) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type={type}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-24 text-right text-sm font-semibold border-b-2 border-emerald-400 focus:outline-none"
            autoFocus
          />
          <button onClick={save} className="text-emerald-500"><Check size={16} /></button>
        </div>
      ) : (
        <button onClick={() => { setVal(value); setEditing(true); }} className="flex items-center gap-1 text-sm font-semibold text-gray-800">
          {value}
          <Edit3 size={12} className="text-gray-400" />
        </button>
      )}
    </div>
  );
}

function WeightLogModal({ onClose }) {
  const { state, dispatch, today } = useApp();
  const [weight, setWeight] = useState(state.profile.weight.toString());
  const [sleep, setSleep] = useState('');

  const log = () => {
    if (weight) dispatch({ type: 'LOG_WEIGHT', date: today(), weight: parseFloat(weight) });
    if (sleep) dispatch({ type: 'LOG_SLEEP', date: today(), hours: parseFloat(sleep) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: '430px', margin: '0 auto' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Log Today&apos;s Measurements</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Weight (kg)</label>
            <input
              type="number" step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Sleep last night (hours)</label>
            <input
              type="number" step="0.5" min="0" max="24"
              placeholder="e.g. 7.5"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600 font-semibold text-sm">Cancel</button>
          <button onClick={log} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { state, dispatch, getBMR, getTDEE, getBMI, getBMICategory } = useApp();
  const { profile, settings, challenges } = state;
  const [showWeightLog, setShowWeightLog] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  const update = (key) => (val) => dispatch({ type: 'UPDATE_PROFILE', data: { [key]: isNaN(val) ? val : parseFloat(val) || val } });

  const bmi = getBMI();
  const bmiCat = getBMICategory();
  const bmr = getBMR();
  const tdee = getTDEE();

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 px-5 pt-12 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{profile.name[0]}</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">{profile.name}</h1>
            <p className="text-gray-400 text-sm">{profile.goal === 'lose' ? '🎯 Weight Loss' : profile.goal === 'gain' ? '💪 Muscle Gain' : '⚖️ Maintenance'}</p>
            <p className="text-gray-500 text-xs mt-0.5">Streak: 🔥 {state.streak} days</p>
          </div>
        </div>

        {/* Body Stats */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          {[
            { label: 'Weight', value: `${profile.weight}kg` },
            { label: 'Height', value: `${profile.height}cm` },
            { label: 'BMI', value: bmi },
            { label: 'Age', value: profile.age },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 rounded-xl p-2 text-center">
              <p className="text-white font-bold text-sm">{value}</p>
              <p className="text-gray-400 text-[10px]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setShowWeightLog(true)} className="bg-emerald-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-emerald-200">
            <Scale size={22} />
            <div className="text-left">
              <p className="font-bold text-sm">Log Weight</p>
              <p className="text-xs text-emerald-100">& Sleep</p>
            </div>
          </button>
          <button onClick={() => setShowCalc(!showCalc)} className="bg-blue-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-blue-200">
            <Target size={22} />
            <div className="text-left">
              <p className="font-bold text-sm">Calculators</p>
              <p className="text-xs text-blue-100">BMI/BMR/TDEE</p>
            </div>
          </button>
        </div>

        {/* Calculators */}
        {showCalc && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-3">Health Calculators</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">BMI</p>
                  <p className="text-xs text-gray-500">Body Mass Index</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${bmiCat.color}`}>{bmi}</p>
                  <p className={`text-xs font-semibold ${bmiCat.color}`}>{bmiCat.label}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">BMR</p>
                  <p className="text-xs text-gray-500">Basal Metabolic Rate</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-500">{bmr}</p>
                  <p className="text-xs text-gray-400">kcal/day</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">TDEE</p>
                  <p className="text-xs text-gray-500">Total Daily Energy Expenditure</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-500">{tdee}</p>
                  <p className="text-xs text-gray-400">kcal/day</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
                <p className="font-medium text-gray-700 mb-1">Suggested targets based on your goal:</p>
                <p>• Lose weight: {Math.round(tdee * 0.8)} kcal/day (20% deficit)</p>
                <p>• Maintain: {tdee} kcal/day</p>
                <p>• Gain muscle: {Math.round(tdee * 1.1)} kcal/day (10% surplus)</p>
              </div>
            </div>
          </div>
        )}

        {/* Personal Info */}
        <Section title="Personal Information">
          <Field label="Name" value={profile.name} onChange={update('name')} />
          <Field label="Age" value={profile.age} onChange={update('age')} type="number" />
          <Field label="Height (cm)" value={profile.height} onChange={update('height')} type="number" />
          <Field label="Weight (kg)" value={profile.weight} onChange={update('weight')} type="number" />
          <Field label="Gender" value={profile.gender} onChange={update('gender')} options={[
            { val: 'male', label: 'Male' }, { val: 'female', label: 'Female' }, { val: 'other', label: 'Other' }
          ]} />
          <Field label="Activity Level" value={profile.activityLevel} onChange={update('activityLevel')} options={[
            { val: 'sedentary', label: 'Sedentary' }, { val: 'light', label: 'Lightly Active' },
            { val: 'moderate', label: 'Moderately Active' }, { val: 'active', label: 'Very Active' }, { val: 'veryActive', label: 'Extra Active' }
          ]} />
        </Section>

        {/* Goals */}
        <Section title="Goals">
          <Field label="Goal" value={profile.goal} onChange={update('goal')} options={[
            { val: 'lose', label: 'Lose Weight' }, { val: 'maintain', label: 'Maintain' }, { val: 'gain', label: 'Gain Muscle' }
          ]} />
          <Field label="Target Weight (kg)" value={profile.goalWeight} onChange={update('goalWeight')} type="number" />
          <Field label="Daily Calories (kcal)" value={profile.calorieTarget} onChange={update('calorieTarget')} type="number" />
          <Field label="Protein Target (g)" value={profile.proteinTarget} onChange={update('proteinTarget')} type="number" />
          <Field label="Carbs Target (g)" value={profile.carbTarget} onChange={update('carbTarget')} type="number" />
          <Field label="Fat Target (g)" value={profile.fatTarget} onChange={update('fatTarget')} type="number" />
          <Field label="Water Target (ml)" value={profile.waterTarget} onChange={update('waterTarget')} type="number" />
          <Field label="Step Goal" value={profile.stepTarget} onChange={update('stepTarget')} type="number" />
          <Field label="Sleep Goal (h)" value={profile.sleepTarget} onChange={update('sleepTarget')} type="number" />
        </Section>

        {/* Challenges */}
        <Section title="Community Challenges">
          <div className="space-y-3">
            {challenges.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">👥 {c.participants} participants</p>
                </div>
                <button
                  onClick={() => dispatch({ type: 'JOIN_CHALLENGE', id: c.id })}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    c.joined ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {c.joined ? '✓ Joined' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* Settings */}
        <Section title="App Settings">
          <div className="space-y-3">
            {[
              { label: 'Units', key: 'units', options: [{ val: 'metric', label: 'Metric (kg/cm)' }, { val: 'imperial', label: 'Imperial (lb/in)' }] },
              { label: 'Notifications', key: 'notifications', toggle: true },
              { label: 'Share Progress', key: 'shareProgress', toggle: true },
            ].map(({ label, key, options, toggle }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{label}</span>
                {toggle ? (
                  <button
                    onClick={() => dispatch({ type: 'UPDATE_SETTINGS', data: { [key]: !settings[key] } })}
                    className={`w-12 h-6 rounded-full transition-all ${settings[key] ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${settings[key] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                ) : options ? (
                  <select
                    value={settings[key]}
                    onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', data: { [key]: e.target.value } })}
                    className="text-sm font-semibold text-gray-800 bg-transparent border-0 focus:outline-none"
                  >
                    {options.map(({ val, label: l }) => <option key={val} value={val}>{l}</option>)}
                  </select>
                ) : null}
              </div>
            ))}
          </div>
        </Section>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm font-bold text-emerald-600">My Favourite Nutritionist</p>
          <p className="text-xs text-gray-400 mt-0.5">Version 1.0 · Built with ❤️ for your health</p>
        </div>
      </div>

      {showWeightLog && <WeightLogModal onClose={() => setShowWeightLog(false)} />}
    </div>
  );
}
