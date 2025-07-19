import React, { useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000); // Show for 3 seconds

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="w-64 h-64 bg-white rounded-lg overflow-hidden">
        <img 
          src="/aa.gif" 
          alt="AA Designer Studio Loading" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;