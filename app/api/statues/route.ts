import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../lib/dataStore';
import type { Statue } from '../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const radius = searchParams.get('radius');

    if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      const searchRadius = radius ? parseFloat(radius) : 10;

      if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
        return NextResponse.json({ error: 'Invalid coordinates or radius' }, { status: 400 });
      }

      const statues = await dataStore.getNearbyStatues(latitude, longitude, searchRadius);
      return NextResponse.json({ statues });
    }

    const statues = await dataStore.getStatues();
    return NextResponse.json({ statues });
  } catch (error) {
    console.error('Error fetching statues:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'location'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate location
    if (!body.location.lat || !body.location.lon) {
      return NextResponse.json({ error: 'Invalid location format' }, { status: 400 });
    }

    const statueData = {
      statueId: body.statueId || `statue-${Date.now()}`,
      name: body.name,
      location: {
        lat: body.location.lat,
        lon: body.location.lon,
      },
      description: body.description || '',
      arModelUrl: body.arModelUrl,
      thumbnailUrl: body.thumbnailUrl,
    };

    const newStatue = await dataStore.createStatue(statueData);

    return NextResponse.json({ statue: newStatue }, { status: 201 });
  } catch (error) {
    console.error('Error creating statue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

