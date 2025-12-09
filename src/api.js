import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const getProjects = () => api.get('/projects');
export const createProject = (data) => api.post('/projects', data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Clients API
export const getClients = () => api.get('/clients');
export const createClient = (data) => api.post('/clients', data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

// Contacts API
export const getContacts = () => api.get('/contacts');
export const createContact = (data) => api.post('/contacts', data);

// Newsletter API
export const getNewsletters = () => api.get('/newsletter');
export const subscribeNewsletter = (email) => api.post('/newsletter', { email });

export default api;
