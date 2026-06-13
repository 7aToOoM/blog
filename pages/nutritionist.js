import dynamic from 'next/dynamic';
import Head from 'next/head';

const AppProvider = dynamic(
  () => import('../components/nutritionist/AppContext').then((m) => m.AppProvider),
  { ssr: false }
);

const NutritionistApp = dynamic(
  () => import('../components/nutritionist/NutritionistApp'),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-3xl">🥗</span>
        </div>
        <p className="text-gray-500 text-sm font-medium">Loading your nutritionist...</p>
      </div>
    </div>
  )}
);

export default function NutritionistPage() {
  return (
    <>
      <Head>
        <title>My Favourite Nutritionist</title>
        <meta name="description" content="Your personal AI-powered nutrition and fitness tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <AppProvider>
          <NutritionistApp />
        </AppProvider>
      </div>
    </>
  );
}
