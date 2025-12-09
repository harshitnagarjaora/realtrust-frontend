import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, DollarSign, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import { getProjects, getClients, createContact, subscribeNewsletter } from '../api';

function LandingPage() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [toast, setToast] = useState(null);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    full_name: '',
    email: '',
    mobile: '',
    city: ''
  });
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, clientsRes] = await Promise.all([
        getProjects(),
        getClients()
      ]);
      setProjects(projectsRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      // Use sample data if API fails
      setProjects(sampleProjects);
      setClients(sampleClients);
    }
  };

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  // Scroll function for projects and clients
  const scrollContainer = (section, direction) => {
    const container = document.getElementById(`${section}-scroll`);
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact(contactForm);
      showToast('Thank you! We will contact you soon.');
      setContactForm({ full_name: '', email: '', mobile: '', city: '' });
    } catch (err) {
      showToast('Something went wrong. Please try again.', true);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await subscribeNewsletter(newsletterEmail);
      showToast('Successfully subscribed!');
      setNewsletterEmail('');
    } catch (err) {
      showToast('Something went wrong. Please try again.', true);
    }
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path d="M9 22V12h6v10" />
          </svg>
          <span>Real</span>
          <span>Trust</span>
        </div>
        <div className="nav-links">
          <a href="#home" className="active">HOME</a>
          <a href="#services">SERVICES</a>
          <a href="#projects">ABOUT PROJECTS</a>
          <a href="#testimonials">TESTIMONIALS</a>
          <Link to="/admin" className="nav-btn">CONTACT</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-overlay-text">
          <h1>Consultation,</h1>
          <h1>Design,</h1>
          <h1 className="orange">& Marketing</h1>
        </div>
        
        <div className="hero-form">
          <h3>Get a Free<br/>Consultation</h3>
          <form onSubmit={handleContactSubmit}>
            <input 
              type="text" 
              placeholder="Full Name"
              value={contactForm.full_name}
              onChange={(e) => setContactForm({...contactForm, full_name: e.target.value})}
              required
            />
            <input 
              type="email" 
              placeholder="Enter Email Address"
              value={contactForm.email}
              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
              required
            />
            <input 
              type="tel" 
              placeholder="Mobile Number"
              value={contactForm.mobile}
              onChange={(e) => setContactForm({...contactForm, mobile: e.target.value})}
              required
            />
            <input 
              type="text" 
              placeholder="Area, City"
              value={contactForm.city}
              onChange={(e) => setContactForm({...contactForm, city: e.target.value})}
              required
            />
            <button type="submit">Get Quick Quote</button>
          </form>
        </div>
      </section>

      {/* Not Your Average Realtor */}
      <section className="realtor-section">
        <div className="realtor-text">
          <h2>Not Your Average Realtor</h2>
          <p>
            Real Trust has an eye for staging properties, standout 
            award-winning design, and effective marketing to get 
            homeowners top dollar on the market.
          </p>
        </div>
        <div className="realtor-images">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" alt="Realtor 1" />
          <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" alt="Realtor 2" />
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" alt="Realtor 3" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose" id="services">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="section-divider"></div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Home size={24} />
            </div>
            <h3>Potential ROI</h3>
            <p>Whether you're looking to buy a fix-n-flipper or maximize your current home for sale, we'll walk you through potential return for properties.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Briefcase size={24} />
            </div>
            <h3>Design</h3>
            <p>In a changing, active interior design market, the perfect guide through your design options and outstanding contractors to accentuate the home design.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <DollarSign size={24} />
            </div>
            <h3>Marketing</h3>
            <p>Finding new clientele, perfect tenants and proven ROI is a sophisticated digital marketing plan to accompany every listing to match tenants & buyers.</p>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="about-section">
        <div className="about-images">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300" alt="About 1" />
          <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300" alt="About 2" />
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300" alt="About 3" />
        </div>
        <h2 className="section-title">About Us</h2>
        <div className="section-divider"></div>
        <div className="about-text">
          <p>
            Fifteen years of experience in real estate, excellent customer service and a 
            commitment to work hard, listen and follow through. We provide quality service to 
            build relationships with clients and, more importantly, maintain those relationships 
            by communicating effectively.
          </p>
          <a href="#contact" className="learn-more-btn">LEARN MORE</a>
        </div>
      </section>

      {/* Our Projects */}
      <section className="projects-section" id="projects">
        <h2 className="section-title">Our Projects</h2>
        <p className="section-subtitle">
          We know what buyers are looking for and suggest projects that will bring 
          clients top dollar for the sale of their homes.
        </p>
        <div className="scroll-container">
          <button 
            className="scroll-btn scroll-left" 
            onClick={() => scrollContainer('projects', 'left')}
          >
            ‹
          </button>
          <div className="projects-grid" id="projects-scroll">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="project-image"
                />
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <span className="read-more-btn">READ MORE</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="scroll-btn scroll-right" 
            onClick={() => scrollContainer('projects', 'right')}
          >
            ›
          </button>
        </div>
      </section>

      {/* Happy Clients */}
      <section className="clients-section" id="testimonials">
        <h2 className="section-title">Happy Clients</h2>
        <div className="section-divider"></div>
        <div className="scroll-container">
          <button 
            className="scroll-btn scroll-left" 
            onClick={() => scrollContainer('clients', 'left')}
          >
            ‹
          </button>
          <div className="clients-grid" id="clients-scroll">
            {clients.map((client) => (
              <div key={client.id} className="client-card">
                <img 
                  src={client.image} 
                  alt={client.name}
                  className="client-image"
                />
                <p>{client.description}</p>
                <h4>{client.name}</h4>
                <span>{client.designation}</span>
              </div>
            ))}
          </div>
          <button 
            className="scroll-btn scroll-right" 
            onClick={() => scrollContainer('clients', 'right')}
          >
            ›
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>
          Learn more about our listing process, as well as our<br/>
          additional staging and design work.
        </h2>
        <a href="#contact" className="cta-btn">LEARN MORE</a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#projects">Projects</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact">Contact</a>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <span style={{ color: 'white', marginRight: '1rem' }}>Subscribe Us</span>
            <input 
              type="email" 
              placeholder="Enter Email Address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </footer>
      
      <div className="footer-bottom">
        <p>All Rights Reserved 2023</p>
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path d="M9 22V12h6v10" />
          </svg>
          <span>Real</span>
          <span style={{ color: '#6b7280' }}>Trust</span>
        </div>
        <div className="social-links">
          <a href="#"><Twitter size={16} /></a>
          <a href="#"><Instagram size={16} /></a>
          <a href="#"><Facebook size={16} /></a>
          <a href="#"><Linkedin size={16} /></a>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.isError ? 'error' : ''}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

