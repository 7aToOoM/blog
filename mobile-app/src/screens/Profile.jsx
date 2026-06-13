import { useState } from 'react';
import { useApp, calcBMR, calcTDEE, calcBMI } from '../AppContext';
import { Edit3, Check, Scale } from 'lucide-react';

function Field({ label, value, onChange, type='text', options }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const save = () => { onChange(val); setEditing(false); };
  if (options) return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="text-sm font-bold text-gray-800 bg-transparent border-0 focus:outline-none text-right max-w-[160px]">
        {options.map(({v,l}) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      {editing ? (
        <div className="flex items-center gap-2">
          <input type={type} value={val} onChange={e=>setVal(e.target.value)} autoFocus
            className="w-28 text-right text-sm font-bold border-b-2 border-emerald-400 focus:outline-none bg-transparent" />
          <button onClick={save} className="text-emerald-500"><Check size={16}/></button>
        </div>
      ) : (
        <button onClick={() => { setVal(value); setEditing(true); }} className="flex items-center gap-1 text-sm font-bold text-gray-800">
          {value}<Edit3 size={11} className="text-gray-400"/>
        </button>
      )}
    </div>
  );
}

function LogModal({ onClose }) {
  const { state, dispatch, today } = useApp();
  const [weight, setWeight] = useState(state.profile.weight.toString());
  const [sleep, setSleep] = useState('');
  const save = () => {
    if (weight) dispatch({ type:'LOG_WEIGHT', date:today(), weight:parseFloat(weight) });
    if (sleep)  dispatch({ type:'LOG_SLEEP',  date:today(), hours:parseFloat(sleep) });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ maxWidth:430, margin:'0 auto' }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white rounded-t-3xl w-full p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Log Measurements</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Weight (kg)</label>
            <input type="number" step="0.1" value={weight} onChange={e=>setWeight(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Sleep last night (hours)</label>
            <input type="number" step="0.5" min="0" max="24" placeholder="e.g. 7.5" value={sleep} onChange={e=>setSleep(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600 font-semibold text-sm">Cancel</button>
          <button onClick={save} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm active:scale-98">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { state, dispatch } = useApp();
  const { profile, settings, challenges } = state;
  const [showLog, setShowLog] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  const up = (key) => (val) => dispatch({ type:'UPDATE_PROFILE', data:{ [key]: isNaN(+val) ? val : +val || val } });

  const bmi = calcBMI(profile);
  const bmr = calcBMR(profile);
  const tdee = calcTDEE(profile);
  const bmiCat = +bmi < 18.5 ? ['Underweight','text-blue-500'] : +bmi < 25 ? ['Normal','text-emerald-500'] : +bmi < 30 ? ['Overweight','text-yellow-500'] : ['Obese','text-red-500'];

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 px-5 pt-14 pb-8">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-extrabold text-white">{profile.name[0]}</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-extrabold">{profile.name}</h1>
            <p className="text-gray-400 text-sm">{profile.goal==='lose'?'🎯 Weight Loss':profile.goal==='gain'?'💪 Muscle Gain':'⚖️ Maintenance'}</p>
            <p className="text-gray-500 text-xs mt-0.5">🔥 {state.streak}-day streak</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[['Weight',`${profile.weight}kg`],['Height',`${profile.height}cm`],['BMI',bmi],['Age',profile.age]].map(([l,v]) => (
            <div key={l} className="bg-white/10 rounded-xl p-2 text-center">
              <p className="text-white font-bold text-sm">{v}</p>
              <p className="text-gray-400 text-[10px]">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setShowLog(true)} className="bg-emerald-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-emerald-200 active:scale-98 transition-transform">
            <Scale size={22}/><div className="text-left"><p className="font-bold text-sm">Log Weight</p><p className="text-xs text-emerald-100">& Sleep</p></div>
          </button>
          <button onClick={() => setShowCalc(v=>!v)} className="bg-blue-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-blue-200 active:scale-98 transition-transform">
            <span className="text-2xl">🧮</span><div className="text-left"><p className="font-bold text-sm">Calculators</p><p className="text-xs text-blue-100">BMI/BMR/TDEE</p></div>
          </button>
        </div>

        {/* Calculators */}
        {showCalc && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-800 text-sm">Health Calculators</h3>
            {[
              ['BMI','Body Mass Index',bmi,bmiCat[1],bmiCat[0],'bg-blue-50'],
              ['BMR','Basal Metabolic Rate',bmr,'text-orange-500','kcal/day at rest','bg-orange-50'],
              ['TDEE','Total Daily Energy',tdee,'text-purple-500','kcal/day with activity','bg-purple-50'],
            ].map(([name,sub,val,valCls,tag,bg]) => (
              <div key={name} className={`flex items-center justify-between p-3.5 ${bg} rounded-xl`}>
                <div><p className="font-bold text-gray-800 text-sm">{name}</p><p className="text-xs text-gray-500">{sub}</p></div>
                <div className="text-right"><p className={`text-2xl font-extrabold ${valCls}`}>{val}</p><p className="text-[10px] text-gray-400">{tag}</p></div>
              </div>
            ))}
            <div className="p-3.5 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
              <p className="font-bold text-gray-700 mb-1">Targets based on your goal:</p>
              <p>• Lose: {Math.round(tdee*0.8)} kcal/day (20% deficit)</p>
              <p>• Maintain: {tdee} kcal/day</p>
              <p>• Gain: {Math.round(tdee*1.1)} kcal/day (10% surplus)</p>
            </div>
          </div>
        )}

        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50"><h3 className="font-bold text-gray-700 text-sm">Personal Info</h3></div>
          <div className="px-4">
            <Field label="Name"     value={profile.name}   onChange={up('name')}   />
            <Field label="Age"      value={profile.age}    onChange={up('age')}    type="number"/>
            <Field label="Height"   value={`${profile.height}cm`} onChange={v=>up('height')(v.replace('cm',''))} type="number"/>
            <Field label="Gender"   value={profile.gender} onChange={up('gender')}
              options={[{v:'male',l:'Male'},{v:'female',l:'Female'},{v:'other',l:'Other'}]}/>
            <Field label="Activity" value={profile.activityLevel} onChange={up('activityLevel')}
              options={[{v:'sedentary',l:'Sedentary'},{v:'light',l:'Lightly Active'},{v:'moderate',l:'Moderate'},{v:'active',l:'Very Active'},{v:'veryActive',l:'Extra Active'}]}/>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50"><h3 className="font-bold text-gray-700 text-sm">Goals</h3></div>
          <div className="px-4">
            <Field label="Goal" value={profile.goal} onChange={up('goal')}
              options={[{v:'lose',l:'Lose Weight'},{v:'maintain',l:'Maintain'},{v:'gain',l:'Gain Muscle'}]}/>
            <Field label="Target Weight" value={`${profile.goalWeight}kg`} onChange={v=>up('goalWeight')(v.replace('kg',''))} type="number"/>
            <Field label="Calories/day"  value={profile.calorieTarget} onChange={up('calorieTarget')}  type="number"/>
            <Field label="Protein (g)"   value={profile.proteinTarget} onChange={up('proteinTarget')}  type="number"/>
            <Field label="Carbs (g)"     value={profile.carbTarget}    onChange={up('carbTarget')}     type="number"/>
            <Field label="Fat (g)"       value={profile.fatTarget}     onChange={up('fatTarget')}      type="number"/>
            <Field label="Water (ml)"    value={profile.waterTarget}   onChange={up('waterTarget')}    type="number"/>
            <Field label="Daily Steps"   value={profile.stepTarget}    onChange={up('stepTarget')}     type="number"/>
            <Field label="Sleep Goal (h)" value={profile.sleepTarget}  onChange={up('sleepTarget')}   type="number"/>
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50"><h3 className="font-bold text-gray-700 text-sm">Community Challenges</h3></div>
          <div className="p-4 space-y-2">
            {challenges.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                <span className="text-2xl">🏆</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">👥 {c.participants} participants</p>
                </div>
                <button onClick={() => dispatch({ type:'JOIN_CHALLENGE', id:c.id })}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 active:scale-95 ${c.joined?'bg-emerald-100 text-emerald-700':'bg-gray-200 text-gray-600'}`}>
                  {c.joined?'✓ Joined':'Join'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50"><h3 className="font-bold text-gray-700 text-sm">Settings</h3></div>
          <div className="px-4">
            {[['Notifications','notifications'],['Share Progress','shareProgress']].map(([label,key]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{label}</span>
                <button onClick={() => dispatch({ type:'UPDATE_SETTINGS', data:{ [key]:!settings[key] } })}
                  className={`w-12 h-6 rounded-full transition-all ${settings[key]?'bg-emerald-500':'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${settings[key]?'translate-x-6':'translate-x-0'}`}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-4 pb-2">
          <p className="text-sm font-extrabold text-emerald-600">My Favourite Nutritionist</p>
          <p className="text-xs text-gray-400 mt-0.5">v1.0 · All your health data, in one place</p>
        </div>
      </div>
      {showLog && <LogModal onClose={() => setShowLog(false)}/>}
    </div>
  );
}
