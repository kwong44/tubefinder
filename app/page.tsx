'use client';

import Map from './components/Map';
import SpotList from './components/SpotList';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import SortControls from './components/SortControls';
import DateTimePicker from './components/DateTimePicker';
import { FAMOUS_SPOTS } from '@/lib/utils/constants';
import { useFilterStore } from '@/lib/stores/filter-store';
import { useCustomSpots } from '@/lib/hooks/useCustomSpots';
import { Menu, X } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export default function HomePage() {
  const { isSidebarOpen, toggleSidebar, setSidebarOpen } = useFilterStore();
  const { customSpotsAsSpots } = useCustomSpots();

  // Merge default famous spots with custom user spots
  const allSpots = useMemo(() => {
    return [...FAMOUS_SPOTS, ...customSpotsAsSpots];
  }, [customSpotsAsSpots]);

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  return (
    <div className="h-[calc(100vh-8rem)] relative">
      <div className="h-full flex">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-20 left-4 z-[1001] bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5 text-gray-700" />
          ) : (
            <Menu className="h-5 w-5 text-gray-700" />
          )}
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-[1000]
            w-80 bg-white border-r overflow-y-auto
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            mt-[4rem] md:mt-0
          `}
        >
          <div className="p-4">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-ocean-800 mb-2">
                🌊 Surf Spots
              </h2>
              <p className="text-xs text-gray-600">
                Real-time conditions from Open-Meteo
              </p>
            </div>

            {/* Date/Time Picker */}
            <div className="mb-4">
              <DateTimePicker />
            </div>

            {/* Search */}
            <div className="mb-3">
              <SearchBar />
            </div>

            {/* Sort Controls */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">
                Sort by
              </span>
              <SortControls />
            </div>

            {/* Filters */}
            <div className="mb-4">
              <FilterPanel />
            </div>

            {/* Spot List */}
            <SpotList spots={allSpots} />

            {/* Info Boxes */}
            <div className="mt-6 space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 text-sm mb-1">
                  🌊 Features
                </h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Live swell forecasts</li>
                  <li>• 24h/7d timeline charts</li>
                  <li>• Trend indicators</li>
                  <li>• Direction arrows</li>
                </ul>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 text-sm mb-1">
                  💡 Tip
                </h3>
                <p className="text-xs text-green-800">
                  Click any marker for detailed forecast with 24h/7d charts!
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[999] mt-[4rem]"
            onClick={toggleSidebar}
          />
        )}

        {/* Map */}
        <div className="flex-1 relative">
          <Map spots={allSpots} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
