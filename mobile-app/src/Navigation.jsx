import { Home, BookOpen, Dumbbell, TrendingUp, User } from 'lucide-react';
import { useApp } from './AppContext';

const TABS = [
  { id:'home',     label:'Home',     Icon:Home },
  { id:'food',     label:'Food',     Icon:BookOpen },
  { id:'exercise', label:'Exercise', Icon:Dumbbell },
  { id:'insights', label:'Insights', Icon:TrendingUp },
  { id:'profile',  label:'Profile',  Icon:User },
];

export default function Navigation() {
  const { state, dispatch } = useApp();
  return (
    <nav className="bg-white border-t border-gray-100 shadow-xl flex-shrink-0">
      <div className="flex items-center justify-around py-2 pb-safe">
        {TABS.map(({ id, label, Icon }) => {
          const on = state.activeTab === id;
          return (
            <button key={id} onClick={() => dispatch({ type:'SET_TAB', tab:id })}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all ${on ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`p-1.5 rounded-xl ${on ? 'bg-emerald-50' : ''}`}>
                <Icon size={22} strokeWidth={on ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] font-semibold ${on ? 'text-emerald-600' : 'text-gray-400'}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
