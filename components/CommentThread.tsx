'use client';

import { useState } from 'react';
import { X, ThumbsUp, Reply, Send } from 'lucide-react';
import type { Comment } from '../lib/types';
import { formatTimeAgo } from '../lib/utils';

interface CommentThreadProps {
  comments: Comment[];
  onClose: () => void;
}

export function CommentThread({ comments, onClose }: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    // Here you would typically submit to your API
    console.log('Submitting comment:', newComment);
    setNewComment('');
    setReplyingTo(null);
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.commentId} className={`${isReply ? 'ml-8 border-l-2 border-border pl-4' : ''}`}>
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-8 h-8 bg-primary rounded-full flex-shrink-0"></div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="caption text-text-primary font-medium">
              {comment.author.username}
            </span>
            <span className="text-xs text-text-secondary">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          
          <p className="body text-text-primary mb-2">{comment.content}</p>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors duration-200">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">{comment.votes}</span>
            </button>
            
            <button 
              onClick={() => setReplyingTo(comment.commentId)}
              className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors duration-200"
            >
              <Reply className="w-4 h-4" />
              <span className="text-sm">Reply</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Render replies */}
      {comment.replies?.map(reply => renderComment(reply, true))}
      
      {/* Reply input */}
      {replyingTo === comment.commentId && (
        <div className="ml-11 mt-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Reply to ${comment.author.username}...`}
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={handleSubmitComment}
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="h1 text-text-primary">Comments ({comments.length})</h3>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="body text-text-secondary">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>

      {/* New Comment Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex-shrink-0"></div>
          <div className="flex-1 flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
            />
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
