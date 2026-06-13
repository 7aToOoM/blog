import { useApp } from './AppContext';
import { Lightbulb, AlertCircle, CheckCircle, Bell, Star } from 'lucide-react';

const iconMap = {
  tip: { Icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  warning: { Icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  success: { Icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  reminder: { Icon: Bell, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  achievement: { Icon: Star, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
};

export default function AICoaching() {
  const { getAIInsights } = useApp();
  const insights = getAIInsights();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
        <h3 className="font-bold text-gray-800 text-sm">Your Nutritionist Insights</h3>
      </div>
      <div className="space-y-2">
        {insights.map((ins, i) => {
          const { Icon, color, bg, border } = iconMap[ins.type] || iconMap.tip;
          return (
            <div key={i} className={`flex gap-3 p-3 rounded-xl border ${bg} ${border}`}>
              <Icon size={16} className={`${color} flex-shrink-0 mt-0.5`} />
              <p className="text-xs text-gray-700 leading-relaxed">{ins.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
