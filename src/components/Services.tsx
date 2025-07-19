import React from 'react';
import { Search, Palette, FileText, Eye } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const Services = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const services = [
    {
      icon: Search,
      title: 'Research',
      subtitle: 'Conducting In-Depth User Research to Establish Facts and Reach Conclusions',
      description: 'In this phase of the project, we engage in a comprehensive research process, collecting valuable data from end users. Our team thoroughly studies various materials and sources to ensure that we establish accurate facts and draw meaningful conclusions.'
    },
    {
      icon: Palette,
      title: 'Design',
      subtitle: 'Creating 3D Visualizations to Bring Concepts to Life',
      description: 'During the design phase, we employ our expertise to conceptualize plans and create visually stunning 3D renderings. By utilizing cutting-edge tools and materials, we bring our ideas to fruition, showcasing both the aesthetic appeal and functional aspects of the project.'
    },
    {
      icon: FileText,
      title: 'Drawing',
      subtitle: 'Developing Technical Diagrams for Construction Reference',
      description: 'In this stage, we meticulously produce detailed technical diagrams that serve as essential references during the construction process. These diagrams provide precise guidance, ensuring that the project progresses smoothly and in accordance with the design specifications.'
    },
    {
      icon: Eye,
      title: 'Supervision',
      subtitle: 'Overseeing Projects for Timely Execution, Quality, and Progress',
      description: 'Our experienced team takes on the crucial role of project supervision. We carefully observe and direct every aspect of the project, ensuring adherence to timelines, maintaining high-quality standards, and monitoring progress on-site. Through effective supervision, we guarantee successful project outcomes.'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Section Header */}
          <div className="mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tight">
              WHAT WE DO
            </h2>
            <div className="w-24 h-1 bg-black mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl">
              Our comprehensive approach ensures every project is executed with precision and creativity
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`group bg-white rounded-3xl p-8 lg:p-12 hover:bg-black transition-all duration-500 hover:scale-[1.02] ${
                  isInView ? 'animate-fade-in-up' : ''
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-black group-hover:bg-white rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-500">
                    <service.icon className="h-8 w-8 text-white group-hover:text-black transition-colors duration-500" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-black group-hover:text-white mb-4 transition-colors duration-500">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 group-hover:text-gray-300 font-medium mb-4 transition-colors duration-500">
                      {service.subtitle}
                    </p>
                    
                    <p className="text-gray-700 group-hover:text-gray-400 leading-relaxed transition-colors duration-500">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;