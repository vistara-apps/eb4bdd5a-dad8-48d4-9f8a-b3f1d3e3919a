import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../lib/dataStore';
import type { User } from '../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farcasterId = searchParams.get('farcasterId');

    if (farcasterId) {
      const user = await dataStore.getUserByFarcasterId(farcasterId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ user });
    }

    const users = await dataStore.getUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['username'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Check if user with this farcasterId already exists
    if (body.farcasterId) {
      const existingUser = await dataStore.getUserByFarcasterId(body.farcasterId);
      if (existingUser) {
        return NextResponse.json({ error: 'User with this Farcaster ID already exists' }, { status: 409 });
      }
    }

    const userData = {
      userId: body.userId || `user-${Date.now()}`,
      farcasterId: body.farcasterId,
      walletAddress: body.walletAddress,
      username: body.username,
      avatar: body.avatar,
    };

    const newUser = await dataStore.createUser(userData);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

