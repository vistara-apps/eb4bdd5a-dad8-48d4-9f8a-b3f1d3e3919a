import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Handle Farcaster frame interactions
    const { untrustedData } = body;
    const buttonIndex = untrustedData?.buttonIndex;

    // Generate response based on button clicked
    let imageUrl = '/api/og';
    let buttons = ['Explore AR Statues', 'View Premium Tours', 'Share Discovery'];
    
    if (buttonIndex === 1) {
      // Explore AR Statues
      imageUrl = '/api/og?view=statues';
      buttons = ['View Liberty Statue', 'View The Thinker', 'Back to Home'];
    } else if (buttonIndex === 2) {
      // View Premium Tours
      imageUrl = '/api/og?view=tours';
      buttons = ['Revolutionary Tour $1.99', 'Philosophy Tour $2.99', 'Back to Home'];
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:button:1" content="${buttons[0]}" />
          <meta property="fc:frame:button:2" content="${buttons[1]}" />
          <meta property="fc:frame:button:3" content="${buttons[2]}" />
          <meta property="fc:frame:post_url" content="${req.url}" />
        </head>
        <body>
          <h1>SculptAR Stories</h1>
          <p>Bring public art to life with AR narratives and community voice.</p>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="/api/og" />
        <meta property="fc:frame:button:1" content="Explore AR Statues" />
        <meta property="fc:frame:button:2" content="View Premium Tours" />
        <meta property="fc:frame:button:3" content="Share Discovery" />
        <meta property="fc:frame:post_url" content="/api/frame" />
        <title>SculptAR Stories</title>
      </head>
      <body>
        <h1>SculptAR Stories</h1>
        <p>Bring public art to life with AR narratives and community voice.</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
