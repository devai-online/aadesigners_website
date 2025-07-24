import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Star, Lock, Eye, EyeOff } from 'lucide-react';
import { testimonialsAPI, projectsAPI, blogAPI } from '../services/api';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image_path: string | null;
  image?: File; // For form handling
  rating: number;
  text: string;
  project: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  image_path: string | null;
  images?: File[]; // For form handling - multiple files
  description: string;
  year: string;
  location?: string;
  imagesData?: string; // JSON string from database
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_path: string | null;
  image?: File; // For form handling
  author: string;
  date: string;
  category: string;
  read_time: string;
  tags: string;
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
  
  // Admin password is now stored securely in backend environment variables

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<'testimonials' | 'projects' | 'blog'>('testimonials');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated (session storage)
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load data from API when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [testimonialsData, projectsData, blogData] = await Promise.all([
          testimonialsAPI.getAll(),
          projectsAPI.getAll(),
          blogAPI.getAll()
        ]);
        
        setTestimonials(testimonialsData);
        setProjects(projectsData);
        setBlogPosts(blogData);
      } catch (err) {
        setError('Failed to load data. Please check if the backend server is running.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminToken', data.token);
        setLoginError('');
      } else {
        setLoginError('Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Connection error. Please check if the backend server is running.');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      sessionStorage.removeItem('adminAuthenticated');
      sessionStorage.removeItem('adminToken');
      setPassword('');
    }
  };

  // Handle testimonial operations
  const handleAddTestimonial = async (testimonial: Testimonial) => {
    try {
      const newTestimonial = await testimonialsAPI.create(testimonial);
      setTestimonials([...testimonials, newTestimonial]);
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add testimonial');
      console.error('Error adding testimonial:', err);
    }
  };

  const handleEditTestimonial = async (testimonial: Testimonial) => {
    try {
      const updatedTestimonial = await testimonialsAPI.update(testimonial.id, testimonial);
      setTestimonials(testimonials.map(t => t.id === testimonial.id ? updatedTestimonial : t));
      setEditingItem(null);
    } catch (err) {
      setError('Failed to update testimonial');
      console.error('Error updating testimonial:', err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await testimonialsAPI.delete(id);
        setTestimonials(testimonials.filter(t => t.id !== id));
      } catch (err) {
        setError('Failed to delete testimonial');
        console.error('Error deleting testimonial:', err);
      }
    }
  };

  // Handle project operations
  const handleAddProject = async (project: Project) => {
    try {
      const newProject = await projectsAPI.create(project);
      setProjects([...projects, newProject]);
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add project');
      console.error('Error adding project:', err);
    }
  };

  const handleEditProject = async (project: Project) => {
    try {
      const updatedProject = await projectsAPI.update(project.id, project);
      setProjects(projects.map(p => p.id === project.id ? updatedProject : p));
      setEditingItem(null);
    } catch (err) {
      setError('Failed to update project');
      console.error('Error updating project:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        setError('Failed to delete project');
        console.error('Error deleting project:', err);
      }
    }
  };

  // Handle blog post operations
  const handleAddBlogPost = async (blogPost: BlogPost) => {
    try {
      const newBlogPost = await blogAPI.create(blogPost);
      setBlogPosts([...blogPosts, newBlogPost]);
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add blog post');
      console.error('Error adding blog post:', err);
    }
  };

  const handleEditBlogPost = async (blogPost: BlogPost) => {
    try {
      const updatedBlogPost = await blogAPI.update(blogPost.id, blogPost);
      setBlogPosts(blogPosts.map(p => p.id === blogPost.id ? updatedBlogPost : p));
      setEditingItem(null);
    } catch (err) {
      setError('Failed to update blog post');
      console.error('Error updating blog post:', err);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogAPI.delete(id);
        setBlogPosts(blogPosts.filter(p => p.id !== id));
      } catch (err) {
        setError('Failed to delete blog post');
        console.error('Error deleting blog post:', err);
      }
    }
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
        image_path: null,
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
        setFormData({ ...formData, image: file });
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
                {(formData.image_path || formData.image) && (
                  <img
                    src={formData.image_path || (formData.image instanceof File ? URL.createObjectURL(formData.image) : '')}
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
        image_path: null,
        images: [], // Initialize images as empty array
        description: '',
        year: new Date().getFullYear().toString(),
        location: 'Hyderabad'
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        setFormData({ ...formData, images: files });
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="e.g., Hyderabad"
                />
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
                </select>
              </div>
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
              <label className="block text-sm font-medium mb-2">Project Images (Multiple)</label>
              <div className="space-y-4">
                {/* Preview existing images */}
                {formData.image_path && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${formData.image_path}`}
                      alt="Main Preview"
                      className="w-full h-32 rounded-lg object-cover"
                    />
                  </div>
                )}
                
                {/* Preview new selected images */}
                {formData.images && Array.isArray(formData.images) && formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">You can select multiple images. The first image will be used as the main thumbnail.</p>
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
        image_path: null,
        author: 'Anjan & Mona',
        date: new Date().toISOString().split('T')[0],
        category: 'design',
        read_time: '5 min read',
        tags: '[]'
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
        setFormData({ ...formData, image: file });
      }
    };

    const addTag = () => {
      if (tagInput.trim()) {
        const currentTags = JSON.parse(formData.tags || '[]');
        if (!currentTags.includes(tagInput.trim())) {
          const newTags = [...currentTags, tagInput.trim()];
          setFormData({ ...formData, tags: JSON.stringify(newTags) });
          setTagInput('');
        }
      }
    };

    const removeTag = (tagToRemove: string) => {
      const currentTags = JSON.parse(formData.tags || '[]');
      const newTags = currentTags.filter((tag: string) => tag !== tagToRemove);
      setFormData({ ...formData, tags: JSON.stringify(newTags) });
    };

    const currentTags = JSON.parse(formData.tags || '[]');

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

            <div>
              <label className="block text-sm font-medium mb-2">Blog Image</label>
              <div className="space-y-4">
                {(formData.image_path || formData.image) && (
                  <img
                    src={formData.image_path || (formData.image instanceof File ? URL.createObjectURL(formData.image) : '')}
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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="design">Design</option>
                  <option value="sustainability">Sustainability</option>
                  <option value="tips">Tips</option>
                  <option value="trends">Trends</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Read Time</label>
                <input
                  type="text"
                  value={formData.read_time}
                  onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentTags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      ×
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
                  placeholder="Add a tag"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Add
                </button>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

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

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

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
                    src={testimonial.image_path ? `${import.meta.env.VITE_API_BASE_URL}${testimonial.image_path}` : "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"}
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
            {projects.map((project) => {
              let images: string[] = [];
              try {
                images = project.imagesData ? JSON.parse(project.imagesData) : (project.image_path ? [project.image_path] : []);
              } catch (e) {
                images = project.image_path ? [project.image_path] : [];
              }
              const imageSrc = project.image_path 
                ? `${import.meta.env.VITE_API_BASE_URL}${project.image_path}` 
                : (images.length > 0 ? `${import.meta.env.VITE_API_BASE_URL}${images[0]}` : "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg");
              
              return (
                <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
                  <div className="relative">
                    <img
                      src={imageSrc}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    {images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        {images.length} images
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-black">{project.title}</h3>
                      <span className="text-sm text-gray-500">{project.year}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 capitalize">{project.category}</p>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{project.description}</p>
                    {project.location && (
                      <p className="text-xs text-gray-500 mb-2">📍 {project.location}</p>
                    )}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingItem(project.id)}
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg"
                        title="Edit Project"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
                <img
                  src={post.image_path ? `${import.meta.env.VITE_API_BASE_URL}${post.image_path}` : "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"}
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
                    <span>{post.read_time}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {JSON.parse(post.tags || '[]').slice(0, 3).map((tag: string, index: number) => (
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