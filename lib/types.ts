export interface User {
  userId: string;
  farcasterId?: string;
  walletAddress?: string;
  username: string;
  createdAt: string;
}

export interface Statue {
  statueId: string;
  name: string;
  location: {
    lat: number;
    lon: number;
    address: string;
  };
  description: string;
  arModelUrl: string;
  thumbnailUrl: string;
  annotationCount: number;
  commentCount: number;
  distance?: string;
}

export interface Annotation {
  annotationId: string;
  statueId: string;
  userId: string;
  type: 'text' | 'audio' | 'video' | 'image';
  contentUrl?: string;
  content?: string;
  region: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  createdAt: string;
  votes: number;
  author: {
    username: string;
    avatar?: string;
  };
}

export interface Comment {
  commentId: string;
  statueId: string;
  userId: string;
  parentId?: string;
  content: string;
  createdAt: string;
  votes: number;
  author: {
    username: string;
    avatar?: string;
  };
  replies?: Comment[];
}

export interface PremiumTour {
  tourId: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  thumbnailUrl: string;
  statueIds: string[];
  rating: number;
  reviewCount: number;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
}

export interface SponsorExhibit {
  sponsorId: string;
  statueId: string;
  brandName: string;
  campaignUrl: string;
  arContentUrl: string;
  startDate: string;
  endDate: string;
}
