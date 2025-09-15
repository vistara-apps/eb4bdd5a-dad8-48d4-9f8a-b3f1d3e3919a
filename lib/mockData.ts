import type { Statue, Annotation, Comment, PremiumTour } from './types';

export const mockStatues: Statue[] = [
  {
    statueId: '1',
    name: 'Liberty Enlightening the World',
    location: {
      lat: 40.6892,
      lon: -74.0445,
      address: 'Liberty Island, New York, NY'
    },
    description: 'A symbol of freedom and democracy, gifted by France to the United States.',
    arModelUrl: '/models/liberty.glb',
    thumbnailUrl: '/images/liberty-thumb.jpg',
    annotationCount: 24,
    commentCount: 156,
    distance: '0.2 miles'
  },
  {
    statueId: '2',
    name: 'The Thinker',
    location: {
      lat: 40.7829,
      lon: -73.9654,
      address: 'Metropolitan Museum, New York, NY'
    },
    description: 'Auguste Rodin\'s bronze sculpture depicting a man in deep thought.',
    arModelUrl: '/models/thinker.glb',
    thumbnailUrl: '/images/thinker-thumb.jpg',
    annotationCount: 18,
    commentCount: 89,
    distance: '0.5 miles'
  },
  {
    statueId: '3',
    name: 'Charging Bull',
    location: {
      lat: 40.7056,
      lon: -74.0134,
      address: 'Bowling Green, New York, NY'
    },
    description: 'A bronze sculpture symbolizing aggressive financial optimism and prosperity.',
    arModelUrl: '/models/bull.glb',
    thumbnailUrl: '/images/bull-thumb.jpg',
    annotationCount: 31,
    commentCount: 203,
    distance: '0.8 miles'
  }
];

export const mockAnnotations: Annotation[] = [
  {
    annotationId: '1',
    statueId: '1',
    userId: 'user1',
    type: 'text',
    content: 'The torch represents enlightenment and the path to liberty.',
    region: { x: 0.3, y: 0.1, width: 0.2, height: 0.3 },
    createdAt: '2024-01-15T10:30:00Z',
    votes: 42,
    author: {
      username: 'arthistorian',
      avatar: '/avatars/historian.jpg'
    }
  },
  {
    annotationId: '2',
    statueId: '1',
    userId: 'user2',
    type: 'audio',
    contentUrl: '/audio/liberty-story.mp3',
    content: 'Listen to the story behind the crown\'s seven spikes...',
    region: { x: 0.4, y: 0.05, width: 0.2, height: 0.2 },
    createdAt: '2024-01-14T15:45:00Z',
    votes: 28,
    author: {
      username: 'tourguide_ny',
      avatar: '/avatars/guide.jpg'
    }
  }
];

export const mockComments: Comment[] = [
  {
    commentId: '1',
    statueId: '1',
    userId: 'user3',
    content: 'Amazing to see this in AR! The details are incredible.',
    createdAt: '2024-01-16T09:20:00Z',
    votes: 15,
    author: {
      username: 'ar_explorer',
      avatar: '/avatars/explorer.jpg'
    }
  },
  {
    commentId: '2',
    statueId: '1',
    userId: 'user4',
    parentId: '1',
    content: 'I agree! The AR annotations really bring the history to life.',
    createdAt: '2024-01-16T10:15:00Z',
    votes: 8,
    author: {
      username: 'history_buff',
      avatar: '/avatars/buff.jpg'
    }
  }
];

export const mockPremiumTours: PremiumTour[] = [
  {
    tourId: '1',
    title: 'Revolutionary Monuments of NYC',
    description: 'Explore the stories behind America\'s founding through AR-enhanced monuments.',
    price: 1.99,
    duration: '45 min',
    thumbnailUrl: '/images/revolutionary-tour.jpg',
    statueIds: ['1', '3'],
    rating: 4.8,
    reviewCount: 124,
    author: {
      name: 'NYC History Society',
      avatar: '/avatars/nychistory.jpg',
      verified: true
    }
  },
  {
    tourId: '2',
    title: 'Art & Philosophy Walking Tour',
    description: 'Discover the philosophical meanings behind famous sculptures.',
    price: 2.99,
    duration: '60 min',
    thumbnailUrl: '/images/philosophy-tour.jpg',
    statueIds: ['2'],
    rating: 4.6,
    reviewCount: 89,
    author: {
      name: 'Dr. Sarah Chen',
      avatar: '/avatars/chen.jpg',
      verified: true
    }
  }
];
