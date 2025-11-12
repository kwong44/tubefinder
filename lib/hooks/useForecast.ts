import { useQuery } from '@tanstack/react-query';
import type { Coordinates, ForecastData } from '@/lib/types';

interface ForecastResponse {
  location: Coordinates;
  forecast: ForecastData[];
  generatedAt: string;
}

/**
 * Hook to fetch forecast data for a specific location
 */
export function useForecast(location: Coordinates, enabled = true) {
  return useQuery<ForecastResponse>({
    queryKey: ['forecast', location.lat, location.lng],
    queryFn: async () => {
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lng: location.lng.toString(),
      });

      const response = await fetch(`/api/forecast?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch forecast: ${response.statusText}`);
      }

      return response.json();
    },
    enabled,
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * Get current conditions from forecast data (first entry)
 */
export function getCurrentConditions(forecast?: ForecastData[]) {
  if (!forecast || forecast.length === 0) return null;
  return forecast[0];
}

/**
 * Get next 24 hours of forecast data
 */
export function getNext24Hours(forecast?: ForecastData[]) {
  if (!forecast) return [];
  return forecast.slice(0, 24);
}

/**
 * Get next 7 days of forecast data (one per day at noon)
 */
export function getWeekForecast(forecast?: ForecastData[]) {
  if (!forecast) return [];

  // Get one forecast per day, preferably around noon
  const dailyForecasts: ForecastData[] = [];
  const seenDays = new Set<string>();

  for (const item of forecast) {
    const date = new Date(item.timestamp);
    const dayKey = date.toISOString().split('T')[0];

    if (!seenDays.has(dayKey)) {
      const hour = date.getHours();
      // Prefer forecasts between 10am-2pm
      if (hour >= 10 && hour <= 14) {
        dailyForecasts.push(item);
        seenDays.add(dayKey);
      }
    }

    if (dailyForecasts.length >= 7) break;
  }

  return dailyForecasts;
}
