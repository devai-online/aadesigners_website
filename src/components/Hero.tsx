import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const slides = [
    {
      image: "/1.png",
      title: "Modern Living Spaces",
      description: "Contemporary design meets functionality"
    },
    {
      image: "/2.png",
      title: "Elegant Interiors",
      description: "Sophisticated spaces with personal touch"
    },
    {
      image: "/3.png",
      title: "Luxury Design",
      description: "Premium materials and craftsmanship"
    },
    {
      image: "/4.jpg",
      title: "Functional Beauty",
      description: "Where form meets function perfectly"
    },
    {
      image: "/5.png",
      title: "Design Excellence",
      description: "Where creativity meets precision"
    },
    {
      image: "/6.png",
      title: "Timeless Elegance",
      description: "Classic designs for modern living"
    },
    {
      image: "/7.png",
      title: "Innovative Spaces",
      description: "Pushing boundaries in interior design"
    },
    {
      image: "/8.png",
      title: "Artistic Vision",
      description: "Transforming spaces into masterpieces"
    }
  ];

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = slides.map((slide, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, index]));
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${slide.image}`);
            resolve();
          };
          img.src = slide.image;
        });
      });

      await Promise.all(imagePromises);
      setIsLoading(false);
    };

    preloadImages();
  }, []);

  // Preload next and previous images for smooth transitions
  useEffect(() => {
    const preloadAdjacentImages = () => {
      const nextIndex = (currentSlide + 1) % slides.length;
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      
      [nextIndex, prevIndex].forEach(index => {
        if (!loadedImages.has(index)) {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, index]));
          };
          img.src = slides[index].image;
        }
      });
    };

    preloadAdjacentImages();
  }, [currentSlide, loadedImages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full opacity-30"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
        {/* Image Slider */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] max-h-[600px] min-h-[400px] rounded-3xl overflow-hidden bg-gray-200 shadow-2xl">
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            )}

            {/* Slides */}
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                initial={{ scale: 1.1 }}
                animate={{ scale: index === currentSlide ? 1 : 1.1 }}
                transition={{ duration: 1 }}
              >
                {/* Optimized Image with loading optimization */}
                <OptimizedImage
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                  loading={index <= 2 ? "eager" : "lazy"}
                  onLoad={() => {
                    setLoadedImages(prev => new Set([...prev, index]));
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${slide.image}`);
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                  <motion.div 
                    className="p-6 md:p-8 lg:p-12 text-white w-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{slide.title}</h3>
                    <p className="text-base md:text-lg text-gray-200">{slide.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {/* Navigation Arrows */}
            <motion.button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </motion.button>

            {/* Dots Indicator */}
            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <motion.div 
            className="bg-black rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
            
            <div className="relative z-10">
              <motion.h2 
                className="text-2xl font-medium mb-6 text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Crafting Beautiful, Functional Spaces
                <br />
                with a Personal Touch
              </motion.h2>
              
              <motion.p 
                className="text-gray-300 leading-relaxed mb-8 text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                At AA Designer Studio, we specialize in creating luxurious yet comfortable interiors that exude elegance and charm. Our focus on craftsmanship, elegant materials, and striking design brings sophistication to modern living spaces.
              </motion.p>
              
              <motion.button 
                className="bg-white text-black px-8 py-4 rounded-full font-medium tracking-wide hover:bg-gray-100 transition-all duration-300 relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Start Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div 
              className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-200 shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="/1.png" 
                alt="Modern Interior Design" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Floating Card */}
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-12 h-12 bg-black rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-white font-bold">AA</span>
                </motion.div>
                <div>
                  <p className="font-semibold text-gray-900">AA Designer Studio</p>
                  <p className="text-gray-600 text-sm">Interior Design Excellence</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;