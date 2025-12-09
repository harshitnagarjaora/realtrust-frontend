import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, FolderOpen, Users, MessageSquare, Mail, 
  Plus, Trash2, Upload, ArrowLeft 
} from 'lucide-react';
import { 
  getProjects, createProject, deleteProject,
  getClients, createClient, deleteClient,
  getContacts, getNewsletters
} from '../api';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  
  // Data states
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  
  // Form states
  const [projectForm, setProjectForm] = useState({ name: '', description: '', image: '' });
  const [clientForm, setClientForm] = useState({ name: '', description: '', designation: '', image: '' });
  const [projectPreview, setProjectPreview] = useState('');
  const [clientPreview, setClientPreview] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [projRes, clientRes, contactRes, newsRes] = await Promise.all([
        getProjects().catch(() => ({ data: [] })),
        getClients().catch(() => ({ data: [] })),
        getContacts().catch(() => ({ data: [] })),
        getNewsletters().catch(() => ({ data: [] }))
      ]);
      setProjects(projRes.data);
      setClients(clientRes.data);
      setContacts(contactRes.data);
      setNewsletters(newsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  // Image handling
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'project') {
          setProjectForm({ ...projectForm, image: reader.result });
          setProjectPreview(reader.result);
        } else {
          setClientForm({ ...clientForm, image: reader.result });
          setClientPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Project handlers
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(projectForm);
      showToast('Project added successfully!');
      setProjectForm({ name: '', description: '', image: '' });
      setProjectPreview('');
      loadAllData();
    } catch (err) {
      showToast('Failed to add project', true);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        showToast('Project deleted!');
        loadAllData();
      } catch (err) {
        showToast('Failed to delete project', true);
      }
    }
  };

  // Client handlers
  const handleClientSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClient(clientForm);
      showToast('Client added successfully!');
      setClientForm({ name: '', description: '', designation: '', image: '' });
      setClientPreview('');
      loadAllData();
    } catch (err) {
      showToast('Failed to add client', true);
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id);
        showToast('Client deleted!');
        loadAllData();
      } catch (err) {
        showToast('Failed to delete client', true);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue"><FolderOpen size={24} /></div>
                <div className="stat-info">
                  <h4>{projects.length}</h4>
                  <p>Total Projects</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange"><Users size={24} /></div>
                <div className="stat-info">
                  <h4>{clients.length}</h4>
                  <p>Happy Clients</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><MessageSquare size={24} /></div>
                <div className="stat-info">
                  <h4>{contacts.length}</h4>
                  <p>Contact Inquiries</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><Mail size={24} /></div>
                <div className="stat-info">
                  <h4>{newsletters.length}</h4>
                  <p>Newsletter Subscribers</p>
                </div>
              </div>
            </div>
            
            <div className="admin-card">
              <h3>Recent Contact Inquiries</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.slice(0, 5).map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.full_name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.mobile}</td>
                      <td>{contact.city}</td>
                      <td>{new Date(contact.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'projects':
        return (
          <>
            <div className="admin-card">
              <h3><Plus size={18} style={{ marginRight: '8px' }} />Add New Project</h3>
              <form className="admin-form" onSubmit={handleProjectSubmit}>
                <div>
                  <label>Project Name</label>
                  <input 
                    type="text" 
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea 
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    placeholder="Enter project description"
                    required
                  />
                </div>
                <div>
                  <label>Project Image</label>
                  <div 
                    className="image-upload"
                    onClick={() => document.getElementById('project-image').click()}
                  >
                    <input 
                      type="file" 
                      id="project-image"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'project')}
                    />
                    <Upload size={24} />
                    <p>Click to upload image</p>
                    {projectPreview && (
                      <img src={projectPreview} alt="Preview" className="image-preview" />
                    )}
                  </div>
                </div>
                <button type="submit">Add Project</button>
              </form>
            </div>

            <div className="admin-card">
              <h3>All Projects</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td><img src={project.image} alt={project.name} /></td>
                      <td>{project.name}</td>
                      <td>{project.description}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'clients':
        return (
          <>
            <div className="admin-card">
              <h3><Plus size={18} style={{ marginRight: '8px' }} />Add New Client</h3>
              <form className="admin-form" onSubmit={handleClientSubmit}>
                <div>
                  <label>Client Name</label>
                  <input 
                    type="text" 
                    value={clientForm.name}
                    onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div>
                  <label>Designation</label>
                  <input 
                    type="text" 
                    value={clientForm.designation}
                    onChange={(e) => setClientForm({...clientForm, designation: e.target.value})}
                    placeholder="e.g., CEO, Designer, Developer"
                    required
                  />
                </div>
                <div>
                  <label>Description/Testimonial</label>
                  <textarea 
                    value={clientForm.description}
                    onChange={(e) => setClientForm({...clientForm, description: e.target.value})}
                    placeholder="Enter client testimonial"
                    required
                  />
                </div>
                <div>
                  <label>Client Image</label>
                  <div 
                    className="image-upload"
                    onClick={() => document.getElementById('client-image').click()}
                  >
                    <input 
                      type="file" 
                      id="client-image"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'client')}
                    />
                    <Upload size={24} />
                    <p>Click to upload image</p>
                    {clientPreview && (
                      <img src={clientPreview} alt="Preview" className="image-preview" />
                    )}
                  </div>
                </div>
                <button type="submit">Add Client</button>
              </form>
            </div>

            <div className="admin-card">
              <h3>All Clients</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td><img src={client.image} alt={client.name} style={{ borderRadius: '50%' }} /></td>
                      <td>{client.name}</td>
                      <td>{client.designation}</td>
                      <td>{client.description.substring(0, 50)}...</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 'contacts':
        return (
          <div className="admin-card">
            <h3>Contact Form Submissions</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.full_name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.mobile}</td>
                    <td>{contact.city}</td>
                    <td>{new Date(contact.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length === 0 && (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                No contact submissions yet.
              </p>
            )}
          </div>
        );

      case 'newsletter':
        return (
          <div className="admin-card">
            <h3>Newsletter Subscribers</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email Address</th>
                  <th>Subscribed At</th>
                </tr>
              </thead>
              <tbody>
                {newsletters.map((sub, index) => (
                  <tr key={sub.id}>
                    <td>{index + 1}</td>
                    <td>{sub.email}</td>
                    <td>{new Date(sub.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {newsletters.length === 0 && (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                No subscribers yet.
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul className="admin-nav">
          <li>
            <a 
              href="#dashboard" 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </a>
          </li>
          <li>
            <a 
              href="#projects" 
              className={activeTab === 'projects' ? 'active' : ''}
              onClick={() => setActiveTab('projects')}
            >
              <FolderOpen size={20} />
              Projects
            </a>
          </li>
          <li>
            <a 
              href="#clients" 
              className={activeTab === 'clients' ? 'active' : ''}
              onClick={() => setActiveTab('clients')}
            >
              <Users size={20} />
              Clients
            </a>
          </li>
          <li>
            <a 
              href="#contacts" 
              className={activeTab === 'contacts' ? 'active' : ''}
              onClick={() => setActiveTab('contacts')}
            >
              <MessageSquare size={20} />
              Contacts
            </a>
          </li>
          <li>
            <a 
              href="#newsletter" 
              className={activeTab === 'newsletter' ? 'active' : ''}
              onClick={() => setActiveTab('newsletter')}
            >
              <Mail size={20} />
              Newsletter
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-header">
          <h1>
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'projects' && 'Project Management'}
            {activeTab === 'clients' && 'Client Management'}
            {activeTab === 'contacts' && 'Contact Submissions'}
            {activeTab === 'newsletter' && 'Newsletter Subscribers'}
          </h1>
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#3b82f6',
            textDecoration: 'none'
          }}>
            <ArrowLeft size={18} />
            Back to Website
          </Link>
        </div>

        {renderContent()}
      </main>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.isError ? 'error' : ''}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
