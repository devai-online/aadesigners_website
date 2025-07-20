import React, { useState, useEffect } from 'react';
import { Eye, Filter, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { projectsAPI } from '../services/api';
import ProjectModal from '../components/ProjectModal';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  year: string;
  location: string;
  image_path: string;
  images: string[];
}

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        // Parse images array for each project
        const projectsWithImages = data.map((project: any) => ({
          ...project,
          images: project.images ? JSON.parse(project.images) : [project.image_path]
        }));
        setProjects(projectsWithImages);
      } catch (err) {
        console.error('Error loading projects:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

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
        ease: "easeOut" as const
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
                    src={`http://localhost:3001${project.images[0]}`}
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

                  {/* Image Counter Badge */}
                  {project.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                      {project.images.length} images
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <motion.button
                      onClick={() => openProjectModal(project)}
                      className="bg-white text-black px-6 py-3 rounded-full font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Gallery</span>
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
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{project.location}</span>
                    </div>
                    <div className="text-sm font-medium text-black">
                      {project.year}
                    </div>
                  </div>

                  {/* View Gallery Button */}
                  <motion.button
                    onClick={() => openProjectModal(project)}
                    className="w-full bg-black text-white py-3 rounded-2xl font-medium hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Gallery ({project.images.length})</span>
                  </motion.button>
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

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeProjectModal}
      />
    </div>
  );
};

export default Projects;