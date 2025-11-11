import Map from './components/Map';

export default function HomePage() {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="h-full flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl font-bold text-ocean-800 mb-4">
              Famous Surf Spots
            </h2>
            <div className="space-y-3">
              <SpotCard
                name="Uluwatu"
                location="Bali, Indonesia"
                rating={5}
                description="World-class left reef break"
              />
              <SpotCard
                name="G-Land"
                location="East Java, Indonesia"
                rating={5}
                description="Epic left barrel"
              />
              <SpotCard
                name="Cloud 9"
                location="Siargao, Philippines"
                rating={5}
                description="Famous reef break"
              />
              <SpotCard
                name="Mentawai Islands"
                location="Indonesia"
                rating={5}
                description="Multiple world-class breaks"
              />
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                🌊 How It Works
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• View real-time swell forecasts</li>
                <li>• Track wind conditions</li>
                <li>• Discover hidden surf spots</li>
                <li>• Check buoy data</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">
                🚧 Work in Progress
              </h3>
              <p className="text-sm text-yellow-800">
                This is an early version. More features coming soon!
              </p>
            </div>
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
          <Map className="h-full w-full" />

          {/* Map controls overlay */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span>Surf Spot</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpotCard({
  name,
  location,
  rating,
  description,
}: {
  name: string;
  location: string;
  rating: number;
  description: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:border-ocean-400 transition cursor-pointer">
      <h3 className="font-semibold text-ocean-800">{name}</h3>
      <p className="text-xs text-gray-500">{location}</p>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <div className="mt-2 text-yellow-500 text-sm">
        {'⭐'.repeat(rating)}
      </div>
    </div>
  );
}
