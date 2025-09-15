import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../lib/dataStore';
import type { Comment } from '../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statueId = searchParams.get('statueId');
    const userId = searchParams.get('userId');
    const parentId = searchParams.get('parentId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const limitNum = limit ? parseInt(limit) : 50;
    const offsetNum = offset ? parseInt(offset) : 0;

    if (statueId) {
      const comments = await dataStore.getCommentsByStatue(statueId, limitNum, offsetNum);
      return NextResponse.json({ comments });
    }

    if (userId) {
      const comments = await dataStore.getCommentsByUser(userId, limitNum, offsetNum);
      return NextResponse.json({ comments });
    }

    if (parentId) {
      const comments = await dataStore.getRepliesByComment(parentId, limitNum, offsetNum);
      return NextResponse.json({ comments });
    }

    const comments = await dataStore.getComments(limitNum, offsetNum);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['statueId', 'userId', 'content'];
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

    // Validate parent comment if provided
    if (body.parentId) {
      const parentComment = await dataStore.getCommentById(body.parentId);
      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }
    }

    const commentData = {
      commentId: body.commentId || `comment-${Date.now()}`,
      statueId: body.statueId,
      userId: body.userId,
      parentId: body.parentId,
      content: body.content,
      author: body.author || {
        username: user.username,
        avatar: user.avatar,
      },
    };

    const newComment = await dataStore.createComment(commentData);

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

