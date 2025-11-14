// NOAA buoy and tide data API integration

import type { BuoyObservation, TideDataPoint, TidePrediction, TideSummary } from '@/lib/types/observations';

/**
 * Fetch latest buoy observations from NOAA NDBC
 * Note: NOAA NDBC API is limited and may have CORS issues in browser
 * In production, this should go through a backend proxy
 */
export async function fetchBuoyObservation(stationId: string): Promise<BuoyObservation | null> {
  try {
    // NOAA NDBC real-time data endpoint (text format)
    // In production, proxy through your API route to avoid CORS
    const url = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`;

    const response = await fetch(url, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      console.warn(`Buoy ${stationId} data not available`);
      return null;
    }

    const text = await response.text();
    const lines = text.split('\n').filter((line) => line.trim());

    if (lines.length < 3) return null;

    // Parse the most recent observation (line 2, after headers)
    const headers = lines[0].split(/\s+/);
    const units = lines[1].split(/\s+/);
    const data = lines[2].split(/\s+/);

    const observation: BuoyObservation = {
      stationId,
      timestamp: parseNDBCTimestamp(data.slice(0, 5)),
    };

    // Map data fields (indices vary by station type)
    headers.forEach((header, index) => {
      const value = parseFloat(data[index]);
      if (isNaN(value) || value === 99 || value === 999 || value === 9999) return;

      switch (header) {
        case 'WVHT': // Significant wave height (m)
          observation.waveHeight = value;
          break;
        case 'DPD': // Dominant wave period (sec)
          observation.dominantWavePeriod = value;
          break;
        case 'APD': // Average wave period (sec)
          observation.averageWavePeriod = value;
          break;
        case 'MWD': // Wave direction (degrees)
          observation.waveDirection = value;
          break;
        case 'WSPD': // Wind speed (m/s)
          observation.windSpeed = value;
          break;
        case 'WDIR': // Wind direction (degrees)
          observation.windDirection = value;
          break;
        case 'GST': // Wind gust (m/s)
          observation.windGust = value;
          break;
        case 'PRES': // Pressure (hPa)
          observation.pressure = value;
          break;
        case 'ATMP': // Air temperature (Celsius)
          observation.airTemperature = value;
          break;
        case 'WTMP': // Water temperature (Celsius)
          observation.waterTemperature = value;
          break;
      }
    });

    return observation;
  } catch (error) {
    console.error(`Failed to fetch buoy ${stationId}:`, error);
    return null;
  }
}

/**
 * Parse NOAA NDBC timestamp format (YY MM DD hh mm)
 */
function parseNDBCTimestamp(parts: string[]): Date {
  const [year, month, day, hour, minute] = parts.map(Number);
  // NDBC uses 2-digit year, add 2000
  return new Date(Date.UTC(year + 2000, month - 1, day, hour, minute));
}

/**
 * Fetch tide predictions from NOAA CO-OPS API
 */
export async function fetchTidePredictions(
  stationId: string,
  beginDate: Date,
  endDate: Date
): Promise<TideSummary | null> {
  try {
    // NOAA CO-OPS API for tide predictions
    const begin = formatNOAADate(beginDate);
    const end = formatNOAADate(endDate);

    const url = new URL('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter');
    url.searchParams.set('station', stationId);
    url.searchParams.set('product', 'predictions');
    url.searchParams.set('datum', 'MLLW');
    url.searchParams.set('time_zone', 'gmt');
    url.searchParams.set('units', 'metric');
    url.searchParams.set('interval', 'hilo'); // High/Low tides only
    url.searchParams.set('format', 'json');
    url.searchParams.set('begin_date', begin);
    url.searchParams.set('end_date', end);

    const response = await fetch(url.toString(), {
      cache: 'default',
    });

    if (!response.ok) {
      console.warn(`Tide station ${stationId} not available`);
      return null;
    }

    const json = await response.json();

    if (!json.predictions || json.predictions.length === 0) {
      return null;
    }

    const predictions: TidePrediction[] = json.predictions.map((p: any) => ({
      stationId,
      timestamp: new Date(p.t),
      height: parseFloat(p.v),
      type: p.type as 'H' | 'L',
    }));

    // Fetch hourly data for charting
    const hourlyData = await fetchHourlyTideData(stationId, beginDate, endDate);

    const now = new Date();
    const nextHighTide = predictions.find((p) => p.type === 'H' && p.timestamp > now);
    const nextLowTide = predictions.find((p) => p.type === 'L' && p.timestamp > now);

    return {
      stationId,
      stationName: json.metadata?.name || stationId,
      predictions,
      hourlyData: hourlyData || [],
      nextHighTide,
      nextLowTide,
    };
  } catch (error) {
    console.error(`Failed to fetch tide predictions for ${stationId}:`, error);
    return null;
  }
}

/**
 * Fetch hourly tide height data for charting
 */
async function fetchHourlyTideData(
  stationId: string,
  beginDate: Date,
  endDate: Date
): Promise<TideDataPoint[] | null> {
  try {
    const begin = formatNOAADate(beginDate);
    const end = formatNOAADate(endDate);

    const url = new URL('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter');
    url.searchParams.set('station', stationId);
    url.searchParams.set('product', 'predictions');
    url.searchParams.set('datum', 'MLLW');
    url.searchParams.set('time_zone', 'gmt');
    url.searchParams.set('units', 'metric');
    url.searchParams.set('interval', 'h'); // Hourly data
    url.searchParams.set('format', 'json');
    url.searchParams.set('begin_date', begin);
    url.searchParams.set('end_date', end);

    const response = await fetch(url.toString());

    if (!response.ok) return null;

    const json = await response.json();

    if (!json.predictions) return null;

    return json.predictions.map((p: any) => ({
      time: new Date(p.t),
      height: parseFloat(p.v),
    }));
  } catch (error) {
    console.error('Failed to fetch hourly tide data:', error);
    return null;
  }
}

/**
 * Format date for NOAA API (YYYYMMDD HH:MM)
 */
function formatNOAADate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');

  return `${year}${month}${day} ${hour}:${minute}`;
}

/**
 * Fallback: Fetch tide data from Open-Meteo Marine API
 * (for locations without NOAA coverage)
 */
export async function fetchOpenMeteoTideData(
  latitude: number,
  longitude: number,
  days: number = 7
): Promise<TideDataPoint[] | null> {
  try {
    const url = new URL('https://marine-api.open-meteo.com/v1/marine');
    url.searchParams.set('latitude', latitude.toString());
    url.searchParams.set('longitude', longitude.toString());
    url.searchParams.set('hourly', 'wave_height'); // Open-Meteo doesn't have tides, using as placeholder
    url.searchParams.set('forecast_days', days.toString());

    const response = await fetch(url.toString());

    if (!response.ok) return null;

    const json = await response.json();

    // Note: Open-Meteo Marine API doesn't include tide data
    // This would need a different tide API or service
    // For now, return null to indicate no tide data available

    return null;
  } catch (error) {
    console.error('Failed to fetch Open-Meteo tide data:', error);
    return null;
  }
}
