import { useApp } from './AppContext';
import { Lightbulb, AlertCircle, CheckCircle, Bell, Star } from 'lucide-react';

const MAP = {
  tip:         { Icon:Lightbulb,    cls:'bg-yellow-50 border-yellow-200 text-yellow-600' },
  warning:     { Icon:AlertCircle,  cls:'bg-orange-50 border-orange-200 text-orange-600' },
  success:     { Icon:CheckCircle,  cls:'bg-emerald-50 border-emerald-200 text-emerald-600' },
  reminder:    { Icon:Bell,         cls:'bg-blue-50 border-blue-200 text-blue-600' },
  achievement: { Icon:Star,         cls:'bg-purple-50 border-purple-200 text-purple-600' },
};

export default function AICoaching() {
  const { getAIInsights } = useApp();
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-[10px] font-black">AI</span>
        </div>
        <h3 className="font-bold text-gray-800 text-sm">Your Nutritionist Insights</h3>
      </div>
      <div className="space-y-2">
        {getAIInsights().map((ins, i) => {
          const { Icon, cls } = MAP[ins.type] || MAP.tip;
          return (
            <div key={i} className={`flex gap-3 p-3 rounded-xl border ${cls}`}>
              <Icon size={15} className="flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed">{ins.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