// Sample data for fallback
const sampleProjects = [
  { id: 1, name: 'Consultation', description: 'Project Name, Location', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=450&h=350&fit=crop' },
  { id: 2, name: 'Design', description: 'Project Name, Location', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=450&h=350&fit=crop' },
  { id: 3, name: 'Marketing & Design', description: 'Project Name, Location', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=450&h=350&fit=crop' },
  { id: 4, name: 'Consultation & Marketing', description: 'Project Name, Location', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=450&h=350&fit=crop' },
  { id: 5, name: 'Consultation', description: 'Project Name, Location', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=450&h=350&fit=crop' }
];

const sampleClients = [
  { id: 1, name: 'Rowhan Smith', description: 'Real Trust helped us sell our home 20% above asking price. Their marketing strategy and staging expertise made all the difference!', designation: 'CEO, Foreclosure', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
  { id: 2, name: 'Shipra Kayak', description: 'From consultation to closing, the team was incredibly professional. They found our dream home within two weeks!', designation: 'Brand Designer', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face' },
  { id: 3, name: 'John Lepore', description: 'Outstanding service! Their design recommendations transformed our property and attracted multiple offers on the first day.', designation: 'CEO, Foreclosure', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
  { id: 4, name: 'Marry Freeman', description: 'The best real estate experience we have ever had. They truly understand the market and deliver exceptional results.', designation: 'Marketing Manager at Mixit', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
  { id: 5, name: 'Lucy Chen', description: 'Highly recommend Real Trust! They made buying our first home stress-free and guided us through every step of the process.', designation: 'Sales Rep at Alibaba', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face' }
];

export default LandingPage;
