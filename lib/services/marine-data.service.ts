import type {
  Coordinates,
  ForecastData,
  OpenMeteoMarineResponse,
} from '@/lib/types';
import { API_CONFIG } from '@/lib/utils/constants';

/**
 * Service for fetching marine weather data from Open-Meteo API
 */
class MarineDataService {
  private baseUrl = API_CONFIG.OPEN_METEO_MARINE;

  /**
   * Fetch marine forecast for a specific location
   */
  async getForecast(location: Coordinates): Promise<ForecastData[]> {
    try {
      const params = new URLSearchParams({
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        hourly: [
          'wave_height',
          'wave_direction',
          'wave_period',
          'swell_wave_height',
          'swell_wave_direction',
          'swell_wave_period',
          'wind_wave_height',
          'wind_wave_direction',
          'wind_wave_period',
        ].join(','),
        timezone: 'auto',
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        next: { revalidate: 21600 }, // Cache for 6 hours
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: OpenMeteoMarineResponse = await response.json();
      return this.transformForecastData(data, location);
    } catch (error) {
      console.error('Error fetching marine forecast:', error);
      throw error;
    }
  }

  /**
   * Fetch wind data for a specific location
   */
  async getWindData(location: Coordinates) {
    try {
      const params = new URLSearchParams({
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        hourly: ['windspeed_10m', 'winddirection_10m', 'windgusts_10m'].join(
          ','
        ),
        timezone: 'auto',
      });

      const response = await fetch(
        `${API_CONFIG.OPEN_METEO_WEATHER}?${params.toString()}`,
        {
          next: { revalidate: 21600 }, // Cache for 6 hours
        }
      );

      if (!response.ok) {
        throw new Error(`Wind API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching wind data:', error);
      throw error;
    }
  }

  /**
   * Transform Open-Meteo response to our ForecastData format
   */
  private transformForecastData(
    data: OpenMeteoMarineResponse,
    location: Coordinates
  ): ForecastData[] {
    const { hourly } = data;
    const forecasts: ForecastData[] = [];

    for (let i = 0; i < hourly.time.length; i++) {
      forecasts.push({
        location,
        timestamp: new Date(hourly.time[i]),
        wave: {
          height: hourly.wave_height[i] || 0,
          period: hourly.wave_period[i] || 0,
          direction: hourly.wave_direction[i] || 0,
        },
        swell: hourly.swell_wave_height
          ? {
              height: hourly.swell_wave_height[i] || 0,
              period: hourly.swell_wave_period?.[i] || 0,
              direction: hourly.swell_wave_direction?.[i] || 0,
            }
          : undefined,
        wind: {
          speed: 0, // Will be fetched separately
          direction: 0,
        },
      });
    }

    return forecasts;
  }

  /**
   * Fetch combined forecast and wind data
   */
  async getCompleteForecast(location: Coordinates): Promise<ForecastData[]> {
    try {
      const [marineForecast, windData] = await Promise.all([
        this.getForecast(location),
        this.getWindData(location),
      ]);

      // Merge wind data into forecast
      if (windData.hourly) {
        marineForecast.forEach((forecast, index) => {
          if (index < windData.hourly.time.length) {
            forecast.wind = {
              speed: windData.hourly.windspeed_10m[index] || 0,
              direction: windData.hourly.winddirection_10m[index] || 0,
              gusts: windData.hourly.windgusts_10m?.[index],
            };
          }
        });
      }

      return marineForecast;
    } catch (error) {
      console.error('Error fetching complete forecast:', error);
      throw error;
    }
  }
}

export const marineDataService = new MarineDataService();
