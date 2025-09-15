'use client';

import { MapPin, MessageCircle, Tag } from 'lucide-react';
import type { Statue } from '../lib/types';

interface StatueCardProps {
  statue: Statue;
  onSelect: (statue: Statue) => void;
}

export function StatueCard({ statue, onSelect }: StatueCardProps) {
  return (
    <div className="bg-surface rounded-lg shadow-card overflow-hidden animate-fade-in">
      {/* Statue Image */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-surface/80 rounded-full flex items-center justify-center statue-glow">
            <div className="w-8 h-8 bg-primary rounded-sm"></div>
          </div>
        </div>
        
        {statue.distance && (
          <div className="absolute top-2 right-2 bg-surface/90 px-2 py-1 rounded-md">
            <span className="text-xs font-medium text-text-secondary">{statue.distance}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="h1 text-text-primary mb-1">{statue.name}</h3>
          <div className="flex items-center text-text-secondary text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{statue.location.address}</span>
          </div>
        </div>

        <p className="body text-text-secondary text-sm line-clamp-2">
          {statue.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-text-secondary">
            <div className="flex items-center space-x-1">
              <Tag className="w-4 h-4" />
              <span className="text-sm">{statue.annotationCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{statue.commentCount}</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(statue)}
            className="bg-primary text-white px-4 py-2 rounded-lg button-text hover:bg-primary/90 transition-colors duration-200"
          >
            View AR
          </button>
        </div>
      </div>
    </div>
  );
}
