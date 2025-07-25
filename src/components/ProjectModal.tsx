import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../data/projects';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsZoomed(false);
      setLoadedImages(new Set());
    }
  }, [isOpen]);

  // Preload next and previous images
  useEffect(() => {
    if (!project || !isOpen) return;
    
    const images = Array.isArray(project.images) ? project.images : [];
    const preloadImages = [];
    
    // Preload next image
    if (currentImageIndex < images.length - 1) {
      preloadImages.push(currentImageIndex + 1);
    }
    
    // Preload previous image
    if (currentImageIndex > 0) {
      preloadImages.push(currentImageIndex - 1);
    }
    
    preloadImages.forEach(index => {
      if (!loadedImages.has(index)) {
        const img = new Image();
        img.src = `${import.meta.env.VITE_API_BASE_URL}${images[index]}`;
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
        };
      }
    });
  }, [currentImageIndex, project, isOpen, loadedImages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (project && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (project && currentImageIndex < images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentImageIndex, project, onClose]);

  if (!project) return null;

  // Ensure images is always an array
  const images = Array.isArray(project.images) ? project.images : [];
  
  const fullImageUrl = images[currentImageIndex] ? `${import.meta.env.VITE_API_BASE_URL}${images[currentImageIndex]}` : "/placeholder-image.jpg";

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setIsLoading(true);
      setCurrentImageIndex(currentImageIndex + 1);
      // Reset loading after a short delay to allow image to load
      setTimeout(() => setIsLoading(false), 100);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setIsLoading(true);
      setCurrentImageIndex(currentImageIndex - 1);
      // Reset loading after a short delay to allow image to load
      setTimeout(() => setIsLoading(false), 100);
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 border border-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Instructions */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white bg-black/70 backdrop-blur-sm rounded-lg px-6 py-3 text-sm font-medium">
            <span className="text-white">Click image to zoom • Use ← → arrow keys or buttons to navigate</span>
          </div>

          {/* Project Info */}
          <div className="absolute top-4 left-4 z-10 text-white bg-black/60 backdrop-blur-sm rounded-lg p-4 max-w-md">
            <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
            <p className="text-gray-200 text-sm leading-relaxed">{project.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
              <span>{project.location}</span>
              <span>•</span>
              <span>{project.year}</span>
              <span>•</span>
              <span className="capitalize">{project.category}</span>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              className="relative max-w-full max-h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={fullImageUrl}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className={`max-w-full max-h-full object-contain transition-transform duration-200 cursor-pointer ${
                  isZoomed ? 'scale-150' : 'scale-100'
                } ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                onClick={toggleZoom}
                style={{ maxHeight: 'calc(100vh - 200px)', minHeight: '200px' }}
                loading="eager"
                onError={(e) => {
                  console.error('Image failed to load:', fullImageUrl);
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
                onLoad={() => {
                  setIsLoading(false);
                  setLoadedImages(prev => new Set([...prev, currentImageIndex]));
                }}
              />
            </motion.div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed border-2 border-white/30 shadow-lg"
                  title="Previous Image (←)"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={nextImage}
                  disabled={currentImageIndex === images.length - 1}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed border-2 border-white/30 shadow-lg"
                  title="Next Image (→)"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Zoom Button */}
            <button
              onClick={toggleZoom}
              className="absolute bottom-4 right-4 w-14 h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 border border-white/20"
            >
              {isZoomed ? <ZoomOut className="h-6 w-6" /> : <ZoomIn className="h-6 w-6" />}
            </button>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium border border-white/20">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Bottom Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center space-x-4">
                {/* Previous Button */}
                <button
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                  className="w-12 h-12 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed border-2 border-white/30 shadow-lg"
                  title="Previous Image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Thumbnail Dots */}
                <div className="flex space-x-3 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border ${
                        index === currentImageIndex 
                          ? 'bg-white border-white' 
                          : 'bg-white/30 border-white/50 hover:bg-white/50'
                      }`}
                      title={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={nextImage}
                  disabled={currentImageIndex === images.length - 1}
                  className="w-12 h-12 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed border-2 border-white/30 shadow-lg"
                  title="Next Image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal; 