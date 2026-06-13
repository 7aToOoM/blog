import { useApp } from './AppContext';
import Navigation from './Navigation';
import Home from './screens/Home';
import FoodLog from './screens/FoodLog';
import ExerciseLog from './screens/ExerciseLog';
import Insights from './screens/Insights';
import Profile from './screens/Profile';

const SCREENS = {
  home: Home,
  food: FoodLog,
  exercise: ExerciseLog,
  insights: Insights,
  profile: Profile,
};

export default function NutritionistApp() {
  const { state } = useApp();
  const Screen = SCREENS[state.activeTab] || Home;

  return (
    <div
      className="relative bg-gray-50 min-h-screen overflow-hidden"
      style={{ maxWidth: '430px', margin: '0 auto', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <div className="overflow-y-auto" style={{ height: '100dvh' }}>
        <Screen />
      </div>
      <Navigation />
    </div>
  );
}
