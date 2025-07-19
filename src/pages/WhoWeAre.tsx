import React from 'react';
import { useInView } from '../hooks/useInView';

const WhoWeAre = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div ref={ref} className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Page Header */}
          <div className="mb-20">
            <h1 className="text-6xl md:text-8xl font-bold text-black mb-8 tracking-tight">
              WHO WE ARE
            </h1>
            <div className="w-24 h-1 bg-black mb-8"></div>
            <p className="text-xl text-gray-700 max-w-4xl leading-relaxed">
              Meet the passionate team behind AA Designer Studio and discover our journey 
              in creating exceptional spaces that reflect unique style and personality.
            </p>
          </div>

          {/* About Section */}
          <div className="grid lg:grid-cols-12 gap-16 items-center mb-32">
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

              <div className="bg-amber-50 rounded-2xl p-8 border-l-4 border-amber-800">
                <p className="text-xl font-medium text-amber-900 leading-relaxed">
                  If you're looking for a design team that's both talented and experienced, look no further than AA Designer Studio.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-200">
                  <img 
                    src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" 
                    alt="AA Designer Studio Office" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-black rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Founders Section */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-12 tracking-tight">
              MEET OUR
              <br />
              <span className="text-gray-600">FOUNDERS</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-200">
                  <img 
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" 
                    alt="Anjan and Mona - Founders" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-black text-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold">Anjan & Mona</h3>
                  <p className="text-gray-300">Founders</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="bg-gray-50 rounded-2xl p-8 border-l-4 border-black">
                <h3 className="text-2xl font-bold text-black mb-4">
                  Two best friends with over 9 years of combined experience
                </h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  These two best friends have over 9 years of experience in the design industry together, they have a diverse experience in an array of architectural typologies, including single-residential, multi-residential, commercial office, workplace design, hospitality & health.
                </p>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  With this rounded knowledge, they have come together to establish their own practice and are passionate about creating beautiful, functional spaces that reflect their clients' unique style.
                </p>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  At AA Designer Studio, each of our projects are unique – we don't replicate a signature style. Anjan and Mona work closely with their clients to bring their vision to life, and they're committed to delivering exceptional design services that exceed expectations.
                </p>
              </div>

              <div className="bg-amber-800 text-white rounded-2xl p-8">
                <p className="text-lg leading-relaxed">
                  Every project is grounded in solid principles of functionality, material exploration and environmental sustainability to ensure our buildings are enjoyed long into the future.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-32">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-12 tracking-tight">
              OUR VALUES
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-amber-800 transition-colors duration-300">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Functionality</h3>
                <p className="text-gray-700 leading-relaxed">
                  Every design decision is made with functionality at its core, ensuring spaces work beautifully for their intended purpose.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-amber-800 transition-colors duration-300">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Sustainability</h3>
                <p className="text-gray-700 leading-relaxed">
                  We prioritize environmental responsibility in material selection and design approaches for long-lasting impact.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-amber-800 transition-colors duration-300">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Innovation</h3>
                <p className="text-gray-700 leading-relaxed">
                  Cutting-edge design solutions combined with timeless principles create spaces that stand the test of time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;