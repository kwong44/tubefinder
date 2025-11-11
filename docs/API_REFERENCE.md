# API Reference Guide

This document provides detailed information about the free APIs we'll use for Tube Finder.

## 1. Open-Meteo Marine Weather API

### Overview
- **URL**: https://open-meteo.com/en/docs/marine-weather-api
- **Cost**: Free, no API key required
- **Rate Limit**: 10,000 requests/day
- **Coverage**: Global
- **Forecast Length**: 7 days, hourly data

### Endpoint
```
GET https://marine-api.open-meteo.com/v1/marine
```

### Parameters
| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| latitude | Yes | Latitude coordinate | -8.7832 |
| longitude | Yes | Longitude coordinate | 115.1776 |
| hourly | Yes | Weather variables to fetch | wave_height,wave_direction,wave_period |
| timezone | No | Timezone for timestamps | Asia/Jakarta |

### Available Marine Variables
- `wave_height` - Significant wave height (m)
- `wave_direction` - Wave direction (degrees)
- `wave_period` - Wave period (s)
- `wind_wave_height` - Wind wave height (m)
- `wind_wave_direction` - Wind wave direction (degrees)
- `wind_wave_period` - Wind wave period (s)
- `wind_wave_peak_period` - Wind wave peak period (s)
- `swell_wave_height` - Swell wave height (m)
- `swell_wave_direction` - Swell wave direction (degrees)
- `swell_wave_period` - Swell wave period (s)
- `swell_wave_peak_period` - Swell wave peak period (s)
- `ocean_current_velocity` - Ocean current velocity (m/s)
- `ocean_current_direction` - Ocean current direction (degrees)

### Example Request
```bash
curl "https://marine-api.open-meteo.com/v1/marine?latitude=-8.7832&longitude=115.1776&hourly=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period&timezone=Asia/Jakarta"
```

### Example Response
```json
{
  "latitude": -8.75,
  "longitude": 115.25,
  "hourly_units": {
    "time": "iso8601",
    "wave_height": "m",
    "wave_direction": "°",
    "wave_period": "s",
    "swell_wave_height": "m",
    "swell_wave_direction": "°",
    "swell_wave_period": "s"
  },
  "hourly": {
    "time": [
      "2025-11-11T00:00",
      "2025-11-11T01:00",
      ...
    ],
    "wave_height": [1.8, 1.9, 2.0, ...],
    "wave_direction": [195, 198, 200, ...],
    "wave_period": [12.5, 12.8, 13.0, ...],
    "swell_wave_height": [1.5, 1.6, 1.7, ...],
    "swell_wave_direction": [200, 202, 205, ...],
    "swell_wave_period": [14.0, 14.2, 14.5, ...]
  }
}
```

### TypeScript Interface
```typescript
interface OpenMeteoMarineResponse {
  latitude: number;
  longitude: number;
  hourly_units: {
    time: string;
    wave_height: string;
    wave_direction: string;
    wave_period: string;
    swell_wave_height: string;
    swell_wave_direction: string;
    swell_wave_period: string;
  };
  hourly: {
    time: string[];
    wave_height: number[];
    wave_direction: number[];
    wave_period: number[];
    swell_wave_height: number[];
    swell_wave_direction: number[];
    swell_wave_period: number[];
  };
}
```

## 2. NOAA National Data Buoy Center (NDBC)

### Overview
- **URL**: https://www.ndbc.noaa.gov/
- **Cost**: Free, no authentication required
- **Rate Limit**: None specified (be respectful)
- **Coverage**: Pacific, Atlantic, Caribbean (limited SE Asia)
- **Update Frequency**: Hourly (some 10-minute intervals)

### Realtime Data Endpoint
```
https://www.ndbc.noaa.gov/data/realtime2/{STATION_ID}.txt
```

### Finding Buoys
- **Station Map**: https://www.ndbc.noaa.gov/
- **XML Station List**: https://www.ndbc.noaa.gov/activestations.xml

### Philippines/Indonesia Area Buoys (Examples)
| Station ID | Location | Latitude | Longitude |
|------------|----------|----------|-----------|
| 52402 | East China Sea | 30.08°N | 127.11°E |
| Multiple DART buoys | Pacific Tsunami Network | Varies | Varies |

*Note: Limited NOAA buoys directly in SE Asia. Most coverage is in North Pacific.*

### Data Format
The data is returned as space-delimited text:
```
#YY  MM DD hh mm WDIR WSPD GST  WVHT   DPD   APD MWD   PRES  ATMP  WTMP  DEWP  VIS PTDY  TIDE
#yr  mo dy hr mn degT m/s  m/s     m   sec   sec degT   hPa  degC  degC  degC  nmi  hPa    ft
2025 11 11 00 00  250  8.5 10.2  2.10  10.0   8.5 240 1013.5  25.2  26.8  23.1  9.9 -0.3  99.0
2025 11 11 01 00  248  8.2  9.8  2.05   9.8   8.3 238 1013.8  25.1  26.9  23.0  9.9 +0.3  99.0
```

### Data Fields
| Field | Description | Unit |
|-------|-------------|------|
| WDIR | Wind direction | degrees (meteorological) |
| WSPD | Wind speed | m/s |
| GST | Gust speed | m/s |
| WVHT | Significant wave height | meters |
| DPD | Dominant wave period | seconds |
| APD | Average wave period | seconds |
| MWD | Mean wave direction | degrees |
| PRES | Sea level pressure | hPa |
| ATMP | Air temperature | °C |
| WTMP | Sea surface temperature | °C |

