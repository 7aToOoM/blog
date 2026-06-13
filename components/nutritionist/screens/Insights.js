import { useState } from 'react';
import { useApp } from '../AppContext';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { TrendingDown, TrendingUp, Minus as Minus2, Scale, Moon, Droplets, Footprints } from 'lucide-react';

const MACRO_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatCard({ label, value, sub, Icon, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
      <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
        {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

export default function Insights() {
  const { state, getWeightHistory, getCalorieHistory, getDayTotals, today } = useApp();
  const [period, setPeriod] = useState('week');

  const weightData = getWeightHistory();
  const calorieData = getCalorieHistory();

  // Average stats
  const recentDays = Object.values(state.days).slice(-7);
  const avgCalories = Math.round(
    recentDays.reduce((s, d) => {
      const foods = Object.values(d.meals).flat();
      return s + foods.reduce((a, f) => a + f.calories * (f.servings || 1), 0);
    }, 0) / Math.max(1, recentDays.length)
  );
  const avgWater = Math.round(recentDays.reduce((s, d) => s + d.water, 0) / Math.max(1, recentDays.length));
  const avgSleep = (recentDays.filter((d) => d.sleep).reduce((s, d) => s + d.sleep, 0) / Math.max(1, recentDays.filter((d) => d.sleep).length)).toFixed(1);
  const avgSteps = Math.round(recentDays.reduce((s, d) => s + d.steps, 0) / Math.max(1, recentDays.length));

  // Weight trend
  const weightTrend = weightData.length >= 2
    ? weightData[weightData.length - 1].weight - weightData[0].weight
    : 0;

  // Today's macros for pie
  const totals = getDayTotals(today());
  const macroData = [
    { name: 'Protein', value: Math.round(totals.protein * 4) },
    { name: 'Carbs', value: Math.round(totals.carbs * 4) },
    { name: 'Fat', value: Math.round(totals.fat * 9) },
    { name: 'Fiber', value: Math.round(totals.fiber * 2) },
  ].filter((d) => d.value > 0);

  // Sleep data
  const sleepData = recentDays
    .filter((d) => d.sleep)
    .map((d) => ({ date: d.date.slice(5), sleep: d.sleep }));

  // Steps data
  const stepsData = recentDays.map((d) => ({ date: d.date.slice(5), steps: d.steps }));

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 px-5 pt-12 pb-6">
        <h1 className="text-white text-2xl font-bold mb-1">Insights</h1>
        <p className="text-sky-100 text-sm">Your health analytics & trends</p>

        <div className="mt-4 flex gap-2">
          {['week', 'month'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                period === p ? 'bg-white text-sky-600' : 'bg-white/20 text-white'
              }`}
            >
              {p === 'week' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Avg Calories" value={avgCalories} sub="last 7 days" Icon={TrendingUp} color="text-orange-500" bg="bg-orange-50" />
          <StatCard label="Avg Water" value={`${avgWater}ml`} sub="last 7 days" Icon={Droplets} color="text-blue-500" bg="bg-blue-50" />
          <StatCard label="Avg Sleep" value={`${avgSleep}h`} sub="last 7 days" Icon={Moon} color="text-indigo-500" bg="bg-indigo-50" />
          <StatCard label="Avg Steps" value={avgSteps.toLocaleString()} sub="last 7 days" Icon={Footprints} color="text-purple-500" bg="bg-purple-50" />
        </div>

        {/* Weight Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Weight Trend</h3>
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              weightTrend < 0 ? 'bg-green-100 text-green-600' : weightTrend > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {weightTrend < 0 ? <TrendingDown size={12} /> : weightTrend > 0 ? <TrendingUp size={12} /> : <Minus2 size={12} />}
              {Math.abs(weightTrend).toFixed(1)}kg
            </div>
          </div>
          {weightData.length > 1 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weightData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} formatter={(v) => [`${v} kg`, 'Weight']} />
                <Area type="monotone" dataKey="weight" stroke="#10b981" fill="url(#weightGrad)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">Log your weight daily to see trends</div>
          )}
        </div>

        {/* Calorie Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-sm">Calorie Intake</h3>
            <div className="w-3 h-3 rounded-full bg-orange-400" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={calorieData.slice(-7)} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} formatter={(v) => [`${v} kcal`, 'Calories']} />
              <Bar dataKey="calories" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Macro Distribution Pie */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Today&apos;s Macro Split (kcal)</h3>
          {macroData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={macroData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {macroData.map((_, i) => (
                      <Cell key={i} fill={MACRO_COLORS[i % MACRO_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {macroData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MACRO_COLORS[i % MACRO_COLORS.length] }} />
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">{item.value} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">Log food to see macro distribution</div>
          )}
        </div>

        {/* Sleep Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Sleep Duration</h3>
          {sleepData.length > 1 ? (
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={sleepData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 12]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} formatter={(v) => [`${v}h`, 'Sleep']} />
                <Bar dataKey="sleep" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">Log sleep to see patterns</div>
          )}
        </div>

        {/* Steps Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Daily Steps</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={stepsData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} formatter={(v) => [v.toLocaleString(), 'Steps']} />
              <Bar dataKey="steps" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Streak & Achievements */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Streaks & Achievements</h3>
          <div className="flex items-center gap-4 mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <span className="text-4xl">🔥</span>
            <div>
              <p className="text-2xl font-bold text-orange-500">{state.streak} days</p>
              <p className="text-xs text-gray-600">Current logging streak</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: '🥗', label: 'First Log', earned: state.streak >= 1 },
              { icon: '🔥', label: '7-Day Streak', earned: state.streak >= 7 },
              { icon: '⚡', label: '30-Day', earned: state.streak >= 30 },
              { icon: '💧', label: 'Hydration Hero', earned: false },
              { icon: '🏃', label: '10k Steps', earned: false },
              { icon: '💯', label: '100 Days', earned: state.streak >= 100 },
            ].map(({ icon, label, earned }) => (
              <div key={label} className={`text-center p-3 rounded-xl ${earned ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 opacity-50'}`}>
                <span className="text-2xl">{icon}</span>
                <p className="text-[10px] text-gray-600 mt-1 font-medium">{label}</p>
                {earned && <p className="text-[10px] text-emerald-600 font-bold">Earned!</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
