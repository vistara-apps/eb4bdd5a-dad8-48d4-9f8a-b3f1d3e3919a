'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, MessageCircle, ThumbsUp, Volume2, Play } from 'lucide-react';
import { AnnotationBubble } from './AnnotationBubble';
import { CommentThread } from './CommentThread';
import type { Statue, Annotation, Comment } from '../lib/types';

interface ARViewerProps {
  statue: Statue;
  onBack: () => void;
}

export function ARViewer({ statue, onBack }: ARViewerProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);

  useEffect(() => {
    fetchAnnotationsAndComments();
  }, [statue.statueId]);

  const fetchAnnotationsAndComments = async () => {
    try {
      // Fetch annotations
      const annotationsResponse = await fetch(`/api/annotations?statueId=${statue.statueId}`);
      if (annotationsResponse.ok) {
        const annotationsData = await annotationsResponse.json();
        setAnnotations(annotationsData.annotations);
      }

      // Fetch comments
      const commentsResponse = await fetch(`/api/comments?statueId=${statue.statueId}`);
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        setComments(commentsData.comments);
      }
    } catch (error) {
      console.error('Error fetching annotations and comments:', error);
    }
  };

  const handleAnnotationClick = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
  };

  const handleAddAnnotation = async (x: number, y: number) => {
    if (!isAddingAnnotation) return;

    try {
      const annotationData = {
        statueId: statue.statueId,
        userId: 'current-user', // In production, get from auth context
        type: 'text' as const,
        content: 'New annotation...',
        region: {
          x: x / 100,
          y: y / 100,
          width: 0.1,
          height: 0.1
        },
        author: {
          username: 'You',
          avatar: '/avatars/default.jpg'
        }
      };

      const response = await fetch('/api/annotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(annotationData),
      });

      if (response.ok) {
        const data = await response.json();
        setAnnotations([...annotations, data.annotation]);
        setSelectedAnnotation(data.annotation);
      } else {
        console.error('Failed to create annotation');
      }
    } catch (error) {
      console.error('Error creating annotation:', error);
    } finally {
      setIsAddingAnnotation(false);
    }
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* AR Camera View Simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-purple-900/20 to-blue-900/30">
        {/* Simulated AR Statue */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            handleAddAnnotation(x, y);
          }}
        >
          <div className="relative">
            {/* 3D Statue Representation */}
            <div className="w-48 h-64 bg-gradient-to-b from-gray-300 to-gray-600 rounded-lg statue-glow transform perspective-1000 rotate-y-12">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
            </div>
            
            {/* AR Annotations */}
            {annotations.map((annotation) => (
              <AnnotationBubble
                key={annotation.annotationId}
                annotation={annotation}
                onClick={() => handleAnnotationClick(annotation)}
                style={{
                  position: 'absolute',
                  left: `${annotation.region.x * 100}%`,
                  top: `${annotation.region.y * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AR Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 pointer-events-auto">
          <button
            onClick={onBack}
            className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="ar-overlay px-3 py-2 rounded-lg">
            <h2 className="text-white font-semibold text-sm">{statue.name}</h2>
          </div>
          
          <button
            onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
              isAddingAnnotation 
                ? 'bg-accent text-white' 
                : 'bg-black/50 text-white'
            }`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setShowComments(!showComments)}
              className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{comments.length}</span>
            </button>
            
            <button className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm flex items-center space-x-2">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">Like</span>
            </button>
          </div>
        </div>

        {/* Adding Annotation Hint */}
        {isAddingAnnotation && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <div className="ar-overlay px-4 py-2 rounded-lg text-white text-center">
              <p className="text-sm">Tap on the statue to add an annotation</p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Annotation Detail */}
      {selectedAnnotation && (
        <div className="absolute bottom-20 left-4 right-4 pointer-events-auto">
          <div className="bg-surface rounded-lg p-4 shadow-lifted animate-slide-up">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded-full"></div>
                <span className="caption text-text-primary">{selectedAnnotation.author.username}</span>
              </div>
              <button
                onClick={() => setSelectedAnnotation(null)}
                className="text-text-secondary hover:text-text-primary"
              >
                ×
              </button>
            </div>
            
            {selectedAnnotation.type === 'audio' ? (
              <div className="flex items-center space-x-3">
                <button className="bg-primary text-white p-2 rounded-full">
                  <Play className="w-4 h-4" />
                </button>
                <div className="flex-1">
                  <p className="body text-text-primary">{selectedAnnotation.content}</p>
                </div>
                <Volume2 className="w-4 h-4 text-text-secondary" />
              </div>
            ) : (
              <p className="body text-text-primary mb-3">{selectedAnnotation.content}</p>
            )}
            
            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-1 text-text-secondary hover:text-primary">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">{selectedAnnotation.votes}</span>
              </button>
              <span className="text-xs text-text-secondary">
                {new Date(selectedAnnotation.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Comments Panel */}
      {showComments && (
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-surface rounded-t-xl pointer-events-auto">
          <CommentThread
            comments={comments}
            onClose={() => setShowComments(false)}
          />
        </div>
      )}
    </div>
  );
}
