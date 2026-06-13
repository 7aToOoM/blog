export default function MacroBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-semibold text-gray-600">{label}</span>
        <span className="text-xs text-gray-400">{Math.round(value)}/{max}g</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width:`${pct}%`, backgroundColor:color }} />
      </div>
    </div>
  );
}
