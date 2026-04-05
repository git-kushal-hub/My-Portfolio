import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag, ChevronRight, Landmark } from 'lucide-react';

const Blog = ({ onNavigateHome }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    const stored = localStorage.getItem('kp_blog_posts');
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      // Default starter posts
      const defaults = [
        {
          id: 1,
          title: "Why Most People Get Taxes Wrong (And How to Fix It)",
          excerpt: "The tax code is complex, but the most common mistakes are surprisingly simple to avoid. Here's what I see time and time again.",
          content: `The tax code is complex, but the most common mistakes are surprisingly simple to avoid. After years of working with clients across different income levels, I've noticed a handful of errors that come up again and again.\n\n**Mistake #1: Not keeping records throughout the year**\n\nMost people scramble in April. The solution is to spend 15 minutes every week organizing receipts and transactions. That's it. By the time tax season arrives, you're done in a day instead of a week.\n\n**Mistake #2: Missing deductions you're entitled to**\n\nHome office, vehicle use, professional development — these are real deductions that real people miss every year. If you run any kind of business or side income, you likely qualify for more than you think.\n\n**Mistake #3: Ignoring retirement contributions**\n\nContributions to a 401(k) or IRA reduce your taxable income right now. It's one of the few legal ways to lower your tax bill while also building wealth. Yet many people leave this on the table.\n\nThe bottom line: taxes don't have to be stressful. With the right system and the right partner, you can stop dreading April and start planning for it.`,
          tag: "Taxation",
          date: "2024-11-15",
          readTime: "4 min read"
        },
        {
          id: 2,
          title: "Understanding Compound Interest: The 8th Wonder of the World",
          excerpt: "Einstein allegedly called it the eighth wonder of the world. Whether or not he said it, the math doesn't lie.",
          content: `Einstein allegedly called compound interest the eighth wonder of the world. Whether or not he actually said it, the math doesn't lie — and most people severely underestimate its power.\n\n**What is compound interest, really?**\n\nSimple interest earns you money on your principal. Compound interest earns you money on your principal AND on the interest you've already earned. Over time, this creates an exponential curve rather than a straight line.\n\n**A simple example**\n\nIf you invest $10,000 at 8% annual return:\n- After 10 years: ~$21,589\n- After 20 years: ~$46,610\n- After 30 years: ~$100,627\n\nYour money literally 10x'd in 30 years — and you didn't do anything extra.\n\n**The time factor is everything**\n\nThe earlier you start, the more dramatic the effect. Someone who invests $5,000/year from age 25–35 and then stops will often have MORE at retirement than someone who invests $5,000/year from age 35–65.\n\nThis is why I tell every client the same thing: start now, even if the amount feels small. Time is the ingredient you can't buy back.`,
          tag: "Investing",
          date: "2024-10-28",
          readTime: "5 min read"
        },
        {
          id: 3,
          title: "Building an Emergency Fund: Your Financial Foundation",
          excerpt: "Before any investment strategy, before any tax planning — you need this one thing in place.",
          content: `Before any investment strategy, before any tax planning, before anything else — you need an emergency fund. It's the foundation everything else is built on.\n\n**Why an emergency fund matters**\n\nWithout one, a single unexpected expense — a car repair, a medical bill, a month of reduced income — can derail your entire financial plan. You end up pulling from investments at the wrong time or taking on high-interest debt.\n\n**How much should you have?**\n\nThe standard advice is 3–6 months of expenses. I usually recommend being specific: calculate your actual monthly needs (rent, food, utilities, insurance, minimum debt payments) and multiply by 4 as a starting target.\n\n**Where should you keep it?**\n\nA high-yield savings account. Not invested in the market — the whole point is that it's stable and accessible. You want around 4–5% APY with instant access.\n\n**How to build it without feeling it**\n\nAutomate a fixed transfer the day after every paycheck. Start with whatever you can — even $50/week adds up to $2,600 in a year. Once it's automatic, you stop noticing it.\n\nOnce your emergency fund is in place, every other financial move becomes less stressful. It's not exciting, but it's the most important thing most people haven't done.`,
          tag: "Personal Finance",
          date: "2024-10-05",
          readTime: "4 min read"
        }
      ];
      setPosts(defaults);
      localStorage.setItem('kp_blog_posts', JSON.stringify(defaults));
    }
  }, []);

  const tags = ['All', ...Array.from(new Set(posts.map(p => p.tag)))];
  const filtered = selectedTag === 'All' ? posts : posts.filter(p => p.tag === selectedTag);

  const tagColors = {
    'Taxation': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Investing': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Personal Finance': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Business': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Planning': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };
  const getTagColor = (tag) => tagColors[tag] || 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  if (selectedPost) {
    return (
      <div className="bg-[#020617] text-white min-h-screen font-sans">
        <nav className="fixed w-full z-[100] py-4 bg-slate-950/90 backdrop-blur-2xl border-b border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-8 flex justify-between items-center">
            <button onClick={() => onNavigateHome()} className="text-xl sm:text-2xl font-black tracking-tighter flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-white/5">
                <Landmark size={20} className="text-emerald-400" />
              </div>
              <span className="uppercase tracking-tight font-black hidden xs:block">KUSHAL<span className="text-emerald-500">.</span>POUDEL</span>
            </button>
            <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
              <ArrowLeft size={16} /> Back to Blog
            </button>
          </div>
        </nav>

        <article className="pt-32 pb-24 px-6 sm:px-8 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-6 ${getTagColor(selectedPost.tag)}`}>
              {selectedPost.tag}
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] mb-8 text-white">{selectedPost.title}</h1>
            <div className="flex items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest mb-16 border-b border-white/5 pb-10">
              <span className="flex items-center gap-2"><Calendar size={12} />{selectedPost.date}</span>
              <span className="flex items-center gap-2"><Clock size={12} />{selectedPost.readTime}</span>
            </div>
            <div className="prose prose-invert prose-lg max-w-none">
              {selectedPost.content.split('\n\n').map((para, i) => {
                if (para.startsWith('**') && para.endsWith('**')) {
                  return <h3 key={i} className="text-xl font-black text-white mt-10 mb-4">{para.replace(/\*\*/g, '')}</h3>;
                }
                if (para.includes('**')) {
                  const parts = para.split(/(\*\*.*?\*\*)/g);
                  return (
                    <p key={i} className="text-slate-300 text-lg leading-relaxed mb-6">
                      {parts.map((part, j) =>
                        part.startsWith('**') ? <strong key={j} className="text-white font-black">{part.replace(/\*\*/g, '')}</strong> : part
                      )}
                    </p>
                  );
                }
                return <p key={i} className="text-slate-300 text-lg leading-relaxed mb-6">{para}</p>;
              })}
            </div>
            <div className="mt-20 pt-10 border-t border-white/5">
              <div className="bg-emerald-700 rounded-3xl p-10 text-center">
                <p className="text-emerald-100 text-lg font-light italic mb-6">Have questions about this topic? I'm here to help.</p>
                <a href="mailto:mail@kushalpoudel.com" className="inline-block px-10 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase hover:scale-105 transition-all shadow-xl">
                  Email Kushal
                </a>
              </div>
            </div>
          </motion.div>
        </article>
      </div>
    );
  }

  return (
    <div className="bg-[#020617] text-white min-h-screen font-sans">
      <nav className="fixed w-full z-[100] py-4 bg-slate-950/90 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 flex justify-between items-center">
          <button onClick={() => onNavigateHome()} className="text-xl sm:text-2xl font-black tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-white/5">
              <Landmark size={20} className="text-emerald-400" />
            </div>
            <span className="uppercase tracking-tight font-black hidden xs:block">KUSHAL<span className="text-emerald-500">.</span>POUDEL</span>
          </button>
          <button onClick={() => onNavigateHome()} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Home
          </button>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-6 sm:px-8 max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Financial Insights
          </div>
          <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-black tracking-tighter leading-[0.9] uppercase text-white mb-6">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-amber-500 to-yellow-600 italic">BLOG.</span>
          </h1>
          <p className="text-slate-400 text-xl font-light max-w-xl">Finance, simplified. Real advice for real people building real wealth.</p>
        </motion.div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-3 mb-16">
          {tags.map(tag => (
            <button key={tag} onClick={() => setSelectedTag(tag)}
              className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all ${
                selectedTag === tag
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}>
              {tag}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedTag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.length === 0 && (
              <div className="col-span-3 text-center text-slate-600 py-20 text-sm uppercase tracking-widest font-black italic">No posts yet in this category.</div>
            )}
            {filtered.map((post, i) => (
              <motion.article key={post.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedPost(post)}
                className="group bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 cursor-pointer hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all shadow-xl flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getTagColor(post.tag)}`}>
                    <Tag size={8} className="inline mr-1" />{post.tag}
                  </span>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all mt-1" />
                </div>
                <h2 className="text-xl font-black text-white leading-tight mb-4 group-hover:text-emerald-400 transition-colors flex-1">{post.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed font-light mb-8 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-slate-600 text-[10px] font-bold uppercase tracking-widest border-t border-white/5 pt-6 mt-auto">
                  <span className="flex items-center gap-1.5"><Calendar size={10} />{post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={10} />{post.readTime}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Blog;
