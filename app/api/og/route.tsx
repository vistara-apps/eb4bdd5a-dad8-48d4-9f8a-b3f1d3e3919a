import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view') || 'home';

  // Generate SVG based on view
  let svg = '';
  
  if (view === 'statues') {
    svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:hsl(240 80% 50%);stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:hsl(10 80% 55%);stop-opacity:0.1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="hsl(220 15% 95%)" />
        <rect width="1200" height="630" fill="url(#bg)" />
        <text x="600" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="hsl(220 15% 10%)">AR Statues Near You</text>
        <text x="600" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="hsl(220 15% 40%)">Liberty • The Thinker • Charging Bull</text>
        <circle cx="400" cy="400" r="60" fill="hsl(240 80% 50%)" opacity="0.8" />
        <circle cx="600" cy="420" r="50" fill="hsl(10 80% 55%)" opacity="0.8" />
        <circle cx="800" cy="380" r="55" fill="hsl(240 80% 50%)" opacity="0.6" />
        <text x="600" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="hsl(220 15% 40%)">Tap to explore in AR</text>
      </svg>
    `;
  } else if (view === 'tours') {
    svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:hsl(240 80% 50%);stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:hsl(10 80% 55%);stop-opacity:0.1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="hsl(220 15% 95%)" />
        <rect width="1200" height="630" fill="url(#bg)" />
        <text x="600" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="hsl(220 15% 10%)">Premium AR Tours</text>
        <text x="600" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="hsl(220 15% 40%)">Expert-curated experiences</text>
        <rect x="200" y="300" width="300" height="120" rx="12" fill="hsl(220 15% 100%)" stroke="hsl(220 15% 85%)" stroke-width="2" />
        <text x="350" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="hsl(220 15% 10%)">Revolutionary Tour</text>
        <text x="350" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="hsl(220 15% 40%)">45 min • $1.99</text>
        <text x="350" y="395" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="hsl(220 15% 40%)">⭐ 4.8 (124 reviews)</text>
        <rect x="700" y="300" width="300" height="120" rx="12" fill="hsl(220 15% 100%)" stroke="hsl(220 15% 85%)" stroke-width="2" />
        <text x="850" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="hsl(220 15% 10%)">Philosophy Tour</text>
        <text x="850" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="hsl(220 15% 40%)">60 min • $2.99</text>
        <text x="850" y="395" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="hsl(220 15% 40%)">⭐ 4.6 (89 reviews)</text>
      </svg>
    `;
  } else {
    svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:hsl(240 80% 50%);stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:hsl(10 80% 55%);stop-opacity:0.1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="hsl(220 15% 95%)" />
        <rect width="1200" height="630" fill="url(#bg)" />
        <text x="600" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="hsl(220 15% 10%)">SculptAR Stories</text>
        <text x="600" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="hsl(220 15% 40%)">Bring public art to life with AR</text>
        <text x="600" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="hsl(220 15% 40%)">narratives and community voice</text>
        <circle cx="500" cy="450" r="40" fill="hsl(240 80% 50%)" opacity="0.8" />
        <circle cx="600" cy="470" r="35" fill="hsl(10 80% 55%)" opacity="0.8" />
        <circle cx="700" cy="440" r="45" fill="hsl(240 80% 50%)" opacity="0.6" />
        <text x="600" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="hsl(220 15% 40%)">Discover • Annotate • Share</text>
      </svg>
    `;
  }

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
