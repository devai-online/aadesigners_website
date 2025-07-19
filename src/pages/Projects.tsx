import React, { useState, useEffect } from 'react';
import { ExternalLink, Filter, Calendar, MapPin } from 'lucide-react';
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

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Load projects from localStorage or use defaults
  useEffect(() => {
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
          description: "Luxury penthouse with panoramic city views featuring contemporary design elements and premium finishes throughout.",
          year: "2024"
        },
        {
          id: '2',
          title: "Corporate Headquarters",
          category: "commercial",
          image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
          description: "Contemporary office space design that promotes collaboration and productivity in a modern work environment.",
          year: "2023"
        },
        {
          id: '3',
          title: "Boutique Hotel",
          category: "hospitality",
          image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
          description: "Elegant hotel interior with local influences, creating a unique and memorable guest experience.",
          year: "2024"
        },
        {
          id: '4',
          title: "Family Villa",
          category: "residential",
          image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
          description: "Spacious family home with garden views, designed for comfort and modern living.",
          year: "2023"
        },
        {
          id: '5',
          title: "Restaurant Design",
          category: "hospitality",
          image: "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg",
          description: "Fine dining restaurant with intimate atmosphere, carefully crafted to enhance the culinary experience.",
          year: "2024"
        },
        {
          id: '6',
          title: "Tech Startup Office",
          category: "commercial",
          image: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg",
          description: "Creative workspace for innovation, designed to inspire creativity and foster collaboration.",
          year: "2023"
        },
        {
          id: '7',
          title: "Luxury Apartment",
          category: "residential",
          image: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg",
          description: "High-end apartment design with sophisticated finishes and thoughtful space planning.",
          year: "2024"
        },
        {
          id: '8',
          title: "Retail Showroom",
          category: "commercial",
          image: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg",
          description: "Modern retail space designed to showcase products and create an engaging shopping experience.",
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Page Header */}
          <motion.div 
            className="mb-20"
            variants={itemVariants}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-black mb-8 tracking-tight">
              OUR
              <br />
              <span className="text-gray-600">PROJECTS</span>
            </h1>
            <div className="w-24 h-1 bg-black mb-8"></div>
            <p className="text-xl text-gray-700 max-w-4xl leading-relaxed">
              Explore our comprehensive portfolio of transformative spaces. Each project represents 
              our commitment to exceptional design, innovative solutions, and client satisfaction.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-16"
            variants={itemVariants}
          >
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeFilter === filter.id
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="h-4 w-4" />
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Stats */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-16 bg-gray-50 rounded-3xl p-8"
            variants={itemVariants}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-2">{projects.length}</div>
              <div className="text-gray-600">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-2">
                {projects.filter(p => p.category === 'residential').length}
              </div>
              <div className="text-gray-600">Residential</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-2">
                {projects.filter(p => p.category === 'commercial').length}
              </div>
              <div className="text-gray-600">Commercial</div>
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                whileHover={{ y: -10 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {project.category}
                  </div>

                  {/* Year Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{project.year}</span>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <motion.button
                      className="bg-white text-black px-6 py-3 rounded-full font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>View Details</span>
                      <ExternalLink className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Hyderabad</span>
                    </div>
                    <div className="text-sm font-medium text-black">
                      {project.year}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div 
              className="text-center py-20"
              variants={itemVariants}
            >
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Projects Found</h3>
              <p className="text-gray-600 mb-8">
                No projects match the selected filter. Try selecting a different category.
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300"
              >
                View All Projects
              </button>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div 
            className="mt-20 bg-black rounded-3xl p-12 text-white text-center"
            variants={itemVariants}
          >
            <h3 className="text-3xl font-bold mb-6">
              Ready to Start Your Project?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss your vision and create something extraordinary together. 
              Every great space begins with a conversation.
            </p>
            <motion.button
              className="bg-white text-black px-8 py-4 rounded-full font-medium tracking-wide hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/#contact';
                }
              }}
            >
              Get In Touch
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;