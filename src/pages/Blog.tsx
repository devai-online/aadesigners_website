import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Load blog posts from localStorage or use defaults
  useEffect(() => {
    const savedPosts = localStorage.getItem('adminBlogPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Default blog posts
      const defaultPosts: BlogPost[] = [
        {
          id: '1',
          title: "The Future of Interior Design: Sustainable Living Spaces",
          excerpt: "Explore how sustainable design practices are reshaping modern interiors and creating healthier living environments for the future.",
          content: "Full blog content here...",
          image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
          author: "Anjan & Mona",
          date: "2024-01-15",
          category: "sustainability",
          readTime: "5 min read",
          tags: ["Sustainability", "Modern Design", "Eco-Friendly"]
        },
        {
          id: '2',
          title: "Maximizing Small Spaces: Design Tips for Urban Living",
          excerpt: "Discover innovative strategies to make the most of compact living spaces without compromising on style or functionality.",
          content: "Full blog content here...",
          image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
          author: "Anjan & Mona",
          date: "2024-01-10",
          category: "tips",
          readTime: "4 min read",
          tags: ["Small Spaces", "Urban Living", "Space Planning"]
        },
        {
          id: '3',
          title: "Color Psychology in Interior Design: Creating Mood Through Palette",
          excerpt: "Learn how different colors affect emotions and how to use color psychology to create the perfect atmosphere in your space.",
          content: "Full blog content here...",
          image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
          author: "Anjan & Mona",
          date: "2024-01-05",
          category: "design",
          readTime: "6 min read",
          tags: ["Color Theory", "Psychology", "Interior Design"]
        },
        {
          id: '4',
          title: "2024 Interior Design Trends: What's Hot This Year",
          excerpt: "Stay ahead of the curve with the latest interior design trends that are defining spaces in 2024.",
          content: "Full blog content here...",
          image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
          author: "Anjan & Mona",
          date: "2024-01-01",
          category: "trends",
          readTime: "7 min read",
          tags: ["Trends", "2024", "Modern Design"]
        },
        {
          id: '5',
          title: "Lighting Design: The Art of Illuminating Your Space",
          excerpt: "Master the fundamentals of lighting design to create ambiance, highlight features, and enhance functionality.",
          content: "Full blog content here...",
          image: "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg",
          author: "Anjan & Mona",
          date: "2023-12-28",
          category: "design",
          readTime: "5 min read",
          tags: ["Lighting", "Ambiance", "Design Fundamentals"]
        },
        {
          id: '6',
          title: "Commercial Space Design: Creating Productive Work Environments",
          excerpt: "Explore how thoughtful commercial design can boost productivity, employee satisfaction, and business success.",
          content: "Full blog content here...",
          image: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg",
          author: "Anjan & Mona",
          date: "2023-12-25",
          category: "commercial",
          readTime: "8 min read",
          tags: ["Commercial Design", "Productivity", "Workplace"]
        }
      ];
      setPosts(defaultPosts);
    }
  }, []);

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'design', label: 'Design' },
    { id: 'tips', label: 'Tips & Tricks' },
    { id: 'trends', label: 'Trends' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'commercial', label: 'Commercial' }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

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
              DESIGN
              <br />
              <span className="text-gray-600">INSIGHTS</span>
            </h1>
            <div className="w-24 h-1 bg-black mb-8"></div>
            <p className="text-xl text-gray-700 max-w-4xl leading-relaxed">
              Discover the latest trends, tips, and insights from the world of interior design. 
              Our blog shares expert knowledge to inspire your next project.
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-16"
            variants={itemVariants}
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Featured Post */}
          {filteredPosts.length > 0 && (
            <motion.div 
              className="mb-16"
              variants={itemVariants}
            >
              <div className="bg-gray-50 rounded-3xl overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="aspect-[4/3] lg:aspect-auto">
                    <img 
                      src={filteredPosts[0].image}
                      alt={filteredPosts[0].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                        Featured
                      </span>
                      <span className="text-gray-500 text-sm capitalize">
                        {filteredPosts[0].category}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-black mb-4 leading-tight">
                      {filteredPosts[0].title}
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {filteredPosts[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{filteredPosts[0].author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(filteredPosts[0].date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{filteredPosts[0].readTime}</span>
                        </div>
                      </div>
                      <motion.button
                        className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300 flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Read More</span>
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Blog Posts Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {filteredPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                whileHover={{ y: -10 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <motion.button
                      className="text-black font-medium hover:text-gray-700 transition-colors duration-300 flex items-center space-x-1"
                      whileHover={{ x: 5 }}
                    >
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <motion.div 
              className="text-center py-20"
              variants={itemVariants}
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Posts Found</h3>
              <p className="text-gray-600 mb-8">
                No blog posts match the selected category. Try selecting a different category.
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300"
              >
                View All Posts
              </button>
            </motion.div>
          )}

          {/* Newsletter Signup */}
          <motion.div 
            className="mt-20 bg-black rounded-3xl p-12 text-white text-center"
            variants={itemVariants}
          >
            <h3 className="text-3xl font-bold mb-6">
              Stay Updated with Design Insights
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss the latest design trends, 
              tips, and project showcases.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full text-black focus:outline-none"
              />
              <motion.button
                className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;