### Example Parser (TypeScript)
```typescript
interface BuoyData {
  timestamp: Date;
  windDirection: number;
  windSpeed: number;
  gustSpeed: number;
  waveHeight: number;
  dominantPeriod: number;
  waveDirection: number;
  pressure: number;
  airTemp: number;
  waterTemp: number;
}

async function fetchBuoyData(stationId: string): Promise<BuoyData[]> {
  const url = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`;
  const response = await fetch(url);
  const text = await response.text();

  const lines = text.split('\n').slice(2); // Skip header rows

  return lines.map(line => {
    const parts = line.trim().split(/\s+/);
    return {
      timestamp: new Date(
        `${parts[0]}-${parts[1]}-${parts[2]}T${parts[3]}:${parts[4]}:00Z`
      ),
      windDirection: parseFloat(parts[5]),
      windSpeed: parseFloat(parts[6]),
      gustSpeed: parseFloat(parts[7]),
      waveHeight: parseFloat(parts[8]),
      dominantPeriod: parseFloat(parts[9]),
      waveDirection: parseFloat(parts[11]),
      pressure: parseFloat(parts[12]),
      airTemp: parseFloat(parts[13]),
      waterTemp: parseFloat(parts[14]),
    };
  }).filter(d => !isNaN(d.waveHeight));
}
```

## 3. Open-Meteo Weather API (Wind Data)

### Overview
For additional wind data at coastal locations.

### Endpoint
```
GET https://api.open-meteo.com/v1/forecast
```

### Parameters for Surfing
```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=-8.7832&longitude=115.1776&hourly=windspeed_10m,winddirection_10m,windgusts_10m&timezone=Asia/Jakarta"
```

### Response
```json
{
  "hourly": {
    "time": ["2025-11-11T00:00", ...],
    "windspeed_10m": [8.5, 9.2, 10.1, ...],
    "winddirection_10m": [220, 225, 230, ...],
    "windgusts_10m": [12.5, 13.0, 14.2, ...]
  }
}
```

## 4. Alternative/Supplementary Sources

### Stormglass.io (Optional - Limited Free Tier)
- **Free Tier**: 50 requests/day
- **Paid Plans**: From $50/month
- **Data**: Aggregated from multiple sources
- Use for development/testing, consider upgrade for production

### Windy API
- **Cost**: Free for non-commercial
- **Data**: Wind, waves, weather
- Limited to personal/educational use

## API Integration Strategy

### 1. Data Aggregation Service
Create a unified service that fetches from multiple sources:

```typescript
// lib/services/marine-data.service.ts
class MarineDataService {
  async getForecast(lat: number, lng: number) {
    // Fetch from Open-Meteo
    const marineForecast = await this.fetchOpenMeteo(lat, lng);

    // Find nearest buoy
    const nearestBuoy = await this.findNearestBuoy(lat, lng);

    // Fetch buoy data if available
    const buoyData = nearestBuoy
      ? await this.fetchBuoyData(nearestBuoy.id)
      : null;

    // Merge and return
    return this.mergeForecastData(marineForecast, buoyData);
  }
}
```

### 2. Caching Strategy
```typescript
const CACHE_DURATIONS = {
  forecast: 6 * 60 * 60, // 6 hours
  buoy: 60 * 60,         // 1 hour
  stations: 24 * 60 * 60, // 24 hours (rarely changes)
};
```

### 3. Error Handling
```typescript
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Rate Limiting Implementation

### Track API Usage
```typescript
// lib/rate-limiter.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function checkRateLimit(
  apiName: string,
  limit: number,
  window: number
): Promise<boolean> {
  const key = `ratelimit:${apiName}:${Math.floor(Date.now() / window)}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  return current <= limit;
}
```

### Usage
```typescript
// Before API call
const canProceed = await checkRateLimit('open-meteo', 10000, 86400);
if (!canProceed) {
  throw new Error('Rate limit exceeded');
}
```

## Testing Coordinates

### Good Test Locations (Indonesia/Philippines)

| Location | Latitude | Longitude | Known For |
|----------|----------|-----------|-----------|
| Uluwatu, Bali | -8.8292 | 115.0853 | Reef break, SW swell |
| G-Land, Java | -8.7832 | 114.4287 | Left barrel, S swell |
| Siargao, Philippines | 9.8503 | 126.0450 | Cloud 9, E swell |
| Mentawai Islands | -2.0833 | 99.8667 | World-class, SW swell |
| Nias, Indonesia | 1.0833 | 97.5833 | Right point, SW swell |

## API Response Time Benchmarks

| API | Avg Response Time | Notes |
|-----|-------------------|-------|
| Open-Meteo Marine | 200-400ms | Fast, reliable |
| Open-Meteo Weather | 150-300ms | Very fast |
| NOAA NDBC | 300-800ms | Variable, sometimes slow |

## Best Practices

1. **Cache Aggressively**: Forecast data doesn't change that often
2. **Batch Requests**: Fetch multiple spots in parallel
3. **Handle Failures Gracefully**: Always have fallback data
4. **Monitor Usage**: Track API calls to stay within limits
5. **Respect Rate Limits**: Implement exponential backoff
6. **User Agent**: Identify your app in requests

```typescript
const headers = {
  'User-Agent': 'TubeFinder/1.0 (github.com/kwong44/tubefinder)',
};
```

## Future API Considerations

If the app grows, consider:
- **Stormglass.io Premium** ($50-200/month): More detailed data, tides
- **Surfline API** (Enterprise): Professional surf forecasts
- **WorldWeatherOnline Marine API**: Paid tier for more requests
- **Custom Buoy Network**: Deploy own IoT sensors in remote locations

## Resources

- Open-Meteo Docs: https://open-meteo.com/en/docs
- NOAA NDBC Guide: https://www.ndbc.noaa.gov/docs/ndbc_web_data_guide.pdf
- Stormglass Docs: https://docs.stormglass.io/
