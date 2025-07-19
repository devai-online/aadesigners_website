import React from 'react';
import { Search, Palette, FileText, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Process = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const steps = [
    {
      icon: Search,
      number: "01",
      title: "Research & Discovery",
      description: "We begin by understanding your vision, lifestyle, and functional needs through comprehensive consultation and site analysis.",
      color: "from-gray-800 to-black"
    },
    {
      icon: Palette,
      number: "02", 
      title: "Design Development",
      description: "Our team creates detailed concepts, mood boards, and 3D visualizations to bring your space to life before construction begins.",
      color: "from-gray-700 to-gray-900"
    },
    {
      icon: FileText,
      number: "03",
      title: "Technical Documentation",
      description: "We produce precise technical drawings, specifications, and construction documents to ensure flawless execution.",
      color: "from-gray-600 to-gray-800"
    },
    {
      icon: Eye,
      number: "04",
      title: "Project Supervision",
      description: "Our experts oversee every detail of the construction process, ensuring quality, timeline adherence, and your complete satisfaction.",
      color: "from-gray-500 to-gray-700"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-40 left-20 w-72 h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-20"
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
          className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full opacity-15"
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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div 
            className="text-center mb-20"
            variants={itemVariants}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              OUR DESIGN
              <br />
              <span className="text-gray-600">PROCESS</span>
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-8" />
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              From initial concept to final execution, we guide you through every step of your design journey
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <step.icon className="h-8 w-8" />
                    </motion.div>
                    <div className="text-6xl font-bold text-gray-200">
                      {step.number}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-black">
                    {step.title}
                  </h3>
                  
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <motion.button
                    className="inline-flex items-center text-black font-medium hover:text-gray-700 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    Learn More
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </motion.button>
                </div>

                {/* Visual */}
                <motion.div 
                  className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-200 shadow-xl">
                    <img 
                      src={`https://images.pexels.com/photos/${
                        index === 0 ? '1571460' : 
                        index === 1 ? '1080721' : 
                        index === 2 ? '1643383' : '1457842'
                      }/pexels-photo-${
                        index === 0 ? '1571460' : 
                        index === 1 ? '1080721' : 
                        index === 2 ? '1643383' : '1457842'
                      }.jpeg`}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Floating Number */}
                  <motion.div 
                    className={`absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{ duration: 0.8, delay: index * 0.3 + 0.5 }}
                  >
                    {step.number}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="text-center mt-20 bg-black rounded-3xl p-12 text-white"
            variants={itemVariants}
          >
            <h3 className="text-3xl font-bold mb-6">
              Ready to Start Your Design Journey?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss your vision and create something extraordinary together
            </p>
            <motion.button
              className="bg-white text-black px-8 py-4 rounded-full font-medium tracking-wide hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule a Consultation
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;