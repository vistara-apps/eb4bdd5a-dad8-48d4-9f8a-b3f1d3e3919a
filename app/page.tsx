'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/minikit';
import { AppShell } from '../components/AppShell';
import { StatueCard } from '../components/StatueCard';
import { ARViewer } from '../components/ARViewer';
import { PremiumTours } from '../components/PremiumTours';
import type { Statue } from '../lib/types';

export default function HomePage() {
  const { context } = useMiniKit();
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [activeView, setActiveView] = useState<'discover' | 'ar' | 'tours'>('discover');
  const [nearbyStatues, setNearbyStatues] = useState<Statue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNearbyStatues();
  }, []);

  const fetchNearbyStatues = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get user's location for nearby statues
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`/api/statues?lat=${latitude}&lon=${longitude}&radius=10`);
            if (response.ok) {
              const data = await response.json();
              setNearbyStatues(data.statues);
            } else {
              throw new Error('Failed to fetch nearby statues');
            }
          },
          async (error) => {
            console.warn('Geolocation error:', error);
            // Fallback to all statues
            await fetchAllStatues();
          }
        );
      } else {
        // Fallback to all statues
        await fetchAllStatues();
      }
    } catch (err) {
      console.error('Error fetching statues:', err);
      setError('Failed to load statues');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStatues = async () => {
    try {
      const response = await fetch('/api/statues');
      if (response.ok) {
        const data = await response.json();
        setNearbyStatues(data.statues);
      } else {
        throw new Error('Failed to fetch statues');
      }
    } catch (err) {
      console.error('Error fetching statues:', err);
      setError('Failed to load statues');
    }
  };

  const handleStatueSelect = (statue: Statue) => {
    setSelectedStatue(statue);
    setActiveView('ar');
  };

  const handleBackToDiscover = () => {
    setSelectedStatue(null);
    setActiveView('discover');
  };

  return (
    <AppShell
      user={context?.user}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {activeView === 'discover' && (
        <div className="space-y-6">
          <div className="text-center py-8">
            <h1 className="display text-text-primary mb-4">
              Discover AR Stories
            </h1>
            <p className="body text-text-secondary max-w-md mx-auto">
              Explore public art through augmented reality and community narratives
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="h1 text-text-primary px-4">Nearby Statues</h2>
            
            {loading ? (
              <div className="px-4">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-surface rounded-lg p-4 shadow-card">
                      <div className="h-32 bg-border rounded-md mb-4"></div>
                      <div className="h-4 bg-border rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-border rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="px-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-center">{error}</p>
                  <button
                    onClick={fetchNearbyStatues}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : nearbyStatues.length === 0 ? (
              <div className="px-4">
                <div className="text-center py-8">
                  <p className="body text-text-secondary">No statues found nearby.</p>
                  <button
                    onClick={fetchAllStatues}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    View All Statues
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 space-y-4">
                {nearbyStatues.map((statue) => (
                  <StatueCard
                    key={statue.statueId}
                    statue={statue}
                    onSelect={handleStatueSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeView === 'ar' && selectedStatue && (
        <ARViewer
          statue={selectedStatue}
          onBack={handleBackToDiscover}
        />
      )}

      {activeView === 'tours' && (
        <PremiumTours />
      )}
    </AppShell>
  );
}
