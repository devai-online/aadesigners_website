import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_path: string | null;
  author: string;
  date: string;
  category: string;
  read_time: string;
  tags: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Load blog posts from API
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await blogAPI.getAll();
        setPosts(data);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Failed to load blog posts');
        // Fallback to default blog posts
        const defaultPosts: BlogPost[] = [
          {
            id: '1',
            title: "The Future of Interior Design: Sustainable Living Spaces",
            excerpt: "Explore how sustainable design practices are reshaping modern interiors and creating healthier living environments for the future.",
            content: "Full blog content here...",
            image_path: null,
            author: "Anjan & Mona",
            date: "2024-01-15",
            category: "sustainability",
            read_time: "5 min read",
            tags: JSON.stringify(["Sustainability", "Modern Design", "Eco-Friendly"])
          },
          {
            id: '2',
            title: "Maximizing Small Spaces: Design Tips for Urban Living",
            excerpt: "Discover innovative strategies to make the most of compact living spaces without compromising on style or functionality.",
            content: "Full blog content here...",
            image_path: null,
            author: "Anjan & Mona",
            date: "2024-01-10",
            category: "tips",
            read_time: "4 min read",
            tags: JSON.stringify(["Small Spaces", "Urban Living", "Space Planning"])
          },
          {
            id: '3',
            title: "Color Psychology in Interior Design: Creating Mood Through Palette",
            excerpt: "Learn how different colors affect emotions and how to use color psychology to create the perfect atmosphere in your space.",
            content: "Full blog content here...",
            image_path: null,
            author: "Anjan & Mona",
            date: "2024-01-05",
            category: "design",
            read_time: "6 min read",
            tags: JSON.stringify(["Color Theory", "Psychology", "Interior Design"])
          },
          {
            id: '4',
            title: "2024 Interior Design Trends: What's Hot This Year",
            excerpt: "Stay ahead of the curve with the latest interior design trends that are defining spaces in 2024.",
            content: "Full blog content here...",
            image_path: null,
            author: "Anjan & Mona",
            date: "2024-01-01",
            category: "trends",
            read_time: "7 min read",
            tags: JSON.stringify(["Trends", "2024", "Modern Design"])
          },
          {
            id: '5',
            title: "Lighting Design: The Art of Illuminating Your Space",
            excerpt: "Master the fundamentals of lighting design to create ambiance, highlight features, and enhance functionality.",
            content: "Full blog content here...",
            image_path: null,
            author: "Anjan & Mona",
            date: "2023-12-28",
            category: "design",
            read_time: "5 min read",
            tags: JSON.stringify(["Lighting", "Ambiance", "Design Fundamentals"])
          },
          {
            id: '6',
            title: "Commercial Space Design: Creating Productive Work Environments",
            excerpt: "Explore how thoughtful commercial design can boost productivity, employee satisfaction, and business success.",
            content: "Full blog content here...",
            image_path: null,
            author: "Anjan & Mona",
            date: "2023-12-25",
            category: "commercial",
            read_time: "8 min read",
            tags: JSON.stringify(["Commercial Design", "Productivity", "Workplace"])
          }
        ];
        setPosts(defaultPosts);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
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
        ease: "easeOut" as const
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 lg:p-12 shadow-lg">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
                    <img 
                      src={filteredPosts[0].image_path 
                        ? `${import.meta.env.VITE_API_BASE_URL}${filteredPosts[0].image_path}`
                        : "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
                      }
                      alt={filteredPosts[0].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="bg-gray-200 px-3 py-1 rounded-full capitalize">
                        {filteredPosts[0].category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(filteredPosts[0].date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-black leading-tight">
                      {filteredPosts[0].title}
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {filteredPosts[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{filteredPosts[0].author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{filteredPosts[0].read_time}</span>
                        </div>
                      </div>
                      <Link
                        to={`/blog/${filteredPosts[0].id}`}
                        className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300 flex items-center space-x-2"
                      >
                        <span>Read More</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Blog Posts Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={itemVariants}
          >
            {filteredPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group"
                whileHover={{ y: -10 }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={post.image_path 
                      ? `${import.meta.env.VITE_API_BASE_URL}${post.image_path}`
                      : "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
                    }
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{post.read_time}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-black hover:text-gray-700 transition-colors duration-300"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Load More Button */}
          {filteredPosts.length > 6 && (
            <motion.div 
              className="text-center mt-12"
              variants={itemVariants}
            >
              <motion.button
                className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300 flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Load More Posts</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;