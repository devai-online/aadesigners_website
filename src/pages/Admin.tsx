import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Star, Lock, Eye, EyeOff } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
  project: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  year: string;
}

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

// Login form component moved outside to prevent recreation
const LoginForm = ({ 
  password, 
  setPassword, 
  loginError, 
  handleLogin 
}: {
  password: string;
  setPassword: (value: string) => void;
  loginError: string;
  handleLogin: (e: React.FormEvent) => void;
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full mx-4">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Admin Access</h1>
          <p className="text-gray-600">Enter password to access the dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
              placeholder="Enter admin password"
              required
              autoComplete="current-password"
            />
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{loginError}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Access Dashboard
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            AA Designer Studio - Secure Admin Panel
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Admin password - you can change this to your preferred password
  const ADMIN_PASSWORD = 'aadesigner2024';

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<'testimonials' | 'projects' | 'blog'>('testimonials');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Check if user is already authenticated (session storage)
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTestimonials = localStorage.getItem('adminTestimonials');
    const savedProjects = localStorage.getItem('adminProjects');
    const savedBlogPosts = localStorage.getItem('adminBlogPosts');

    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials));
    } else {
      // Default testimonials
      const defaultTestimonials: Testimonial[] = [
        {
          id: '1',
          name: "Sarah Johnson",
          role: "Homeowner",
          image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
          rating: 5,
          text: "AA Designer Studio transformed our home into a masterpiece. Their attention to detail and understanding of our vision was exceptional.",
          project: "Modern Family Home"
        },
        {
          id: '2',
          name: "Michael Chen",
          role: "Business Owner",
          image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
          rating: 5,
          text: "The team's professionalism and creativity exceeded our expectations. They created a workspace that enhances productivity.",
          project: "Corporate Office Design"
        }
      ];
      setTestimonials(defaultTestimonials);
      localStorage.setItem('adminTestimonials', JSON.stringify(defaultTestimonials));
    }

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
        }
      ];
      setProjects(defaultProjects);
      localStorage.setItem('adminProjects', JSON.stringify(defaultProjects));
    }

    if (savedBlogPosts) {
      setBlogPosts(JSON.parse(savedBlogPosts));
    } else {
      // Default blog posts
      const defaultBlogPosts: BlogPost[] = [
        {
          id: '1',
          title: "The Future of Interior Design: Sustainable Living Spaces",
          excerpt: "Explore how sustainable design practices are reshaping modern interiors and creating healthier living environments for the future.",
          content: "Sustainability in interior design is no longer just a trend—it's becoming a necessity. As we face environmental challenges, designers are reimagining spaces to be both beautiful and environmentally responsible.\n\nKey sustainable practices include:\n\n• Using reclaimed and recycled materials\n• Choosing low-VOC paints and finishes\n• Incorporating energy-efficient lighting\n• Selecting furniture from sustainable sources\n• Designing for longevity rather than trends\n\nAt AA Designer Studio, we believe that sustainable design doesn't mean compromising on style. Our approach integrates eco-friendly materials with cutting-edge design principles to create spaces that are both stunning and responsible.",
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
          content: "Urban living often means working with smaller spaces, but that doesn't mean sacrificing style or functionality. Here are our top strategies for maximizing small spaces:\n\n**Multi-functional Furniture**\nInvest in pieces that serve multiple purposes—ottomans with storage, expandable dining tables, and murphy beds.\n\n**Vertical Storage Solutions**\nUtilize wall space with floating shelves, tall bookcases, and wall-mounted desks.\n\n**Light and Color**\nUse light colors to make spaces feel larger, and incorporate mirrors to reflect light and create depth.\n\n**Smart Layout Planning**\nCreate zones within open spaces using furniture placement and area rugs to define different functional areas.",
          image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
          author: "Anjan & Mona",
          date: "2024-01-10",
          category: "tips",
          readTime: "4 min read",
          tags: ["Small Spaces", "Urban Living", "Space Planning"]
        }
      ];
      setBlogPosts(defaultBlogPosts);
      localStorage.setItem('adminBlogPosts', JSON.stringify(defaultBlogPosts));
    }
  }, []);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm 
      password={password} 
      setPassword={setPassword} 
      loginError={loginError} 
      handleLogin={handleLogin} 
    />;
  }

  // Save testimonials to localStorage
  const saveTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    localStorage.setItem('adminTestimonials', JSON.stringify(newTestimonials));
  };

  // Save projects to localStorage
  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('adminProjects', JSON.stringify(newProjects));
  };

  // Save blog posts to localStorage
  const saveBlogPosts = (newBlogPosts: BlogPost[]) => {
    setBlogPosts(newBlogPosts);
    localStorage.setItem('adminBlogPosts', JSON.stringify(newBlogPosts));
  };

  // Handle image upload (convert to base64 for demo)
  const handleImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  // Testimonial form component
  const TestimonialForm = ({ testimonial, onSave, onCancel }: {
    testimonial?: Testimonial;
    onSave: (testimonial: Testimonial) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<Testimonial>(
      testimonial || {
        id: Date.now().toString(),
        name: '',
        role: '',
        image: '',
        rating: 5,
        text: '',
        project: ''
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const imageUrl = await handleImageUpload(file);
        setFormData({ ...formData, image: imageUrl });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">
              {testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Project</label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`p-1 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Testimonial Text</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profile Image</label>
              <div className="flex items-center space-x-4">
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Project form component
  const ProjectForm = ({ project, onSave, onCancel }: {
    project?: Project;
    onSave: (project: Project) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<Project>(
      project || {
        id: Date.now().toString(),
        title: '',
        category: 'residential',
        image: '',
        description: '',
        year: new Date().getFullYear().toString()
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const imageUrl = await handleImageUpload(file);
        setFormData({ ...formData, image: imageUrl });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">
              {project ? 'Edit Project' : 'Add New Project'}
            </h3>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="hospitality">Hospitality</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Project Image</label>
              <div className="space-y-4">
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 rounded-lg object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Blog post form component
  const BlogPostForm = ({ blogPost, onSave, onCancel }: {
    blogPost?: BlogPost;
    onSave: (blogPost: BlogPost) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<BlogPost>(
      blogPost || {
        id: Date.now().toString(),
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: 'Anjan & Mona',
        date: new Date().toISOString().split('T')[0],
        category: 'design',
        readTime: '5 min read',
        tags: []
      }
    );

    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const imageUrl = await handleImageUpload(file);
        setFormData({ ...formData, image: imageUrl });
      }
    };

    const addTag = () => {
      if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
        setTagInput('');
      }
    };

    const removeTag = (tagToRemove: string) => {
      setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">
              {blogPost ? 'Edit Blog Post' : 'Add New Blog Post'}
            </h3>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="design">Design</option>
                  <option value="tips">Tips & Tricks</option>
                  <option value="trends">Trends</option>
                  <option value="sustainability">Sustainability</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Read Time</label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="5 min read"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Featured Image</label>
              <div className="space-y-4">
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 rounded-lg object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Handle testimonial operations
  const handleAddTestimonial = (testimonial: Testimonial) => {
    const newTestimonials = [...testimonials, testimonial];
    saveTestimonials(newTestimonials);
    setShowAddForm(false);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    const newTestimonials = testimonials.map(t => t.id === testimonial.id ? testimonial : t);
    saveTestimonials(newTestimonials);
    setEditingItem(null);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const newTestimonials = testimonials.filter(t => t.id !== id);
      saveTestimonials(newTestimonials);
    }
  };

  // Handle project operations
  const handleAddProject = (project: Project) => {
    const newProjects = [...projects, project];
    saveProjects(newProjects);
    setShowAddForm(false);
  };

  const handleEditProject = (project: Project) => {
    const newProjects = projects.map(p => p.id === project.id ? project : p);
    saveProjects(newProjects);
    setEditingItem(null);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const newProjects = projects.filter(p => p.id !== id);
      saveProjects(newProjects);
    }
  };

  // Handle blog post operations
  const handleAddBlogPost = (blogPost: BlogPost) => {
    const newBlogPosts = [...blogPosts, blogPost];
    saveBlogPosts(newBlogPosts);
    setShowAddForm(false);
  };

  const handleEditBlogPost = (blogPost: BlogPost) => {
    const newBlogPosts = blogPosts.map(p => p.id === blogPost.id ? blogPost : p);
    saveBlogPosts(newBlogPosts);
    setEditingItem(null);
  };

  const handleDeleteBlogPost = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const newBlogPosts = blogPosts.filter(p => p.id !== id);
      saveBlogPosts(newBlogPosts);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-black mb-4">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your testimonials, projects, and blog posts</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              activeTab === 'testimonials'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Testimonials ({testimonials.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              activeTab === 'blog'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Blog Posts ({blogPosts.length})
          </button>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New {activeTab === 'testimonials' ? 'Testimonial' : activeTab === 'projects' ? 'Project' : 'Blog Post'}</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'testimonials' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <div className="flex space-x-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3 line-clamp-3">{testimonial.text}</p>
                <p className="text-xs text-gray-500 mb-4">{testimonial.project}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingItem(testimonial.id)}
                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'projects' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-black">{project.title}</h3>
                    <span className="text-sm text-gray-500">{project.year}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 capitalize">{project.category}</p>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingItem(project.id)}
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-black mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingItem(post.id)}
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlogPost(post.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Forms */}
        {showAddForm && activeTab === 'testimonials' && (
          <TestimonialForm
            onSave={handleAddTestimonial}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {showAddForm && activeTab === 'projects' && (
          <ProjectForm
            onSave={handleAddProject}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {showAddForm && activeTab === 'blog' && (
          <BlogPostForm
            onSave={handleAddBlogPost}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {editingItem && activeTab === 'testimonials' && (
          <TestimonialForm
            testimonial={testimonials.find(t => t.id === editingItem)}
            onSave={handleEditTestimonial}
            onCancel={() => setEditingItem(null)}
          />
        )}

        {editingItem && activeTab === 'projects' && (
          <ProjectForm
            project={projects.find(p => p.id === editingItem)}
            onSave={handleEditProject}
            onCancel={() => setEditingItem(null)}
          />
        )}

        {editingItem && activeTab === 'blog' && (
          <BlogPostForm
            blogPost={blogPosts.find(p => p.id === editingItem)}
            onSave={handleEditBlogPost}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;