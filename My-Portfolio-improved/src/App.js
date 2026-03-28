import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Linkedin, Mail, Briefcase, Calculator, TrendingUp, ShieldCheck,
  ChevronRight, ArrowUpRight, FileText, Sparkles, Search, MessageSquare, 
  Zap, X, Scale, Landmark, Coins, Receipt, UserCheck, Volume2, 
  BrainCircuit, Loader2, Coffee, Users, User, BookOpen
} from 'lucide-react';

// --- Configuration ---
// The execution environment provides the key at runtime for the direct fallback.
const apiKey = ""; 
const TEXT_MODEL = "gemini-2.5-flash-preview-09-2025";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  
  // Chat State
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // TTS State
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  
  // Roadmap State
  const [roadmapGoal, setRoadmapGoal] = useState("");
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);

  // Jargon Buster State (New Feature)
  const [jargonTerm, setJargonTerm] = useState("");
  const [jargonDefinition, setJargonDefinition] = useState(null);
  const [isJargonLoading, setIsJargonLoading] = useState(false);

  const [imgError, setImgError] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  // Helper to check if relative /api paths are safe to fetch (avoids blob URL errors)
  const canUseProxy = () => {
    try {
      return window.location.protocol.startsWith('http') && window.location.hostname !== '';
    } catch (e) {
      return false;
    }
  };

  // PCM to WAV conversion helper
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

  // Hybrid AI Fetcher: Tries Proxy first, then Direct API
  const fetchAiContent = async (payload, isJson = false) => {
    // 1. Attempt Proxy (Production Environment)
    if (canUseProxy()) {
      try {
        const proxyResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, isJson })
        });

        if (proxyResponse.ok) {
          const data = await proxyResponse.json();
          return data.text;
        }
      } catch (e) {
        console.warn("Proxy fetch failed or not available, falling back to direct API.");
      }
    }
    
    // 2. Fallback to Direct API (Preview/Local Environment)
    const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`;
    const directResponse = await fetch(directUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: payload.prompt }] }],
        systemInstruction: { parts: [{ text: payload.systemInstruction }] },
        ...(isJson && { generationConfig: { responseMimeType: "application/json" } })
      })
    });

    if (!directResponse.ok) throw new Error("Direct API failed");
    const directData = await directResponse.json();
    return directData.candidates?.[0]?.content?.parts?.[0]?.text;
  };

  const handleTts = async (textToSpeak) => {
    if (isTtsLoading) return;
    setIsTtsLoading(true);
    try {
      let audioData = null;

      // Try Proxy first if environment allows
      if (canUseProxy()) {
        try {
          const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textToSpeak })
          });
          
          if (response.ok) {
            const data = await response.json();
            audioData = data.audio;
          }
        } catch (e) {
          console.warn("TTS Proxy failed, using direct API.");
        }
      }
      
      if (!audioData) {
        // Direct Fallback
        const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${apiKey}`;
        const directRes = await fetch(directUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Say clearly: ${textToSpeak}` }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
            }
          })
        });
        const data = await directRes.json();
        audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      }

      if (audioData) {
        new Audio(createWavUrl(audioData)).play();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTtsLoading(false);
    }
  };

  const generateRoadmapAction = async () => {
    if (!roadmapGoal || isRoadmapLoading) return;
    setIsRoadmapLoading(true);
    try {
      const payload = {
        prompt: `Goal: ${roadmapGoal}`,
        systemInstruction: "You are Kushal Poudel. Generate a supportive 4-step financial roadmap. JSON only: step1, step2, step3, step4."
      };
      const text = await fetchAiContent(payload, true);
      setGeneratedRoadmap(JSON.parse(text));
    } catch (e) {
      setGeneratedRoadmap({ 
        step1: "Connection issue.", 
        step2: "I'd love to help personally.", 
        step3: "Email: mail@kushalpoudel.com", 
        step4: "Let's build your path." 
      });
    } finally { setIsRoadmapLoading(false); }
  };

  const handleAiQuery = async () => {
    if (!aiQuery || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const payload = {
        prompt: aiQuery,
        systemInstruction: "You are Kushal Poudel, a financial partner. Respond warmly and concisely."
      };
      const text = await fetchAiContent(payload);
      setAiResponse(text);
    } catch (e) {
      setAiResponse("I'm having trouble with the connection. Please reach out to me directly at mail@kushalpoudel.com!");
    } finally { setIsAiLoading(false); }
  };

  const handleJargonAction = async () => {
    if (!jargonTerm || isJargonLoading) return;
    setIsJargonLoading(true);
    try {
      const payload = {
        prompt: `Define: ${jargonTerm}`,
        systemInstruction: "You are Kushal Poudel. Explain this financial term in 1-2 simple, reassuring sentences for a non-expert. Avoid jargon in your explanation."
      };
      const text = await fetchAiContent(payload);
      setJargonDefinition(text);
    } catch (e) {
      setJargonDefinition("I can't pull that definition right now, but I'd be happy to explain it over a call!");
    } finally { setIsJargonLoading(false); }
  };

  useEffect(() => {
    document.documentElement.style.colorScheme = 'dark';
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setIsCommandOpen(true); }
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

  return (
    <div className="bg-[#020617] text-white min-h-screen font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-600 origin-left z-[110]" style={{ scaleX }} />

      {/* Command K Chat Modal */}
      <AnimatePresence>
        {isCommandOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setIsCommandOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-4 p-6 border-b border-white/5">
                <Search className="text-gray-500" size={24} />
                <input autoFocus placeholder="How can I help you today?" className="bg-transparent w-full outline-none text-xl text-white font-light" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAiQuery()} />
                <button onClick={handleAiQuery} className="p-2 bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-colors">
                  {isAiLoading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
                </button>
              </div>
              <div className="p-8 text-left min-h-[250px] max-h-[60vh] overflow-y-auto">
                {aiResponse ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-lg text-slate-300 leading-relaxed italic border-l-4 border-emerald-500 pl-6">
                    {aiResponse}
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-4 opacity-20 text-center items-center py-10">
                    <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                    <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                    <div className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-white/50">Fiscal Command Center</div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-0 z-30 opacity-30" style={{ background: `radial-gradient(1000px at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.08), transparent 80%)` }} />
      
      {/* Navigation */}
      <nav className={`fixed w-full z-[100] transition-all duration-700 ${scrolled ? 'py-4 bg-slate-950/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl' : 'py-10'}`}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-black tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-white/5">
              <Landmark size={20} className="text-emerald-400" />
            </div>
            <span className="uppercase tracking-tight font-black hidden xs:block">KUSHAL<span className="text-emerald-500">.</span>POUDEL</span>
          </div>
          <button onClick={() => setIsCommandOpen(true)} className="px-6 sm:px-8 py-3 rounded-full bg-emerald-600 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl active:scale-95">SAY HELLO (K)</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 sm:px-8 min-h-screen flex flex-col justify-center z-10 max-w-[1400px] mx-auto text-left">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Partnered for success
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-[0.9] mb-8 uppercase text-white">
              YOUR SUCCESS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-amber-500 to-yellow-600 italic">MY PRIORITY.</span>
            </h1>

            {/* Mobile/Tablet Image */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="lg:hidden mb-10 relative w-full">
              <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full"></div>
              <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50 backdrop-blur-3xl">
                 {!imgError ? (
                   <img src="/profile.jpg" alt="Kushal Poudel" className="w-full h-full object-cover grayscale transition-all duration-700" onError={() => setImgError(true)} />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-emerald-500/10"><User size={80} strokeWidth={0.5} /></div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              </div>
            </motion.div>

            <p className="text-slate-300 text-lg sm:text-xl md:text-2xl leading-relaxed font-light italic border-l-2 border-emerald-500 pl-6 mb-12 max-w-2xl">
              "I know how heavy the weight of financial stress can feel. I handle the spreadsheets so you can focus on building your legacy."
            </p>
            <div className="flex flex-wrap gap-4">
               <button onClick={() => handleTts("I know how heavy financial stress can feel. I am Kushal Poudel, and I am here to help. Let's build your future together.")} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all group active:scale-95 shadow-xl">
                  {isTtsLoading ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className="text-emerald-500" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">Listen to Message</span>
               </button>
               <a href="mailto:mail@kushalpoudel.com" className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center text-gray-400 hover:text-emerald-400 transition-all shadow-xl active:scale-95"><Mail size={24} /></a>
            </div>
          </motion.div>

          {/* Desktop Image */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="hidden lg:block relative">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full"></div>
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl bg-slate-900/50 backdrop-blur-3xl">
               {!imgError ? (
                 <img src="/profile.jpg" alt="Kushal Poudel" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" onError={() => setImgError(true)} />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-emerald-500/10"><User size={160} strokeWidth={0.5} /></div>
               )}
               <div className="absolute bottom-10 left-10 z-20">
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1 text-left uppercase">Financial Partner</div>
                  <div className="text-2xl font-black text-white uppercase tracking-tight text-left">KUSHAL POUDEL</div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collaborative Roadmap Section */}
      <section className="py-24 sm:py-40 px-6 sm:px-8 max-w-[1400px] mx-auto text-left border-t border-white/5">
        <div className="bg-slate-900/40 border border-emerald-500/20 rounded-[2.5rem] sm:rounded-[3rem] p-8 md:p-16 grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><BrainCircuit size={300} className="text-emerald-500" /></div>
          <div className="relative z-10">
            <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-4">Collaborative Planning</h2>
            <h3 className="text-3xl sm:text-5xl font-black mb-8 italic">✨ Your Growth Path.</h3>
            <p className="text-slate-400 mb-10 font-light italic leading-relaxed">Tell me what you're working toward, and we'll outline a supportive path forward.</p>
            <div className="flex flex-col gap-4">
               <input type="text" placeholder="What are you building?" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-emerald-500 transition-all text-white placeholder:text-gray-600" value={roadmapGoal} onChange={(e) => setRoadmapGoal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && generateRoadmapAction()} />
               <button onClick={generateRoadmapAction} className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-500 shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                 {isRoadmapLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />} Plan My Journey
               </button>
            </div>
          </div>
          <div className="bg-black/40 rounded-3xl border border-white/5 p-8 flex items-center justify-center min-h-[350px] relative shadow-2xl">
            {generatedRoadmap ? (
              <div className="w-full space-y-8 text-left">
                {Object.values(generatedRoadmap).map((s, i) => (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-6 sm:gap-8 items-start group">
                    <div className="text-4xl sm:text-5xl font-black text-emerald-950 italic group-hover:text-emerald-500/20 transition-all leading-none select-none">{i+1}</div>
                    <div>
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Phase {i+1}</div>
                      <p className="text-slate-200 text-base sm:text-lg font-light leading-relaxed">{s}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : <div className="text-slate-700 uppercase tracking-widest font-black text-xs sm:text-sm italic opacity-30 text-center">Your strategy will appear here...</div>}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 sm:py-40 px-6 sm:px-8 max-w-[1400px] mx-auto text-center border-t border-white/5">
        <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-20">Support Framework</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { icon: Users, title: "Taxation Partner", d: "I handle the complex codes so you can focus on building your legacy." },
            { icon: ShieldCheck, title: "Security & Audit", d: "Providing total transparency so you can sleep soundly." },
            { icon: Receipt, title: "Precision Payroll", d: "Handling your team's happiness through precise administration." },
            { icon: TrendingUp, title: "Asset Protection", d: "Turning volatility into a steady, secure path forward." },
            { icon: Briefcase, title: "Business Consultant", d: "Your in-house advocate, ready to help you grow with confidence." },
            { icon: Landmark, title: "Firm Management", d: "Handling the documentation so you can focus on your passion." }
          ].map((skill, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/5 text-left group hover:border-emerald-500/50 transition-all hover:bg-slate-900/60 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:bg-emerald-500 group-hover:text-black transition-all"><skill.icon size={24} /></div>
              <h3 className="text-xl font-black mb-4 text-white uppercase tracking-tight">{skill.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">{skill.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW FEATURE: Fiscal Translator */}
      <section className="py-24 sm:py-40 px-6 sm:px-8 max-w-[1400px] mx-auto border-t border-white/5">
        <div className="bg-slate-900/40 border border-emerald-500/20 rounded-[3rem] p-8 md:p-16 text-center max-w-4xl mx-auto shadow-2xl">
          <div className="flex justify-center mb-8"><div className="p-4 bg-emerald-500/10 rounded-2xl"><BookOpen size={40} className="text-emerald-500" /></div></div>
          <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-6">Fiscal Translator</h2>
          <h3 className="text-3xl sm:text-5xl font-black mb-8 text-white">Stumped by Jargon?</h3>
          <p className="text-slate-400 mb-10 text-lg">Type a confusing financial term (like "EBITDA" or "Amortization"), and I'll explain it in plain English.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-10">
            <input 
              type="text" 
              placeholder="e.g. Depreciation" 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-all text-white placeholder:text-gray-600" 
              value={jargonTerm}
              onChange={(e) => setJargonTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJargonAction()}
            />
            <button 
              onClick={handleJargonAction} 
              className="bg-emerald-600 text-white font-black py-4 px-8 rounded-2xl hover:bg-emerald-500 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {isJargonLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} ✨ Translate
            </button>
          </div>

          <AnimatePresence>
            {jargonDefinition && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-emerald-950/30 border border-emerald-500/30 p-8 rounded-3xl text-left">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Kushal's Definition:</div>
                <p className="text-white text-lg font-light italic leading-relaxed">"{jargonDefinition}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-24 sm:py-40 px-6 sm:px-8 max-w-[1400px] mx-auto text-center">
        <div className="rounded-[3rem] sm:rounded-[4rem] bg-emerald-700 p-12 sm:p-24 md:p-32 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12 text-white pointer-events-none select-none"><ShieldCheck size={500} /></div>
          <h2 className="text-5xl sm:text-7xl md:text-[8rem] font-black tracking-tighter mb-12 leading-none relative z-10 text-white uppercase italic">I'M IN THIS WITH YOU.</h2>
          <div className="relative z-10 flex flex-col items-center gap-8">
             <p className="text-emerald-100 text-lg sm:text-xl font-light italic max-w-xl">"Let's make sure you're protected and growing for years to come."</p>
             <a href="mailto:mail@kushalpoudel.com" className="inline-block px-12 sm:px-16 py-6 sm:py-8 bg-white text-black rounded-3xl font-black text-lg sm:text-xl uppercase hover:scale-105 transition-all shadow-2xl active:scale-95">
               Send a Message
             </a>
          </div>
        </div>
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
           <div>© 2024 KUSHAL POUDEL • BUILT FOR PEACE OF MIND</div>
           <div className="flex gap-10 text-xs font-bold uppercase tracking-widest">
             <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
             <a href="mailto:mail@kushalpoudel.com" className="hover:text-white transition-colors">Direct Mail</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
