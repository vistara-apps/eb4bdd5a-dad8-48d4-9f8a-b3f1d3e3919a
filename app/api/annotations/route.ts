import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../lib/dataStore';
import type { Annotation } from '../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statueId = searchParams.get('statueId');
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const limitNum = limit ? parseInt(limit) : 50;
    const offsetNum = offset ? parseInt(offset) : 0;

    if (statueId) {
      const annotations = await dataStore.getAnnotationsByStatue(statueId, limitNum, offsetNum);
      return NextResponse.json({ annotations });
    }

    if (userId) {
      const annotations = await dataStore.getAnnotationsByUser(userId, limitNum, offsetNum);
      return NextResponse.json({ annotations });
    }

    const annotations = await dataStore.getAnnotations(limitNum, offsetNum);
    return NextResponse.json({ annotations });
  } catch (error) {
    console.error('Error fetching annotations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['statueId', 'userId', 'type', 'region'];
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

    // Validate user exists
    const user = await dataStore.getUserById(body.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate type
    const validTypes = ['text', 'audio', 'video', 'image'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json({ error: 'Invalid annotation type' }, { status: 400 });
    }

    // Validate region
    if (!body.region.x || !body.region.y || !body.region.width || !body.region.height) {
      return NextResponse.json({ error: 'Invalid region format' }, { status: 400 });
    }

    const annotationData = {
      annotationId: body.annotationId || `annotation-${Date.now()}`,
      statueId: body.statueId,
      userId: body.userId,
      type: body.type,
      content: body.content,
      contentUrl: body.contentUrl,
      region: {
        x: body.region.x,
        y: body.region.y,
        width: body.region.width,
        height: body.region.height,
      },
      author: body.author || {
        username: user.username,
        avatar: user.avatar,
      },
    };

    const newAnnotation = await dataStore.createAnnotation(annotationData);

    return NextResponse.json({ annotation: newAnnotation }, { status: 201 });
  } catch (error) {
    console.error('Error creating annotation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

