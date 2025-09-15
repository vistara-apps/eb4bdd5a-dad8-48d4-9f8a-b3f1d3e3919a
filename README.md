# SculptAR Stories

Bring public art to life with AR narratives and community voice.

## Overview

SculptAR Stories is a Next.js Base Mini App that augments public statues with AR content, stories, and user-generated comments. Users can explore public art through augmented reality, add their own annotations, and engage with a community-driven platform.

## Features

### Core Features
- **AR Statue Overlay**: View 3D virtual statues overlaid onto real-world environments
- **Inline AR Annotations**: Anchor text, audio, or video snippets to specific parts of statues
- **Geo-Anchored Comments & Votes**: Leave comments and upvote/downvote existing comments tied to spatial regions
- **Premium AR Tours**: Curated AR experiences created by artists, historians, or the platform

### Business Model
- **Micro-transactions**: Purchase premium AR tours ($1.99) or unlock exclusive content
- **Sponsorship**: Brands can sponsor exhibits for a flat fee

## Technical Architecture

### Tech Stack
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (in-memory data store)
- **Blockchain**: Base network integration via MiniKit
- **AR**: Web-based AR capabilities (OpenCV.js, Three.js)
- **Storage**: Cloud storage for media assets (IPFS, Arweave, or traditional)

### Data Model

#### User
```typescript
{
  userId: string;
  farcasterId?: string;
  walletAddress?: string;
  username: string;
  avatar?: string;
  createdAt: string;
}
```

#### Statue
```typescript
{
  statueId: string;
  name: string;
  location: { lat: number; lon: number };
  description: string;
  arModelUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
}
```

#### Annotation
```typescript
{
  annotationId: string;
  statueId: string;
  userId: string;
  type: 'text' | 'audio' | 'video' | 'image';
  contentUrl?: string;
  region: { x: number; y: number; width: number; height: number };
  createdAt: string;
  votes: number;
  author: { username: string; avatar?: string };
}
```

#### Comment
```typescript
{
  commentId: string;
  statueId: string;
  userId: string;
  parentId?: string; // For threaded replies
  content: string;
  createdAt: string;
  votes: number;
  author: { username: string; avatar?: string };
}
```

#### PremiumTour
```typescript
{
  tourId: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  statueIds: string[];
  thumbnailUrl?: string;
  rating: number;
  reviewCount: number;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
}
```

#### SponsorExhibit
```typescript
{
  sponsorId: string;
  statueId: string;
  brandName: string;
  campaignUrl: string;
  arContentUrl?: string;
  startDate: string;
  endDate: string;
}
```

## API Documentation

### Statues API

#### GET /api/statues
Get all statues or nearby statues based on location.

**Query Parameters:**
- `lat`: Latitude (optional)
- `lon`: Longitude (optional)
- `radius`: Search radius in km (optional, default: 10)

**Response:**
```json
{
  "statues": [
    {
      "statueId": "statue-1",
      "name": "Liberty Statue",
      "location": { "lat": 40.6892, "lon": -74.0445 },
      "description": "Iconic statue in New York Harbor",
      "arModelUrl": "https://...",
      "thumbnailUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/statues
Create a new statue.

**Request Body:**
```json
{
  "name": "New Statue",
  "location": { "lat": 40.7128, "lon": -74.0060 },
  "description": "A beautiful new statue",
  "arModelUrl": "https://...",
  "thumbnailUrl": "https://..."
}
```

#### GET /api/statues/[statueId]
Get a specific statue with annotation and comment counts.

#### PUT /api/statues/[statueId]
Update a statue.

#### DELETE /api/statues/[statueId]
Delete a statue.

### Annotations API

#### GET /api/annotations
Get annotations filtered by statueId or userId.

**Query Parameters:**
- `statueId`: Filter by statue (optional)
- `userId`: Filter by user (optional)
- `limit`: Number of results (optional, default: 50)
- `offset`: Pagination offset (optional, default: 0)

#### POST /api/annotations
Create a new annotation.

**Request Body:**
```json
{
  "statueId": "statue-1",
  "userId": "user-1",
  "type": "text",
  "content": "This is an annotation",
  "region": { "x": 0.5, "y": 0.3, "width": 0.1, "height": 0.1 },
  "author": { "username": "johndoe", "avatar": "https://..." }
}
```

#### GET /api/annotations/[annotationId]
Get a specific annotation.

#### PUT /api/annotations/[annotationId]
Update an annotation.

#### PATCH /api/annotations/[annotationId]
Vote on an annotation.

**Request Body:**
```json
{
  "action": "upvote" // or "downvote"
}
```

#### DELETE /api/annotations/[annotationId]
Delete an annotation.

### Comments API

#### GET /api/comments
Get comments filtered by statueId or userId.

#### POST /api/comments
Create a new comment.

**Request Body:**
```json
{
  "statueId": "statue-1",
  "userId": "user-1",
  "content": "This is a comment",
  "parentId": "comment-1" // optional, for replies
}
```

#### GET /api/comments/[commentId]
Get a specific comment.

#### PUT /api/comments/[commentId]
Update a comment.

#### PATCH /api/comments/[commentId]
Vote on a comment.

#### DELETE /api/comments/[commentId]
Delete a comment.

### Users API

#### GET /api/users
Get all users or find by Farcaster ID.

**Query Parameters:**
- `farcasterId`: Farcaster ID to search for (optional)

#### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "userId": "user-1",
  "farcasterId": "12345",
  "walletAddress": "0x...",
  "username": "johndoe",
  "avatar": "https://..."
}
```

