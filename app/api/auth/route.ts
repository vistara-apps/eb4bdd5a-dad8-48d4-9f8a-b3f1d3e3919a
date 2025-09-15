import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../lib/dataStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.farcasterId) {
      return NextResponse.json({ error: 'Farcaster ID is required' }, { status: 400 });
    }

    const { farcasterId, username, walletAddress } = body;

    // Check if user already exists
    let user = await dataStore.getUserByFarcasterId(farcasterId);

    if (user) {
      // Update existing user
      user = await dataStore.updateUser(user.userId, {
        username: username || user.username,
        walletAddress: walletAddress || user.walletAddress,
      });
    } else {
      // Create new user
      user = await dataStore.createUser({
        userId: `user-${Date.now()}`,
        farcasterId,
        username: username || `User${Date.now()}`,
        walletAddress,
      });
    }

    return NextResponse.json({
      success: true,
      user,
      message: user ? 'User authenticated successfully' : 'User created successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farcasterId = searchParams.get('farcasterId');

    if (!farcasterId) {
      return NextResponse.json({ error: 'Farcaster ID is required' }, { status: 400 });
    }

    const user = await dataStore.getUserByFarcasterId(farcasterId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

