import React from 'react';
import { useInView } from '../hooks/useInView';

const Founders = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="founders" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Section Header */}
          <div className="mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tight">
              MEET OUR
              <br />
              <span className="text-gray-600">FOUNDERS</span>
            </h2>
            <div className="w-24 h-1 bg-black"></div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Image */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-200">
                  <img 
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" 
                    alt="Anjan and Mona - Founders" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Name Tag */}
                <div className="absolute -bottom-6 -right-6 bg-black text-white rounded-2xl p-6">
                  <h3 className="text-xl font-bold">Anjan & Mona</h3>
                  <p className="text-gray-300">Founders</p>
                </div>
              </div>
            </div>

            {/* Text Content */}
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

              <div className="bg-black text-white rounded-2xl p-8">
                <p className="text-lg leading-relaxed">
                  Every project is grounded in solid principles of functionality, material exploration and environmental sustainability to ensure our buildings are enjoyed long into the future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founders;