#### GET /api/users/[userId]
Get a specific user.

#### PUT /api/users/[userId]
Update a user.

#### DELETE /api/users/[userId]
Delete a user.

### Tours API

#### GET /api/tours
Get all premium tours.

#### POST /api/tours
Create a new premium tour.

**Request Body:**
```json
{
  "title": "Historic Downtown Tour",
  "description": "Explore the history of downtown statues",
  "price": 1.99,
  "duration": "2 hours",
  "statueIds": ["statue-1", "statue-2"],
  "thumbnailUrl": "https://...",
  "author": {
    "name": "Jane Smith",
    "avatar": "https://...",
    "verified": true
  }
}
```

#### GET /api/tours/[tourId]
Get a specific tour.

#### PUT /api/tours/[tourId]
Update a tour.

#### DELETE /api/tours/[tourId]
Delete a tour.

### Payments API

#### POST /api/payments
Process a payment for a premium tour.

**Request Body:**
```json
{
  "tourId": "tour-1",
  "userId": "user-1",
  "amount": 1.99
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "paymentId": "payment-123",
    "tourId": "tour-1",
    "userId": "user-1",
    "amount": 1.99,
    "status": "completed",
    "transactionHash": "0x...",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/payments
Get payment history for a user.

**Query Parameters:**
- `userId`: User ID (required)

### Authentication API

#### POST /api/auth
Authenticate or create a user via Farcaster.

**Request Body:**
```json
{
  "farcasterId": "12345",
  "username": "johndoe",
  "walletAddress": "0x..."
}
```

#### GET /api/auth
Get user by Farcaster ID.

**Query Parameters:**
- `farcasterId`: Farcaster ID (required)

### Upload API

#### POST /api/upload
Upload a media file for annotations.

**Form Data:**
- `file`: File to upload (image, audio, or video)
- `type`: File type

**Response:**
```json
{
  "success": true,
  "file": {
    "fileId": "file-123",
    "url": "https://storage.example.com/file-123",
    "type": "image/jpeg",
    "size": 1024000,
    "filename": "image.jpg",
    "uploadedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Sponsors API

#### GET /api/sponsors
Get all sponsors or sponsors for a specific statue.

**Query Parameters:**
- `statueId`: Filter by statue (optional)

#### POST /api/sponsors
Create a new sponsored exhibit.

**Request Body:**
```json
{
  "statueId": "statue-1",
  "brandName": "Nike",
  "campaignUrl": "https://nike.com/campaign",
  "arContentUrl": "https://...",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

#### GET /api/sponsors/[sponsorId]
Get a specific sponsor.

#### PUT /api/sponsors/[sponsorId]
Update a sponsor.

#### DELETE /api/sponsors/[sponsorId]
Delete a sponsor.

## Design System

### Colors
- **Primary**: hsl(240 80% 50%) - Blue
- **Accent**: hsl(10 80% 55%) - Orange
- **Background**: hsl(220 15% 95%) - Light gray
- **Surface**: hsl(220 15% 100%) - White
- **Text Primary**: hsl(220 15% 10%) - Dark gray
- **Text Secondary**: hsl(220 15% 40%) - Medium gray
- **Border**: hsl(220 15% 85%) - Light border

### Typography
- **Display**: text-3xl font-bold
- **H1**: text-2xl font-semibold
- **Body**: text-base font-normal
- **Caption**: text-sm font-medium
- **Button**: text-sm font-semibold

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px

### Border Radius
- **sm**: 6px
- **md**: 10px
- **lg**: 16px
- **xl**: 24px

### Shadows
- **Card**: 0 4px 12px hsla(220, 15%, 10%, 0.08)
- **Lifted**: 0 8px 24px hsla(220, 15%, 10%, 0.12)

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vistara-apps/eb4bdd5a-dad8-48d4-9f8a-b3f1d3e3919a.git
cd eb4bdd5a-dad8-48d4-9f8a-b3f1d3e3919a
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Base network configuration
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_MINIKIT_APP_ID=your-app-id

# Optional: External services
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
NEXT_PUBLIC_ARWEAVE_GATEWAY=https://arweave.net/
```

## Production Deployment

### Build for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Deployment Checklist

- [ ] Configure environment variables for production
- [ ] Set up proper database (replace in-memory store)
- [ ] Configure cloud storage for media files
- [ ] Set up payment processing integration
- [ ] Configure domain and SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure CI/CD pipeline
- [ ] Test all API endpoints
- [ ] Test AR functionality on mobile devices
- [ ] Verify Farcaster integration
- [ ] Test payment flows
- [ ] Performance optimization
- [ ] Security audit

### Database Migration

The current implementation uses an in-memory data store. For production, migrate to a proper database:

1. Choose a database (PostgreSQL, MongoDB, etc.)
2. Create database schema based on the data models
3. Update `lib/dataStore.ts` to use database queries
4. Set up database migrations
5. Configure connection pooling and optimization

### Cloud Storage Setup

For media file storage in production:

1. Choose a storage provider (AWS S3, Google Cloud Storage, IPFS, Arweave)
2. Configure upload API to use the chosen provider
3. Set up CDN for fast media delivery
4. Implement proper access controls and security

### Payment Integration

For real payment processing:

1. Integrate with Base network payment systems
2. Set up smart contracts for micro-transactions
3. Implement proper wallet connections
4. Add transaction verification and security measures

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -am 'Add your feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation for common solutions

---

Built with ❤️ for the Farcaster and Base communities.

