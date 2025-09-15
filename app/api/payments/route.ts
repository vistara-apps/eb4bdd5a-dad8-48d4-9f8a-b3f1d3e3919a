import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['tourId', 'userId', 'amount'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const { tourId, userId, amount } = body;

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // In a real implementation, this would:
    // 1. Verify the tour exists and get its price
    // 2. Check if user has sufficient balance
    // 3. Process the payment on Base network
    // 4. Update user's purchased tours
    // 5. Grant access to premium content

    // For now, simulate a successful payment
    const paymentResult = {
      paymentId: `payment-${Date.now()}`,
      tourId,
      userId,
      amount,
      status: 'completed',
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      payment: paymentResult,
      message: 'Payment processed successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // In a real implementation, this would fetch user's payment history
    // For now, return empty array
    const payments = [];

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

