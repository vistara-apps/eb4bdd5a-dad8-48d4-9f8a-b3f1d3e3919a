'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '../components/AppShell';
import { StatueCard } from '../components/StatueCard';
import { ARViewer } from '../components/ARViewer';
import { PremiumTours } from '../components/PremiumTours';
import { mockStatues } from '../lib/mockData';
import type { Statue } from '../lib/types';

export default function HomePage() {
  // Mock user for now - in a real Base Mini App, this would come from MiniKit context
  const mockUser = {
    userId: 'demo-user',
    farcasterId: 'demo-fid',
    walletAddress: '0x123...',
    username: 'DemoUser',
    createdAt: new Date().toISOString()
  };
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [activeView, setActiveView] = useState<'discover' | 'ar' | 'tours'>('discover');
  const [nearbyStatues, setNearbyStatues] = useState<Statue[]>([]);

  useEffect(() => {
    // Simulate loading nearby statues
    const timer = setTimeout(() => {
      setNearbyStatues(mockStatues);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
      user={mockUser}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {activeView === 'discover' && (
        <div className="space-y-6">
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Discover AR Stories
            </h1>
            <p className="text-base font-normal text-gray-600 max-w-md mx-auto">
              Explore public art through augmented reality and community narratives
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 px-4">Nearby Statues</h2>
            
            {nearbyStatues.length === 0 ? (
              <div className="px-4">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow-md">
                      <div className="h-32 bg-gray-200 rounded-md mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
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
