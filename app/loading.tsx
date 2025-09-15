export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="caption text-text-secondary">Loading SculptAR Stories...</p>
      </div>
    </div>
  );
}
