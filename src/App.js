import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code, 
  User, 
  Briefcase, 
  Send,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Smooth scroll handler
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Portfolio Data
  const projects = [
    {
      title: "E-Commerce Dashboard",
      description: "A comprehensive analytics platform built with React and Tailwind, featuring real-time data visualization.",
      tags: ["React", "Chart.js", "Tailwind"],
      link: "#"
    },
    {
      title: "AI Content Generator",
      description: "A sleek interface for generating marketing copy using LLMs, integrated with a backend API.",
      tags: ["TypeScript", "Next.js", "API"],
      link: "#"
    },
    {
      title: "Portfolio Website",
      description: "The very site you are looking at! Clean, responsive, and optimized for performance.",
      tags: ["React", "Lucide Icons", "UI/UX"],
      link: "#"
    }
  ];

  const skills = [
    "JavaScript (ES6+)", "React.js", "Tailwind CSS", 
    "TypeScript", "Node.js", "Git & GitHub", 
    "Responsive Design", "UI/UX Principles"
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer" onClick={() => scrollTo('home')}>
            PORTFOLIO.
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 font-medium text-slate-600">
            {['home', 'about', 'projects', 'contact'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollTo(item)}
                className="hover:text-blue-600 transition-colors capitalize"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col p-4 space-y-4 font-medium">
              {['home', 'about', 'projects', 'contact'].map((item) => (
                <button key={item} onClick={() => scrollTo(item)} className="text-left capitalize">{item}</button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="mb-6 inline-block p-2 px-4 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
            Available for new opportunities
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            I build digital <span className="text-blue-600">experiences</span> that matter.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
            I'm a Frontend Developer focused on creating clean, user-friendly applications with modern web technologies.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => scrollTo('projects')}
              className="px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 group"
            >
              View My Work <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-3">
              <a href="#" className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all">
                <Github size={20} />
              </a>
              <a href="#" className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About & Skills */}
      <section id="about" className="py-24 bg-white px-4 border-y border-slate-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
              <User size={20} />
              <span>ABOUT ME</span>
            </div>
            <h2 className="text-3xl font-bold mb-6">A developer with a passion for problem-solving.</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              With over 3 years of experience in building web applications, I specialize in React and modern CSS frameworks. I enjoy turning complex problems into simple, beautiful, and intuitive designs.
            </p>
            <p className="text-slate-600 leading-relaxed">
              When I'm not coding, you can find me exploring new UI trends, contributing to open-source projects, or learning about the latest developments in AI.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h3 className="text-xl font-bold mb-6">My Toolkit</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span 
                  key={skill} 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
            <Briefcase size={20} />
            <span>PROJECTS</span>
          </div>
          <h2 className="text-3xl font-bold mb-12">Recent Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden border border-slate-200 group hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                  <Code className="text-slate-400 group-hover:scale-110 transition-transform" size={48} />
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors"></div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                    {project.description}
                  </p>
                  <a href={project.link} className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    View Project <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-blue-600 font-bold mb-4">
            <Mail size={20} />
            <span>CONTACT</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">Let's build something together.</h2>
          <p className="text-slate-600 mb-12">
            Interested in working together or just want to say hi? Feel free to reach out via email or through the form below.
          </p>
          
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-left shadow-sm">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Tell me about your project..."></textarea>
              </div>
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} MyPortfolio. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Github size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Mail size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
