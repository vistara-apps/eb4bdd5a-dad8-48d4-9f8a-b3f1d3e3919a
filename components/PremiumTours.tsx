'use client';

import { useState, useEffect } from 'react';
import { Star, Clock, Users, Play, ShoppingCart } from 'lucide-react';
import type { PremiumTour } from '../lib/types';
import { formatPrice } from '../lib/utils';

export function PremiumTours() {
  const [tours, setTours] = useState<PremiumTour[]>([]);
  const [selectedTour, setSelectedTour] = useState<PremiumTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/tours');
      if (response.ok) {
        const data = await response.json();
        setTours(data.tours);
      } else {
        throw new Error('Failed to fetch tours');
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (tour: PremiumTour) => {
    try {
      const paymentData = {
        tourId: tour.tourId,
        userId: 'current-user', // In production, get from auth context
        amount: tour.price,
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Payment successful! You now have access to "${tour.title}". Transaction: ${data.payment.transactionHash}`);
      } else {
        const error = await response.json();
        alert(`❌ Payment failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('❌ Payment failed. Please try again.');
    }
  };

  if (selectedTour) {
    return (
      <div className="container py-6 space-y-6">
        <button
          onClick={() => setSelectedTour(null)}
          className="text-primary hover:text-primary/80 transition-colors duration-200"
        >
          ← Back to Tours
        </button>

        <div className="bg-surface rounded-lg shadow-card overflow-hidden">
          {/* Tour Header */}
          <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-16 h-16 text-primary/60" />
            </div>
            <div className="absolute top-4 right-4 bg-surface/90 px-3 py-1 rounded-lg">
              <span className="h1 text-text-primary">{formatPrice(selectedTour.price)}</span>
            </div>
          </div>

          {/* Tour Details */}
          <div className="p-6 space-y-4">
            <div>
              <h1 className="display text-text-primary mb-2">{selectedTour.title}</h1>
              <p className="body text-text-secondary">{selectedTour.description}</p>
            </div>

            {/* Tour Stats */}
            <div className="flex items-center space-x-6 text-text-secondary">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span className="caption">{selectedTour.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="caption">{selectedTour.rating}</span>
                <span className="caption">({selectedTour.reviewCount})</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span className="caption">{selectedTour.statueIds.length} statues</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center space-x-3 p-3 bg-bg rounded-lg">
              <div className="w-10 h-10 bg-primary rounded-full"></div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="caption text-text-primary font-medium">
                    {selectedTour.author.name}
                  </span>
                  {selectedTour.author.verified && (
                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-text-secondary">Tour Creator</span>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              onClick={() => handlePurchase(selectedTour)}
              className="w-full bg-primary text-white py-3 rounded-lg button-text hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Purchase Tour - {formatPrice(selectedTour.price)}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="text-center">
        <h1 className="display text-text-primary mb-4">Premium AR Tours</h1>
        <p className="body text-text-secondary max-w-md mx-auto">
          Unlock expert-curated AR experiences with deeper insights and exclusive content
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          // Loading state
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-lg shadow-card overflow-hidden animate-pulse">
              <div className="h-32 bg-border"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-border rounded w-3/4"></div>
                <div className="h-4 bg-border rounded w-full"></div>
                <div className="h-4 bg-border rounded w-2/3"></div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div className="h-4 bg-border rounded w-12"></div>
                    <div className="h-4 bg-border rounded w-8"></div>
                    <div className="h-4 bg-border rounded w-6"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-border rounded-full"></div>
                    <div className="h-4 bg-border rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          // Error state
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchTours}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : tours.length === 0 ? (
          // Empty state
          <div className="text-center py-8">
            <p className="body text-text-secondary">No premium tours available at the moment.</p>
          </div>
        ) : (
          tours.map((tour) => (
          <div
            key={tour.tourId}
            className="bg-surface rounded-lg shadow-card overflow-hidden cursor-pointer hover:shadow-lifted transition-shadow duration-200"
            onClick={() => setSelectedTour(tour)}
          >
            {/* Tour Thumbnail */}
            <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-12 h-12 text-primary/60" />
              </div>
              <div className="absolute top-2 right-2 bg-surface/90 px-2 py-1 rounded-md">
                <span className="caption font-semibold text-text-primary">
                  {formatPrice(tour.price)}
                </span>
              </div>
            </div>

            {/* Tour Info */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="h1 text-text-primary mb-1">{tour.title}</h3>
                <p className="body text-text-secondary text-sm line-clamp-2">
                  {tour.description}
                </p>
              </div>

              {/* Tour Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{tour.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">{tour.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{tour.statueIds.length}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary rounded-full"></div>
                  <span className="text-sm text-text-secondary">{tour.author.name}</span>
                  {tour.author.verified && (
                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 text-center">
        <h3 className="h1 text-text-primary mb-2">Create Your Own Tour</h3>
        <p className="body text-text-secondary mb-4">
          Share your expertise and earn from your AR content
        </p>
        <button className="bg-accent text-white px-6 py-3 rounded-lg button-text hover:bg-accent/90 transition-colors duration-200">
          Become a Creator
        </button>
      </div>
    </div>
  );
}
