'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h2 className="h1 text-text-primary">Something went wrong</h2>
          <p className="body text-text-secondary">
            We encountered an error while loading the AR experience.
          </p>
        </div>

        <button
          onClick={reset}
          className="bg-primary text-white px-6 py-3 rounded-lg button-text hover:bg-primary/90 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
