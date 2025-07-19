import React from 'react';
import { useInView } from '../hooks/useInView';

const About = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Section Header */}
          <div className="mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tight">
              WHO WE ARE
            </h2>
            <div className="w-24 h-1 bg-black"></div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  Welcome to <span className="font-semibold text-black">AA Designer Studio</span>, where we believe that your space should reflect your unique style and personality. Our team of expert designers is dedicated to creating functional, beautiful spaces that meet your every need.
                </p>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  Our projects range from small residential to large commercial spaces, and we're committed to delivering exceptional design services that exceed your expectations. Whether you're looking to design or redesign your home or office with Architectural, Interiors and Landscape, we're here to help you create a space that's both beautiful and functional.
                </p>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  At AA Designer Studio, we believe that great design is all about creating a space that's perfectly tailored to your needs, and we're committed to working closely with you to bring your vision to life.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border-l-4 border-black">
                <p className="text-xl font-medium text-gray-900 leading-relaxed">
                  If you're looking for a design team that's both talented and experienced, look no further than AA Designer Studio.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-200">
                  <img 
                    src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" 
                    alt="Interior Design Process" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-black rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;