import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
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
  Landmark,
  Wallet,
  Coins,
  Receipt,
  UserCheck,
  Volume2,
  BrainCircuit,
  Loader2
} from 'lucide-react';

// --- Gemini API Configuration ---
const apiKey = "AIzaSyBKPcRzXhNrcTLHTR3ucLUVOtW7SrN2IQQ"; 
const TEXT_MODEL = "gemini-2.5-flash-preview-09-2025";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [roadmapGoal, setRoadmapGoal] = useState("");
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  const createWavUrl = (base64Pcm, sampleRate = 24000) => {
    const pcmData = Uint8Array.from(atob(base64Pcm), c => c.charCodeAt(0));
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + pcmData.length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, pcmData.length, true);
    const blob = new Blob([wavHeader, pcmData], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const callGemini = async (prompt, systemInstruction, retryCount = 0) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });
      if (!response.ok) {
        if (retryCount < 5) {
          await sleep(Math.pow(2, retryCount) * 1000);
          return callGemini(prompt, systemInstruction, retryCount + 1);
        }
        throw new Error("Connection lost.");
      }
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      if (retryCount < 5) {
        await sleep(Math.pow(2, retryCount) * 1000);
        return callGemini(prompt, systemInstruction, retryCount + 1);
      }
      throw error;
    }
  };

  const handleTts = async (textToSpeak) => {
    if (isTtsLoading) return;
    setIsTtsLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Say in a warm, professional, trustworthy tone: ${textToSpeak}` }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
          }
        })
      });
      if (!response.ok) throw new Error("TTS failed");
      const data = await response.json();
      const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const wavUrl = createWavUrl(base64Audio);
        const audio = new Audio(wavUrl); 
        audio.play();
      }
    } catch (error) {
      console.error("TTS Error", error);
    } finally {
      setIsTtsLoading(false);
    }
  };

  const generateRoadmapAction = async () => {
    if (!roadmapGoal || isRoadmapLoading) return;
    setIsRoadmapLoading(true);
    const systemPrompt = "You are Kushal Poudel, a Financial Partner. Generate a supportive, 4-step 'Growth Roadmap' for a client's goal. Focus on providing peace of mind and showing you care about their success. Format as valid JSON with properties: step1, step2, step3, step4.";
    try {
      const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Goal: ${roadmapGoal}` }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { 
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                step1: { type: "STRING" },
                step2: { type: "STRING" },
                step3: { type: "STRING" },
                step4: { type: "STRING" }
              },
              required: ["step1", "step2", "step3", "step4"]
            }
          }
        })
      });
      if (!result.ok) throw new Error("Roadmap generation failed");
      const data = await result.json();
      setGeneratedRoadmap(JSON.parse(data.candidates[0].content.parts[0].text));
    } catch (e) {
      console.error(e);
    } finally {
      setIsRoadmapLoading(false);
    }
  };

  const handleAiQuery = async () => {
    if (!aiQuery || isAiLoading) return;
    setIsAiLoading(true);
    
    const systemPrompt = `You are Kushal Poudel, a professional accountant who deeply cares about his clients' peace of mind. 
    Respond as a helpful partner, not a distant expert. Use a tone that is warm, relatable, and reassuring. 
    Acknowledge that financial topics can be overwhelming and let them know you're here to help shoulder that burden.
    Keep responses simple and focused on how you can solve their specific worry.
    Avoid talking about "charging for results" or "expensive expertise." Instead, focus on "building a stable future together."
    If asked about costs, explain that you want to make sure they get exactly the help they need without paying for things they don't, so a quick 15-minute chat is the best way to keep things fair and comfortable for them.
    Use 'I' and 'you'. Be concise but empathetic.`;

    try {
      const response = await callGemini(aiQuery, systemPrompt);
      setAiResponse(response);
    } catch (e) {
      setAiResponse("I'm having a little trouble with the connection here. Why don't you send me a quick note at mail@kushalpoudel.com? I'd love to help you out directly.");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.style.colorScheme = 'dark';
    document.body.style.backgroundColor = '#020617'; 
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

  const expertise = [
    { icon: FileText, title: "Taxation Strategy", desc: "I navigate the complex codes so you don't have to. I treat your tax filing like it's my own." },
    { icon: ShieldCheck, title: "Auditing & Assurance", desc: "Providing total transparency so you can sleep soundly knowing your records are perfect." },
    { icon: Receipt, title: "Payslip Officer", desc: "I handle the payroll precision because your team's happiness is the heart of your business." },
    { icon: TrendingUp, title: "Investment Advisor", desc: "We'll turn volatility into a steady path forward. I'm focused on your long-term security." },
    { icon: Briefcase, title: "Business Consultant", desc: "Consider me your fractional partner. I'm here to help you grow with confidence." },
    { icon: Landmark, title: "Administrative Support", desc: "Let me handle the 'paperwork' so you can focus on the parts of your business you actually love." }
  ];

  return (
    <div className="bg-[#020617] text-white min-h-screen font-sans selection:bg-emerald-500/30 overflow-x-hidden" style={{ colorScheme: 'dark' }}>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-600 origin-left z-[110]" style={{ scaleX }} />

      {/* Command K Modal (AI Chat) */}
      <AnimatePresence>
        {isCommandOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setIsCommandOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 p-6 border-b border-white/5">
                <Search className="text-gray-500" size={24} />
                <input 
                  autoFocus 
                  placeholder="How can I help you today?" 
                  className="bg-transparent w-full outline-none text-xl text-white placeholder:text-gray-700 font-light" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiQuery()}
                />
                <button 
                  onClick={handleAiQuery}
                  className="p-2 bg-emerald-600 rounded-xl hover:bg-emerald-500"
                >
                  {isAiLoading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-emerald-900 text-left">
                {aiResponse ? (
                  <div className="mb-8">
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <UserCheck size={12} className="text-emerald-500" /> Kushal's Partner AI
                    </div>
                    <div className="text-lg text-slate-300 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5">
                      {aiResponse}
                    </div>
                    <button onClick={() => setAiResponse(null)} className="mt-4 text-[10px] font-bold text-gray-500 uppercase hover:text-white transition-colors">Ask another question</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { label: "Book a Coffee Chat", icon: MessageSquare, color: "text-emerald-400", sub: "Let's talk about your goals" },
                      { label: "My Professional Story", icon: FileText, color: "text-amber-400", sub: "View my background" },
                      { label: "Partner Portal", icon: Landmark, color: "text-sky-400", sub: "Secure client access" },
                      { label: "I'm Here to Help", icon: UserCheck, color: "text-emerald-500", sub: "Ready for your project" }
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
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-0 z-30 opacity-40"
        style={{ background: `radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.1), transparent 80%)` }}
      />
      
      {/* Header */}
      <nav className={`fixed w-full z-[100] transition-all duration-700 ${scrolled ? 'py-4 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5' : 'py-10 bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center text-white">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]"><Landmark size={20} className="text-emerald-400" /></div>
            <span className="hidden sm:inline font-black uppercase tracking-tight">KUSHAL<span className="text-emerald-500">.</span>POUDEL</span>
          </div>
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex gap-10 text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">
              {['How I Help', '✨ Your Strategy', 'My Journey', 'Connect'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace('✨ ', '').replace(' ', '-')}`} className="hover:text-emerald-400 transition-all">{item}</a>
              ))}
            </div>
            <button onClick={() => setIsCommandOpen(true)} className="px-8 py-3 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">LET'S CHAT (K)</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-8 min-h-screen flex flex-col justify-center z-10 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Partnered for your success
            </div>
            <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-[0.8] mb-12 text-white">
              YOUR SUCCESS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-amber-500 to-yellow-600">MY PRIORITY.</span>
            </h1>
            <div className="max-w-2xl mb-12 text-left">
              <p className="text-slate-300 text-xl md:text-2xl leading-relaxed font-light italic border-l-2 border-emerald-500 pl-6 mb-6">
                "I know how heavy the weight of financial stress can feel. I don't just see numbers on a page; I see the hard work and dreams behind them. Let me carry the burden of the spreadsheets so you can focus on building your legacy."
              </p>
              <button 
                onClick={() => handleTts("I know how heavy financial stress can feel. I am Kushal Poudel, and I am here to help shoulder that burden. Let's build your future together.")}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-white transition-colors"
              >
                {isTtsLoading ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />} 
                {isTtsLoading ? "One moment..." : "✨ Listen to a short message"}
              </button>
            </div>
            <div className="flex gap-6">
              {[Linkedin, Mail].map((Icon, i) => (
                <a key={i} href={i === 1 ? "mailto:mail@kushalpoudel.com" : "#"} className="p-6 rounded-3xl bg-white/5 border border-white/10 text-gray-400 hover:text-emerald-400 transition-all"><Icon size={28} /></a>
              ))}
            </div>
          </motion.div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10"></div>
              <img src="/profile.jpg" alt="Kushal Poudel" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"; }} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" />
              <div className="absolute bottom-10 left-10 z-20 text-left">
                <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Dedicated Partner</div>
                <div className="text-2xl font-black text-white">KUSHAL POUDEL</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Strategist Section */}
      <section id="your-strategy" className="py-40 px-8 max-w-[1400px] mx-auto scroll-mt-20">
        <div className="bg-slate-900/40 border border-emerald-500/20 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5"><BrainCircuit size={300} className="text-emerald-500" /></div>
          <div className="relative z-10 grid lg:grid-cols-[1fr_2fr] gap-16">
            <div className="text-left">
              <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-4">Collaborative Planning</h2>
              <h3 className="text-4xl md:text-6xl font-black mb-8 text-white">✨ Your Growth Path.</h3>
              <p className="text-slate-400 mb-10 leading-relaxed">Let's look at your biggest challenge together. Tell me what you're working toward, and my AI strategist will help us outline a supportive path forward.</p>
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="What are you dreaming of building?" 
                  className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-all"
                  value={roadmapGoal}
                  onChange={(e) => setRoadmapGoal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateRoadmapAction()}
                />
                <button onClick={generateRoadmapAction} disabled={isRoadmapLoading || !roadmapGoal} className="bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all">
                  {isRoadmapLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />} Outline My Path
                </button>
              </div>
            </div>

            <div className="min-h-[400px] flex items-center justify-center bg-black/40 rounded-3xl border border-white/5 p-8 relative">
              {!generatedRoadmap && !isRoadmapLoading && <div className="text-slate-600 uppercase tracking-widest font-black text-sm italic">Tell me your goal above...</div>}
              {isRoadmapLoading && <div className="flex flex-col items-center gap-4 text-emerald-500 font-black uppercase tracking-widest text-xs animate-pulse"><Loader2 size={48} className="animate-spin" /> Organizing your future...</div>}
              {generatedRoadmap && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-6 text-left">
                  {Object.values(generatedRoadmap).map((step, idx) => (
                    <div key={idx} className="flex gap-6 items-start group">
                      <div className="text-6xl font-black text-emerald-950 group-hover:text-emerald-500/20 transition-colors leading-none italic">{idx+1}</div>
                      <div>
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">MILESTONE {idx+1}</div>
                        <p className="text-slate-300 text-lg font-light leading-snug">{step}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section id="how-i-help" className="py-40 px-8 max-w-[1400px] mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-4">Core Support</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white italic">Partnering in your journey.</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertise.map((skill, i) => (
            <motion.div key={i} className="p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/5 group hover:border-emerald-500/50 transition-all shadow-2xl text-left">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <skill.icon size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">{skill.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trajectory */}
      <section id="my-journey" className="py-40 px-8 max-w-[1400px] mx-auto border-t border-white/5">
        <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-24 text-left">My Professional Journey</h2>
        <div className="space-y-16">
          {[
            { year: "2024", role: "Your Financial Partner", company: "Poudel Support Services", desc: "Focusing entirely on helping startups and individuals achieve lasting security and peace of mind." },
            { year: "2022", role: "Auditing & Care Lead", company: "Global Assurance Partners", desc: "Ensuring every client felt heard and every penny was protected during complex fiscal changes." },
            { year: "2020", role: "Payroll Support Specialist", company: "Capital Solutions", desc: "Learned the value of taking care of employees through precise, caring administrative work." }
          ].map((item, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_2fr] gap-8 items-start pb-16 border-b border-white/5 text-left group">
              <div className="text-4xl font-black text-white/10 group-hover:text-amber-500/50 transition-colors tabular-nums italic">{item.year}</div>
              <div>
                <h3 className="text-3xl font-black mb-2 text-white">{item.role}</h3>
                <div className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4">{item.company}</div>
                <p className="text-slate-400 max-w-xl">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="connect" className="pt-20 pb-20 px-8 max-w-[1400px] mx-auto text-center">
        <div className="rounded-[4rem] bg-emerald-700 p-16 md:p-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12 text-white"><ShieldCheck size={400} /></div>
          <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter mb-12 relative z-10 text-white leading-none">I'M IN THIS <br />WITH YOU.</h2>
          <p className="text-emerald-100 text-xl md:text-3xl font-light mb-16 max-w-3xl mx-auto leading-relaxed relative z-10">
            Let's make sure you're protected and growing for years to come. I'm here to listen and help whenever you're ready.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <a href="mailto:mail@kushalpoudel.com" className="px-14 py-7 bg-white text-black rounded-3xl font-black text-xl hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all uppercase">
              Let's Connect <Mail size={24} className="inline ml-2" />
            </a>
          </div>
        </div>
        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Core Support: Operational</div>
          <div className="text-white font-bold">© 2024 KUSHAL POUDEL — BUILT FOR YOUR PEACE OF MIND</div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-emerald-400 transition-all">LinkedIn</a>
            <a href="mailto:mail@kushalpoudel.com" className="hover:text-emerald-400 transition-all">Mail</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
