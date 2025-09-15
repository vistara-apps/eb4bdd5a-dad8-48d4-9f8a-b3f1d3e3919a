import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../lib/dataStore';
import type { PremiumTour } from '../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    const tours = await dataStore.getTours();
    return NextResponse.json({ tours });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'duration', 'statueIds', 'author'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate price
    if (typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    // Validate statueIds array
    if (!Array.isArray(body.statueIds) || body.statueIds.length === 0) {
      return NextResponse.json({ error: 'statueIds must be a non-empty array' }, { status: 400 });
    }

    // Validate that all statueIds exist
    for (const statueId of body.statueIds) {
      const statue = await dataStore.getStatueById(statueId);
      if (!statue) {
        return NextResponse.json({ error: `Statue with ID ${statueId} not found` }, { status: 404 });
      }
    }

    // Validate author structure
    if (!body.author.name || typeof body.author.verified !== 'boolean') {
      return NextResponse.json({ error: 'Invalid author format' }, { status: 400 });
    }

    const tourData = {
      title: body.title,
      description: body.description,
      price: body.price,
      duration: body.duration,
      thumbnailUrl: body.thumbnailUrl || '',
      statueIds: body.statueIds,
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      author: {
        name: body.author.name,
        avatar: body.author.avatar,
        verified: body.author.verified,
      },
    };

    const newTour = await dataStore.createTour(tourData);

    return NextResponse.json({ tour: newTour }, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

