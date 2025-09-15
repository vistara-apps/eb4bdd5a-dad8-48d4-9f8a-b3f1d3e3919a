import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../lib/dataStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statueId = searchParams.get('statueId');

    if (statueId) {
      const sponsors = await dataStore.getSponsorsByStatue(statueId);
      return NextResponse.json({ sponsors });
    }

    const sponsors = await dataStore.getAllSponsors();
    return NextResponse.json({ sponsors });
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['statueId', 'brandName', 'campaignUrl', 'startDate', 'endDate'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate statue exists
    const statue = await dataStore.getStatueById(body.statueId);
    if (!statue) {
      return NextResponse.json({ error: 'Statue not found' }, { status: 404 });
    }

    // Validate date format
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    if (endDate <= startDate) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    const sponsorData = {
      sponsorId: `sponsor-${Date.now()}`,
      statueId: body.statueId,
      brandName: body.brandName,
      campaignUrl: body.campaignUrl,
      arContentUrl: body.arContentUrl || '',
      startDate: body.startDate,
      endDate: body.endDate,
    };

    const newSponsor = await dataStore.createSponsor(sponsorData);

    return NextResponse.json({
      sponsor: newSponsor,
      message: 'Sponsor exhibit created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating sponsor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

