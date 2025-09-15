# SculptAR Stories

Bring public art to life with AR narratives and community voice.

## Features

- **AR Statue Overlay**: View 3D virtual statues overlaid onto the real-world environment
- **Inline AR Annotations**: Anchor text, audio, or video snippets to specific parts of statues
- **Geo-Anchored Comments**: Leave comments and vote on existing ones, tied to spatial regions
- **Premium AR Tours**: Curated AR experiences and guided tours by experts

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via MiniKit)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your API keys to `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

### Components

- **AppShell**: Main app layout with navigation
- **StatueCard**: Display statue information and stats
- **ARViewer**: Simulated AR experience with annotations
- **AnnotationBubble**: Interactive annotation markers
- **CommentThread**: Comment system with threading
- **PremiumTours**: Premium tour marketplace
- **UserProfile**: User identity display

### Data Models

- **User**: Farcaster identity and wallet integration
- **Statue**: Public art pieces with location data
- **Annotation**: AR content anchored to statue regions
- **Comment**: Community discussions and feedback
- **PremiumTour**: Curated AR experiences

## Farcaster Frame Integration

The app includes Farcaster Frame support for social sharing:

- Frame endpoint: `/api/frame`
- Open Graph images: `/api/og`
- Interactive buttons for discovery and engagement

## Business Model

- **Micro-transactions**: Premium AR tours ($1.99-$2.99)
- **Sponsorship**: Brand-sponsored exhibits
- **Creator Economy**: Revenue sharing for tour creators

## Development

### Design System

The app uses a custom design system with:

- **Colors**: Primary blue, accent red, neutral grays
- **Typography**: Display, H1, Body, Caption styles
- **Spacing**: Consistent 4px grid system
- **Shadows**: Card and lifted variants
- **Animations**: Smooth transitions and micro-interactions

### Mock Data

The app includes comprehensive mock data for development:

- Sample statues (Liberty, Thinker, Charging Bull)
- AR annotations with different media types
- Comment threads with voting
- Premium tours with ratings and reviews

## Deployment

The app is optimized for deployment on Vercel or similar platforms:

1. Connect your repository
2. Set environment variables
3. Deploy with automatic builds

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
