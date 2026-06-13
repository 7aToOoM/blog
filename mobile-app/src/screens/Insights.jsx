import { useApp } from '../AppContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';

const PIE_COLORS = ['#10b981','#f59e0b','#ef4444','#8b5cf6'];

export default function Insights() {
  const { state, getWeightHistory, getCalorieHistory, getDayTotals, today } = useApp();

  const weightData  = getWeightHistory();
  const calorieData = getCalorieHistory();
  const recent7 = Object.values(state.days).sort((a,b) => b.date.localeCompare(a.date)).slice(0,7);

  const avg = (arr, fn) => arr.length ? Math.round(arr.reduce((s,d) => s+fn(d), 0) / arr.length) : 0;
  const avgCal   = avg(recent7, d => Object.values(d.meals).flat().reduce((s,f)=>s+f.calories*(f.servings||1),0));
  const avgWater  = avg(recent7, d => d.water);
  const avgSteps  = avg(recent7, d => d.steps);
  const sleepDays = recent7.filter(d => d.sleep);
  const avgSleep  = sleepDays.length ? (sleepDays.reduce((s,d)=>s+d.sleep,0)/sleepDays.length).toFixed(1) : '—';

  const totals = getDayTotals(today());
  const macroData = [
    { name:'Protein', value:Math.round(totals.protein*4) },
    { name:'Carbs',   value:Math.round(totals.carbs*4)   },
    { name:'Fat',     value:Math.round(totals.fat*9)     },
    { name:'Fiber',   value:Math.round(totals.fiber*2)   },
  ].filter(d => d.value > 0);

  const weightTrend = weightData.length >= 2 ? weightData[weightData.length-1].weight - weightData[0].weight : 0;
  const sleepData = recent7.filter(d=>d.sleep).reverse().map(d=>({ date:d.date.slice(5), sleep:d.sleep }));
  const stepsData = recent7.reverse().map(d=>({ date:d.date.slice(5), steps:d.steps }));

  const statCards = [
    { icon:'🔥', label:'Avg Calories', value:avgCal,   unit:'kcal' },
    { icon:'💧', label:'Avg Water',    value:`${avgWater}ml`, unit:'' },
    { icon:'🌙', label:'Avg Sleep',    value:`${avgSleep}h`, unit:'' },
    { icon:'👟', label:'Avg Steps',    value:avgSteps.toLocaleString(), unit:'' },
  ];

  return (
    <div className="pb-4">
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 px-5 pt-14 pb-6">
        <h1 className="text-white text-2xl font-extrabold">Insights</h1>
        <p className="text-sky-100 text-sm">Your health analytics & trends</p>
      </div>
      <div className="px-4 py-4 space-y-4">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map(({ icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="text-lg font-extrabold text-gray-800">{value}</p>
                <p className="text-xs text-gray-400">{label} · 7d</p>
              </div>
            </div>
          ))}
        </div>

        {/* Weight Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Weight Trend</h3>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${weightTrend < 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {weightTrend < 0 ? <TrendingDown size={12}/> : <TrendingUp size={12}/>}
              {Math.abs(weightTrend).toFixed(1)}kg
            </div>
          </div>
          {weightData.length > 1 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={weightData} margin={{top:5,right:5,bottom:0,left:-20}}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                <XAxis dataKey="date" tick={{fontSize:9,fill:'#9ca3af'}} interval="preserveStartEnd"/>
                <YAxis tick={{fontSize:9,fill:'#9ca3af'}} domain={['dataMin - 1','dataMax + 1']}/>
                <Tooltip contentStyle={{fontSize:11,borderRadius:10}} formatter={v=>[`${v} kg`,'Weight']}/>
                <Area type="monotone" dataKey="weight" stroke="#10b981" fill="url(#wg)" strokeWidth={2.5} dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-xs text-gray-400 text-center py-8">Log your weight daily to see trends</p>}
        </div>

        {/* Calorie Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Daily Calories (14 days)</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={calorieData} margin={{top:5,right:5,bottom:0,left:-25}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="date" tick={{fontSize:9,fill:'#9ca3af'}}/>
              <YAxis tick={{fontSize:9,fill:'#9ca3af'}}/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:10}} formatter={v=>[`${v} kcal`,'Calories']}/>
              <Bar dataKey="calories" fill="#f97316" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Macro Pie */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Today&apos;s Macros (kcal)</h3>
          {macroData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie data={macroData} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="value">
                    {macroData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{fontSize:11,borderRadius:8}}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {macroData.map((d,i) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor:PIE_COLORS[i%PIE_COLORS.length]}}/>
                      <span className="text-xs text-gray-600">{d.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">{d.value} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-xs text-gray-400 text-center py-6">Log food to see distribution</p>}
        </div>

        {/* Sleep Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Sleep Duration</h3>
          {sleepData.length > 1 ? (
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={sleepData} margin={{top:5,right:5,bottom:0,left:-25}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                <XAxis dataKey="date" tick={{fontSize:9,fill:'#9ca3af'}}/>
                <YAxis tick={{fontSize:9,fill:'#9ca3af'}} domain={[0,12]}/>
                <Tooltip contentStyle={{fontSize:11,borderRadius:10}} formatter={v=>[`${v}h`,'Sleep']}/>
                <Bar dataKey="sleep" fill="#6366f1" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-xs text-gray-400 text-center py-6">Log sleep to see patterns</p>}
        </div>

        {/* Steps Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Daily Steps</h3>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={stepsData} margin={{top:5,right:5,bottom:0,left:-25}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="date" tick={{fontSize:9,fill:'#9ca3af'}}/>
              <YAxis tick={{fontSize:9,fill:'#9ca3af'}}/>
              <Tooltip contentStyle={{fontSize:11,borderRadius:10}} formatter={v=>[v.toLocaleString(),'Steps']}/>
              <Bar dataKey="steps" fill="#8b5cf6" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Streak */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Streak & Achievements</h3>
          <div className="flex items-center gap-4 mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <span className="text-5xl">🔥</span>
            <div><p className="text-3xl font-extrabold text-orange-500">{state.streak}</p><p className="text-xs text-gray-600">day streak</p></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[['🥗','First Log',state.streak>=1],['🔥','7-Day',state.streak>=7],['⚡','30-Day',state.streak>=30],
              ['💧','Hydrated',false],['🏃','10k Steps',false],['💯','100 Days',state.streak>=100]].map(([icon,label,earned]) => (
              <div key={label} className={`text-center p-3 rounded-xl ${earned?'bg-emerald-50 border border-emerald-200':'bg-gray-50 opacity-50'}`}>
                <span className="text-2xl">{icon}</span>
                <p className="text-[10px] text-gray-600 mt-1 font-semibold">{label}</p>
                {earned && <p className="text-[10px] text-emerald-600 font-bold">Earned!</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
