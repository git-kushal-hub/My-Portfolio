import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Briefcase, 
  Calculator, 
  TrendingUp, 
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  FileText,
  Sparkles,
  Search,
  Command,
  MessageSquare,
  Zap,
  Star,
  X,
  Scale,
  PieChart,
  Landmark,
  Wallet
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
    document.documentElement.style.colorScheme = 'dark';
    document.body.style.backgroundColor = '#050505';

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

  const coreServices = [
    {
      title: "Corporate Taxation",
      type: "Strategic Planning",
      desc: "Comprehensive tax restructuring and compliance for high-net-worth entities.",
      tech: ["Compliance", "Advisory", "Tax Law"],
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Global Investment",
      type: "Asset Management",
      desc: "Diversified portfolio advisory focused on long-term wealth preservation.",
      tech: ["Portfolio", "Analysis", "Risk"],
      color: "from-purple-600 to-pink-500"
    },
    {
      title: "Business Consulting",
      type: "Scaling Operations",
      desc: "Fractional CFO services designed to optimize operational efficiency and profit.",
      tech: ["Strategy", "M&A", "Efficiency"],
      color: "from-orange-500 to-yellow-400"
    },
    {
      title: "Payroll Systems",
      type: "Managed Services",
      desc: "End-to-end payslip administration with 100% accuracy and regulatory alignment.",
      tech: ["Payroll", "Admin", "Reporting"],
      color: "from-emerald-500 to-teal-400"
    }
  ];

  const expertise = [
    { icon: FileText, title: "Taxation Strategy", desc: "Expert navigation of complex tax codes to maximize legal deductions and fiscal health." },
    { icon: Search, title: "Auditing & Assurance", desc: "Rigorous internal and external auditing to ensure total transparency and compliance." },
    { icon: Calculator, title: "Payslip Officer", desc: "Automated and manual payroll solutions ensuring timely disbursements and tax withholding." },
    { icon: TrendingUp, title: "Investment Advisory", desc: "Data-driven insights into market trends for strategic wealth accumulation." },
    { icon: Briefcase, title: "Business Consultant", desc: "Advising startups and established firms on growth, mergers, and cost management." },
    { icon: ShieldCheck, title: "Risk Management", desc: "Protecting business assets through comprehensive financial shielding and insurance audits." }
  ];

  const trajectory = [
    { year: "2024", role: "Principal Financial Consultant", company: "Poudel Advisory Group", desc: "Lead advisor for private equity firms and enterprise tax planning." },
    { year: "2022", role: "Senior Auditing Officer", company: "Global Finance Ltd", desc: "Managed compliance for multi-million dollar international audits." },
    { year: "2020", role: "Payroll & Admin Lead", company: "Strategic Admin Solutions", desc: "Oversaw payroll operations for a workforce of 500+ employees." }
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-indigo-500/30 overflow-x-hidden" style={{ colorScheme: 'dark' }}>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 origin-left z-[110]" style={{ scaleX }} />

      {/* Command K Modal */}
      <AnimatePresence>
        {isCommandOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setIsCommandOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 p-6 border-b border-white/5">
                <Search className="text-gray-500" size={24} />
                <input autoFocus placeholder="Search tax codes, investment plans, or docs..." className="bg-transparent w-full outline-none text-xl text-white placeholder:text-gray-700" />
                <button onClick={() => setIsCommandOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-white"><X size={20} /></button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { label: "Book Strategy Session", icon: MessageSquare, color: "text-green-400", sub: "Schedule a consultation" },
                  { label: "Financial Dossier", icon: FileText, color: "text-blue-400", sub: "Professional Resume" },
                  { label: "Client Portal", icon: Landmark, color: "text-purple-400", sub: "Secure login" },
                  { label: "System Status", icon: Zap, color: "text-yellow-400", sub: "Active Advisory" }
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

      <div className="pointer-events-none fixed inset-0 z-30 opacity-40"
        style={{ background: `radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.12), transparent 80%)` }}
      />
      
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-40"></div>
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] z-0"></div>

      {/* Header */}
      <nav className={`fixed w-full z-[100] transition-all duration-700 ${scrolled ? 'py-4 bg-black/80 backdrop-blur-2xl border-b border-white/5' : 'py-10 bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center text-white">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]"><Calculator size={20} /></div>
            <span className="hidden sm:inline font-black">KUSHAL<span className="text-indigo-500">.</span>POUDEL</span>
          </motion.div>
          
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex gap-10 text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">
              {['Services', 'Case Studies', 'Trajectory', 'Consult'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-all">
                  {item}
                </a>
              ))}
            </div>
            <button 
              onClick={() => setIsCommandOpen(true)}
              className="px-8 py-3 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              FINANCIAL COMMAND (K)
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-8 min-h-screen flex flex-col justify-center z-10 max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div> Accepting Corporate Clients
          </div>
          
          <h1 className="text-7xl md:text-[10rem] lg:text-[12rem] font-black tracking-tighter leading-[0.8] mb-12 text-white">
            ARCHITECTING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">FISCAL LEGACIES.</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-20 items-end">
            <p className="text-gray-500 text-xl md:text-2xl leading-relaxed max-w-xl font-light">
              Strategic accounting professional specializing in corporate taxation, investment advisory, and enterprise-scale payroll systems. Precision in every entry.
            </p>
            <div className="flex gap-6">
              {[Linkedin, Mail].map((Icon, i) => (
                <a key={i} href={i === 1 ? "mailto:mail@kushalpoudel.com" : "#"} className="p-6 rounded-3xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"><Icon size={28} /></a>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-32 border-y border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-16">
          {[
            { label: "Accuracy Rate", val: "100%", icon: Zap },
            { label: "Assets Advised", val: "$40M+", icon: Wallet },
            { label: "Compliance Score", val: "A+", icon: ShieldCheck },
            { label: "Years Experience", val: "8+", icon: Landmark }
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -5 }}>
              <s.icon className="text-indigo-500 mb-6" size={24} />
              <div className="text-6xl font-black tracking-tighter mb-2 text-white">{s.val}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-40 px-8 max-w-[1400px] mx-auto">
        <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-12">Expertise Matrix</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertise.map((skill, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-indigo-500/50 transition-all"
            >
              <skill.icon className="text-indigo-500 mb-8 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-2xl font-black mb-4">{skill.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="py-40 px-8 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-32">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase">Strategic <br />Protocols.</h2>
          <div className="hidden md:block text-right">
            <div className="text-gray-500 uppercase tracking-widest text-[10px] font-black mb-2">Service Intensity</div>
            <div className="text-4xl font-black tabular-nums text-indigo-500">04 / 06</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {coreServices.map((p, i) => (
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
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-indigo-600 transition-all duration-500 text-white"><Scale size={24} /></div>
                </div>

                <div className="relative z-10 transform group-hover:translate-y-[-10px] transition-transform duration-500 text-left">
                  <h4 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none text-white">{p.title}</h4>
                  <p className="text-gray-500 text-lg md:text-xl font-light max-w-sm mb-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{p.desc}</p>
                  <button className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Analyze Strategy Parameters</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trajectory Timeline */}
      <section id="trajectory" className="py-40 px-8 max-w-[1400px] mx-auto border-t border-white/5">
        <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-24">Career Trajectory</h2>
        <div className="space-y-16">
          {trajectory.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-[1fr_2fr] gap-8 items-start pb-16 border-b border-white/5 text-left"
            >
              <div className="text-4xl font-black text-white/20 tabular-nums">{item.year}</div>
              <div>
                <h3 className="text-3xl font-black mb-2 text-white">{item.role}</h3>
                <div className="text-indigo-500 font-bold uppercase tracking-widest text-xs mb-4">{item.company}</div>
                <p className="text-gray-500 max-w-xl">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer id="consult" className="pt-20 pb-20 px-8 max-w-[1400px] mx-auto">
        <div className="rounded-[4rem] bg-indigo-600 p-16 md:p-32 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12 text-white"><Landmark size={400} /></div>
          
          <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter mb-12 relative z-10 text-white leading-none">DON'T LEAVE GROWTH <br />TO CHANCE.</h2>
          <p className="text-indigo-100 text-xl md:text-3xl font-light mb-16 max-w-3xl mx-auto leading-relaxed relative z-10">
            Secure your financial future for the next fiscal cycle. Let's engineer a strategy that ensures permanent prosperity.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <a href="mailto:mail@kushalpoudel.com" className="px-14 py-7 bg-white text-black rounded-3xl font-black text-xl hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-4">
              INITIATE AUDIT <Mail size={24} />
            </a>
            <button onClick={() => setIsCommandOpen(true)} className="px-14 py-7 bg-indigo-500 text-white rounded-3xl font-black text-xl border border-indigo-400 hover:bg-indigo-400 transition-all">
              STRATEGY DOCS
            </button>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black text-gray-600 uppercase tracking-[0.5em]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            Core Advisory Status: Operational
          </div>
          <div className="text-center text-gray-500 font-bold uppercase tracking-widest">© 2024 KUSHAL POUDEL — BUILT FOR FISCAL PERMANENCE</div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-all">LinkedIn</a>
            <a href="mailto:mail@kushalpoudel.com" className="hover:text-white transition-all">Mail</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
