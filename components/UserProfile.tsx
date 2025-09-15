'use client';

import type { User } from '../lib/types';

interface UserProfileProps {
  user: User;
  variant?: 'compact' | 'full';
}

export function UserProfile({ user, variant = 'compact' }: UserProfileProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="caption text-text-primary font-medium">
          {user.username}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg p-4 shadow-card">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white text-lg font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="h1 text-text-primary">{user.username}</h3>
          {user.farcasterId && (
            <p className="caption text-text-secondary">
              Farcaster ID: {user.farcasterId}
            </p>
          )}
          {user.walletAddress && (
            <p className="caption text-text-secondary">
              {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
