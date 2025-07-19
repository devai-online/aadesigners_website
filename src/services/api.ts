const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  return response.json();
};

// Helper function to create FormData for file uploads
const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (key === 'tags' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === 'image' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (key !== 'image') {
        formData.append(key, data[key]);
      }
    }
  });
  return formData;
};

// Testimonials API
export const testimonialsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/testimonials`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`);
    return handleResponse(response);
  },

  create: async (testimonial) => {
    const formData = createFormData(testimonial);
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  update: async (id, testimonial) => {
    const formData = createFormData(testimonial);
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'PUT',
      body: formData,
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    return handleResponse(response);
  },

  create: async (project) => {
    const formData = createFormData(project);
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  update: async (id, project) => {
    const formData = createFormData(project);
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      body: formData,
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Blog Posts API
export const blogAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/blog`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`);
    return handleResponse(response);
  },

  create: async (blogPost) => {
    const formData = createFormData(blogPost);
    const response = await fetch(`${API_BASE_URL}/blog`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  update: async (id, blogPost) => {
    const formData = createFormData(blogPost);
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: 'PUT',
      body: formData,
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
}; 