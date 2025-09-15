import type { User, Statue, Annotation, Comment, PremiumTour, SponsorExhibit } from './types';
import { mockStatues, mockAnnotations, mockComments, mockPremiumTours } from './mockData';

// Simple JSON-based data store for development
// In production, this would be replaced with a proper database

class DataStore {
  private users: User[] = [];
  private statues: Statue[] = mockStatues;
  private annotations: Annotation[] = mockAnnotations;
  private comments: Comment[] = mockComments;
  private tours: PremiumTour[] = mockPremiumTours;
  private sponsors: SponsorExhibit[] = [];

  // User methods
  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.find(u => u.userId === userId) || null;
  }

  async getUserByFarcasterId(farcasterId: string): Promise<User | null> {
    return this.users.find(u => u.farcasterId === farcasterId) || null;
  }

  async createUser(user: Omit<User, 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.userId === userId);
    if (index === -1) return null;

    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  // Statue methods
  async getStatues(): Promise<Statue[]> {
    return this.statues;
  }

  async getStatueById(statueId: string): Promise<Statue | null> {
    return this.statues.find(s => s.statueId === statueId) || null;
  }

  async getNearbyStatues(lat: number, lon: number, radiusKm: number = 5): Promise<Statue[]> {
    // Simple distance calculation (in production, use proper geospatial queries)
    return this.statues.filter(statue => {
      const distance = this.calculateDistance(lat, lon, statue.location.lat, statue.location.lon);
      return distance <= radiusKm;
    });
  }

  async createStatue(statue: Omit<Statue, 'statueId' | 'annotationCount' | 'commentCount'>): Promise<Statue> {
    const newStatue: Statue = {
      ...statue,
      statueId: `statue-${Date.now()}`,
      annotationCount: 0,
      commentCount: 0,
    };
    this.statues.push(newStatue);
    return newStatue;
  }

  async updateStatue(statueId: string, updates: Partial<Statue>): Promise<Statue | null> {
    const index = this.statues.findIndex(s => s.statueId === statueId);
    if (index === -1) return null;

    this.statues[index] = { ...this.statues[index], ...updates };
    return this.statues[index];
  }

  // Annotation methods
  async getAnnotations(statueId?: string): Promise<Annotation[]> {
    if (statueId) {
      return this.annotations.filter(a => a.statueId === statueId);
    }
    return this.annotations;
  }

  async getAnnotationById(annotationId: string): Promise<Annotation | null> {
    return this.annotations.find(a => a.annotationId === annotationId) || null;
  }

  async createAnnotation(annotation: Omit<Annotation, 'annotationId' | 'createdAt' | 'votes'>): Promise<Annotation> {
    const newAnnotation: Annotation = {
      ...annotation,
      annotationId: `annotation-${Date.now()}`,
      createdAt: new Date().toISOString(),
      votes: 0,
    };
    this.annotations.push(newAnnotation);

    // Update statue annotation count
    const statue = this.statues.find(s => s.statueId === annotation.statueId);
    if (statue) {
      statue.annotationCount++;
    }

    return newAnnotation;
  }

  async updateAnnotation(annotationId: string, updates: Partial<Annotation>): Promise<Annotation | null> {
    const index = this.annotations.findIndex(a => a.annotationId === annotationId);
    if (index === -1) return null;

    this.annotations[index] = { ...this.annotations[index], ...updates };
    return this.annotations[index];
  }

  async deleteAnnotation(annotationId: string): Promise<boolean> {
    const index = this.annotations.findIndex(a => a.annotationId === annotationId);
    if (index === -1) return false;

    const annotation = this.annotations[index];
    this.annotations.splice(index, 1);

    // Update statue annotation count
    const statue = this.statues.find(s => s.statueId === annotation.statueId);
    if (statue && statue.annotationCount > 0) {
      statue.annotationCount--;
    }

    return true;
  }

  async voteAnnotation(annotationId: string, increment: boolean = true): Promise<Annotation | null> {
    const annotation = this.annotations.find(a => a.annotationId === annotationId);
    if (!annotation) return null;

    annotation.votes += increment ? 1 : -1;
    return annotation;
  }

  // Comment methods
  async getComments(statueId?: string, parentId?: string): Promise<Comment[]> {
    let comments = this.comments;

    if (statueId) {
      comments = comments.filter(c => c.statueId === statueId);
    }

    if (parentId) {
      comments = comments.filter(c => c.parentId === parentId);
    }

    return comments;
  }

  async getCommentById(commentId: string): Promise<Comment | null> {
    return this.comments.find(c => c.commentId === commentId) || null;
  }

  async createComment(comment: Omit<Comment, 'commentId' | 'createdAt' | 'votes' | 'replies'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      commentId: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      votes: 0,
      replies: [],
    };
    this.comments.push(newComment);

    // Update statue comment count
    const statue = this.statues.find(s => s.statueId === comment.statueId);
    if (statue) {
      statue.commentCount++;
    }

    return newComment;
  }

  async updateComment(commentId: string, updates: Partial<Comment>): Promise<Comment | null> {
    const index = this.comments.findIndex(c => c.commentId === commentId);
    if (index === -1) return null;

    this.comments[index] = { ...this.comments[index], ...updates };
    return this.comments[index];
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const index = this.comments.findIndex(c => c.commentId === commentId);
    if (index === -1) return false;

    const comment = this.comments[index];
    this.comments.splice(index, 1);

    // Update statue comment count
    const statue = this.statues.find(s => s.statueId === comment.statueId);
    if (statue && statue.commentCount > 0) {
      statue.commentCount--;
    }

    return true;
  }

  async voteComment(commentId: string, increment: boolean = true): Promise<Comment | null> {
    const comment = this.comments.find(c => c.commentId === commentId);
    if (!comment) return null;

    comment.votes += increment ? 1 : -1;
    return comment;
  }

  // Tour methods
  async getTours(): Promise<PremiumTour[]> {
    return this.tours;
  }

  async getTourById(tourId: string): Promise<PremiumTour | null> {
    return this.tours.find(t => t.tourId === tourId) || null;
  }

  async createTour(tour: Omit<PremiumTour, 'tourId'>): Promise<PremiumTour> {
    const newTour: PremiumTour = {
      ...tour,
      tourId: `tour-${Date.now()}`,
    };
    this.tours.push(newTour);
    return newTour;
  }

  // Sponsor methods
  async getSponsors(): Promise<SponsorExhibit[]> {
    return this.sponsors;
  }

  async getSponsorById(sponsorId: string): Promise<SponsorExhibit | null> {
    return this.sponsors.find(s => s.sponsorId === sponsorId) || null;
  }

  async getSponsorsByStatue(statueId: string): Promise<SponsorExhibit[]> {
    return this.sponsors.filter(s => s.statueId === statueId);
  }

  async createSponsor(sponsor: Omit<SponsorExhibit, 'sponsorId'>): Promise<SponsorExhibit> {
    const newSponsor: SponsorExhibit = {
      ...sponsor,
      sponsorId: `sponsor-${Date.now()}`,
    };
    this.sponsors.push(newSponsor);
    return newSponsor;
  }

  // Utility methods
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Export singleton instance
export const dataStore = new DataStore();

