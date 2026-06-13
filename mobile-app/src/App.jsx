import { AppProvider, useApp } from './AppContext';
import Navigation from './Navigation';
import Home from './screens/Home';
import FoodLog from './screens/FoodLog';
import ExerciseLog from './screens/ExerciseLog';
import Insights from './screens/Insights';
import Profile from './screens/Profile';

const SCREENS = { home: Home, food: FoodLog, exercise: ExerciseLog, insights: Insights, profile: Profile };

function Inner() {
  const { state } = useApp();
  const Screen = SCREENS[state.activeTab] || Home;
  return (
    <div className="relative flex flex-col bg-gray-50 overflow-hidden" style={{ height:'100dvh', maxWidth:430, margin:'0 auto' }}>
      <div className="flex-1 overflow-y-auto">
        <Screen />
      </div>
      <Navigation />
    </div>
  );
}

export default function App() {
  return <AppProvider><Inner /></AppProvider>;
}
