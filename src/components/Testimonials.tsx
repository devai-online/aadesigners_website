import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { testimonialsAPI } from '../services/api';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image_path: string | null;
  rating: number;
  text: string;
  project: string;
}

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Load testimonials from API
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const data = await testimonialsAPI.getAll();
        setTestimonials(data);
      } catch (err) {
        console.error('Error loading testimonials:', err);
        setError('Failed to load testimonials');
        // Fallback to default testimonials
        const defaultTestimonials: Testimonial[] = [
          {
            id: '1',
            name: "Sarah Johnson",
            role: "Homeowner",
            image_path: null,
            rating: 5,
            text: "AA Designer Studio transformed our home into a masterpiece. Their attention to detail and understanding of our vision was exceptional. Every room now tells a story of elegance and functionality.",
            project: "Modern Family Home"
          },
          {
            id: '2',
            name: "Michael Chen",
            role: "Business Owner",
            image_path: null,
            rating: 5,
            text: "The team's professionalism and creativity exceeded our expectations. They created a workspace that not only looks stunning but also enhances productivity and employee satisfaction.",
            project: "Corporate Office Design"
          },
          {
            id: '3',
            name: "Emma Rodriguez",
            role: "Restaurant Owner",
            image_path: null,
            rating: 5,
            text: "From concept to completion, AA Designer Studio delivered beyond our dreams. The ambiance they created has significantly improved our customer experience and business success.",
            project: "Restaurant Interior"
          },
          {
            id: '4',
            name: "David Thompson",
            role: "Property Developer",
            image_path: null,
            rating: 5,
            text: "Working with Anjan and Mona was a game-changer for our luxury development. Their innovative designs and sustainable approach set our properties apart in the market.",
            project: "Luxury Apartments"
          }
        ];
        setTestimonials(defaultTestimonials);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-black mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              CLIENT
              <br />
              <span className="text-gray-600">TESTIMONIALS</span>
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-black mx-auto mb-8"
              initial={{ width: 0 }}
              animate={inView ? { width: 96 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Hear what our clients say about their transformation journey with us
            </motion.p>
          </div>

          {/* Testimonial Slider */}
          <div className="relative max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100"
              >
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  {/* Client Image */}
                  <div className="lg:col-span-1">
                    <div className="relative">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-200">
                        <img 
                          src={testimonials[currentTestimonial].image_path 
                            ? `http://localhost:3001${testimonials[currentTestimonial].image_path}`
                            : "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                          }
                          alt={testimonials[currentTestimonial].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-4 -right-4 bg-black text-white rounded-full p-3">
                        <Quote className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Stars */}
                    <div className="flex space-x-1">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-xl text-gray-700 leading-relaxed italic">
                      "{testimonials[currentTestimonial].text}"
                    </blockquote>

                    {/* Client Info */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-black">
                            {testimonials[currentTestimonial].name}
                          </h4>
                          <p className="text-gray-600">
                            {testimonials[currentTestimonial].role}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {testimonials[currentTestimonial].project}
                          </p>
                          <p className="text-sm text-gray-600">Project</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevTestimonial}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6 text-black" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6 text-black" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-black scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;