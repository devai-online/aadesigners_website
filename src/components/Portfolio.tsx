import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { projectsAPI } from '../services/api';

interface Project {
  id: string;
  title: string;
  category: string;
  image_path: string | null;
  description: string;
  year: string;
}

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Load projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await projectsAPI.getAll();
        setProjects(data);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects');
        // Fallback to default projects
        const defaultProjects: Project[] = [
          {
            id: '1',
            title: "Modern Penthouse",
            category: "residential",
            image_path: null,
            description: "Luxury penthouse with panoramic city views",
            year: "2024"
          },
          {
            id: '2',
            title: "Corporate Headquarters",
            category: "commercial",
            image_path: null,
            description: "Contemporary office space design",
            year: "2023"
          },
          {
            id: '3',
            title: "Boutique Hotel",
            category: "hospitality",
            image_path: null,
            description: "Elegant hotel interior with local influences",
            year: "2024"
          },
          {
            id: '4',
            title: "Family Villa",
            category: "residential",
            image_path: null,
            description: "Spacious family home with garden views",
            year: "2023"
          },
          {
            id: '5',
            title: "Restaurant Design",
            category: "hospitality",
            image_path: null,
            description: "Fine dining restaurant with intimate atmosphere",
            year: "2024"
          },
          {
            id: '6',
            title: "Tech Startup Office",
            category: "commercial",
            image_path: null,
            description: "Creative workspace for innovation",
            year: "2023"
          }
        ];
        setProjects(defaultProjects);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
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

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

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
                    src={project.image_path 
                      ? `http://localhost:3001${project.image_path}`
                      : "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
                    }
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
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 capitalize bg-gray-100 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                    <motion.button
                      className="text-black hover:text-gray-700 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Projects Button */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.button
              className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300 flex items-center space-x-2 mx-auto"
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