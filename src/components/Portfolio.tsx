import React, { useState } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  year: string;
}

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Load projects from localStorage or use defaults
  React.useEffect(() => {
    const savedProjects = localStorage.getItem('adminProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Default projects
      const defaultProjects: Project[] = [
        {
          id: '1',
          title: "Modern Penthouse",
          category: "residential",
          image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
          description: "Luxury penthouse with panoramic city views",
          year: "2024"
        },
        {
          id: '2',
          title: "Corporate Headquarters",
          category: "commercial",
          image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
          description: "Contemporary office space design",
          year: "2023"
        },
        {
          id: '3',
          title: "Boutique Hotel",
          category: "hospitality",
          image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
          description: "Elegant hotel interior with local influences",
          year: "2024"
        },
        {
          id: '4',
          title: "Family Villa",
          category: "residential",
          image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
          description: "Spacious family home with garden views",
          year: "2023"
        },
        {
          id: '5',
          title: "Restaurant Design",
          category: "hospitality",
          image: "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg",
          description: "Fine dining restaurant with intimate atmosphere",
          year: "2024"
        },
        {
          id: '6',
          title: "Tech Startup Office",
          category: "commercial",
          image: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg",
          description: "Creative workspace for innovation",
          year: "2023"
        }
      ];
      setProjects(defaultProjects);
    }
  }, []);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'hospitality', label: 'Hospitality' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
              FEATURED
              <br />
              <span className="text-gray-600">PROJECTS</span>
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
              Explore our portfolio of transformative spaces that blend innovation with timeless design
            </motion.p>
          </div>

          {/* Filter Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                whileHover={{ y: -10 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <motion.button
                      className="bg-white text-black px-6 py-3 rounded-full font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>View Project</span>
                      <ExternalLink className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-black group-hover:text-gray-700 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <span className="text-sm text-gray-500 font-medium">
                      {project.year}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex items-center text-black group-hover:text-gray-700 transition-colors duration-300">
                    <span className="text-sm font-medium">Learn More</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Button */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.button
              className="bg-black text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300 inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View All Projects</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;