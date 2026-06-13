import { useApp } from './AppContext';
import { Home, BookOpen, Dumbbell, TrendingUp, User } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'food', label: 'Food', Icon: BookOpen },
  { id: 'exercise', label: 'Exercise', Icon: Dumbbell },
  { id: 'insights', label: 'Insights', Icon: TrendingUp },
  { id: 'profile', label: 'Profile', Icon: User },
];

export default function Navigation() {
  const { state, dispatch } = useApp();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ id, label, Icon }) => {
          const active = state.activeTab === id;
          return (
            <button
              key={id}
              onClick={() => dispatch({ type: 'SET_TAB', tab: id })}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-emerald-50' : ''}`}>
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] font-medium ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
