'use client';

import { Volume2, Image, MessageSquare } from 'lucide-react';
import type { Annotation } from '../lib/types';

interface AnnotationBubbleProps {
  annotation: Annotation;
  onClick: () => void;
  style?: React.CSSProperties;
  variant?: 'text' | 'audio' | 'video';
}

export function AnnotationBubble({ 
  annotation, 
  onClick, 
  style,
  variant = annotation.type as 'text' | 'audio' | 'video'
}: AnnotationBubbleProps) {
  const getIcon = () => {
    switch (variant) {
      case 'audio':
        return <Volume2 className="w-3 h-3" />;
      case 'video':
        return <Image className="w-3 h-3" />;
      default:
        return <MessageSquare className="w-3 h-3" />;
    }
  };

  const getColor = () => {
    switch (variant) {
      case 'audio':
        return 'bg-accent';
      case 'video':
        return 'bg-purple-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <button
      onClick={onClick}
      style={style}
      className={`${getColor()} text-white p-2 rounded-full shadow-lifted hover:scale-110 transition-transform duration-200 animate-pulse-slow`}
    >
      {getIcon()}
      
      {/* Pulse Animation Ring */}
      <div className={`absolute inset-0 ${getColor()} rounded-full animate-ping opacity-30`}></div>
      
      {/* Vote Count Badge */}
      {annotation.votes > 0 && (
        <div className="absolute -top-1 -right-1 bg-surface text-text-primary text-xs px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center">
          {annotation.votes}
        </div>
      )}
    </button>
  );
}
