import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Terminal, 
  Cpu, 
  Globe, 
  Layers,
  ChevronRight,
  ArrowUpRight,
  Code2,
  Sparkles,
  Search,
  Command,
  MessageSquare,
  Zap,
  Star,
  X
} from 'lucide-react';

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsCommandOpen(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const projects = [
    {
      title: "Quantum Nexus",
      type: "Full Stack Architecture",
      desc: "High-performance distributed systems with real-time synchronization.",
      tech: ["React", "Go", "Redis"],
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Lumina AI",
      type: "Neural Interface",
      desc: "Advanced prompt engineering platform utilizing GPT-4 with custom embeddings.",
      tech: ["Python", "Next.js", "PyTorch"],
      color: "from-purple-600 to-pink-500"
    },
    {
      title: "Aether OS",
      type: "Web Experience",
      desc: "A browser-based operating system mimicking Unix terminal capabilities.",
      tech: ["Three.js", "TypeScript", "Tailwind"],
      color: "from-orange-500 to-yellow-400"
    }
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 origin-left z-[110]" style={{ scaleX }} />

      {/* Command K Modal */}
      <AnimatePresence>
        {isCommandOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setIsCommandOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 p-6 border-b border-white/5">
                <Search className="text-gray-500" size={24} />
                <input autoFocus placeholder="Search protocols, projects, or docs..." className="bg-transparent w-full outline-none text-xl placeholder:text-gray-700" />
                <button onClick={() => setIsCommandOpen(false)} className="p-2 hover:bg-white/5 rounded-xl"><X size={20} /></button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { label: "Book Strategy Session", icon: MessageSquare, color: "text-green-400", sub: "Schedule a call" },
                  { label: "Technical Dossier", icon: Layers, color: "text-blue-400", sub: "Download Resume" },
                  { label: "Source Protocols", icon: Code2, color: "text-purple-400", sub: "View GitHub" },
                  { label: "System Status", icon: Zap, color: "text-yellow-400", sub: "Available Now" }
                ].map((item, i) => (
                  <button key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left group">
                    <div className={`p-3 rounded-xl bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}><item.icon size={20} /></div>
                    <div>
                      <div className="text-sm font-bold text-white uppercase tracking-wider">{item.label}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Cursor Background */}
      <div className="pointer-events-none fixed inset-0 z-30 opacity-40"
        style={{ background: `radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.12), transparent 80%)` }}
      />
      
      {/* Noise and Grid */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-40"></div>
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] z-0"></div>

      {/* Header */}
      <nav className={`fixed w-full z-[100] transition-all duration-700 ${scrolled ? 'py-4 bg-black/80 backdrop-blur-2xl border-b border-white/5' : 'py-10 bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]"><Terminal size={20} /></div>
            <span className="hidden sm:inline">KUSHAL<span className="text-indigo-500">.</span>POUDEL</span>
          </motion.div>
          
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex gap-10 text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">
              {['Expertise', 'Work', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-all">
                  {item}
                </a>
              ))}
            </div>
            <button 
              onClick={() => setIsCommandOpen(true)}
              className="px-8 py-3 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Initialize Command (K)
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-8 min-h-screen flex flex-col justify-center z-10 max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div> Available for 2024 collaborations
          </div>
          
          <h1 className="text-7xl md:text-[10rem] lg:text-[13rem] font-black tracking-tighter leading-[0.8] mb-12">
            BUILDING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">DIGITAL SOULS.</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-20 items-end">
            <p className="text-gray-500 text-xl md:text-2xl leading-relaxed max-w-xl font-light">
              Full-stack architect engineering high-frequency web ecosystems. Merging technical precision with human intuition.
            </p>
            <div className="flex gap-6">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-6 rounded-3xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"><Icon size={28} /></a>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats - Horizontal Scroll */}
      <section className="py-32 border-y border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-16">
          {[
            { label: "Performance Score", val: "A+", icon: Zap },
            { label: "Global Reach", val: "100%", icon: Globe },
            { label: "Architecture", val: "Pro", icon: Sparkles },
            { label: "Projects Built", val: "48", icon: Cpu }
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -5 }}>
              <s.icon className="text-indigo-500 mb-6" size={24} />
              <div className="text-6xl font-black tracking-tighter mb-2">{s.val}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section id="work" className="py-40 px-8 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-32">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter">SELECTED <br />PROTOCOLS.</h2>
          <div className="hidden md:block text-right">
            <div className="text-gray-500 uppercase tracking-widest text-[10px] font-black mb-2">Portfolio Volume</div>
            <div className="text-4xl font-black tabular-nums text-indigo-500">03 / 12</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {projects.map((p, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -20 }}
              className="group relative rounded-[3rem] overflow-hidden bg-[#0a0a0a] border border-white/5 p-2 aspect-[4/5] lg:aspect-square"
            >
              <div className="relative h-full w-full rounded-[2.8rem] overflow-hidden bg-black flex flex-col justify-between p-12">
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-tr ${p.color}`}></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map(t => <span key={t} className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 backdrop-blur-md">{t}</span>)}
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-indigo-600 transition-all duration-500"><ArrowUpRight size={24} /></div>
                </div>

                <div className="relative z-10 transform group-hover:translate-y-[-10px] transition-transform duration-500">
                  <h4 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">{p.title}</h4>
                  <p className="text-gray-500 text-lg md:text-xl font-light max-w-sm mb-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{p.desc}</p>
                  <button className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Analyze System Details</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer id="contact" className="pt-20 pb-20 px-8 max-w-[1400px] mx-auto">
        <div className="rounded-[4rem] bg-indigo-600 p-16 md:p-32 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12"><Sparkles size={400} /></div>
          
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-12 relative z-10">DON'T SETTLE <br />FOR AVERAGE.</h2>
          <p className="text-indigo-100 text-xl md:text-3xl font-light mb-16 max-w-3xl mx-auto leading-relaxed relative z-10">
            Secure your slot for the next development cycle. Let's build something that leaves the competition in the rearview.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <a href="mailto:contact@kushalpoudel.com" className="px-14 py-7 bg-white text-black rounded-3xl font-black text-xl hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-4">
              INITIATE PROJECT <Mail size={24} />
            </a>
            <button onClick={() => setIsCommandOpen(true)} className="px-14 py-7 bg-indigo-500 text-white rounded-3xl font-black text-xl border border-indigo-400 hover:bg-indigo-400 transition-all">
              TECHNICAL DOCS
            </button>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black text-gray-600 uppercase tracking-[0.5em]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            Core Network Status: Optimal
          </div>
          <div className="text-center">© 2024 KUSHAL POUDEL — ARCHITECTED FOR PERMANENCE</div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-all">GitHub</a>
            <a href="#" className="hover:text-white transition-all">LinkedIn</a>
            <a href="#" className="hover:text-white transition-all">X / Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
