import Map from './components/Map';
import SpotCard from './components/SpotCard';
import { FAMOUS_SPOTS } from '@/lib/utils/constants';

export default function HomePage() {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="h-full flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl font-bold text-ocean-800 mb-4">
              🌊 Live Conditions
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Real-time wave and wind data from Open-Meteo
            </p>
            <div className="space-y-3">
              {FAMOUS_SPOTS.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                🌊 How It Works
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• View real-time swell forecasts</li>
                <li>• Track wind conditions</li>
                <li>• Color-coded surf scores</li>
                <li>• Click markers for details</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                ✅ Live Data
              </h3>
              <p className="text-sm text-green-800">
                Displaying live wave forecasts from Open-Meteo API! Click any spot marker on the map for detailed conditions.
              </p>
            </div>
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
          <Map className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
