import { NextRequest, NextResponse } from 'next/server';
import { marineDataService } from '@/lib/services/marine-data.service';
import type { Coordinates } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Missing required parameters: lat, lng' },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    const location: Coordinates = { lat: latitude, lng: longitude };
    const forecast = await marineDataService.getCompleteForecast(location);

    return NextResponse.json({
      location,
      forecast,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Forecast API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forecast data' },
      { status: 500 }
    );
  }
}
