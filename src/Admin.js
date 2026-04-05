import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, X, Lock, LogOut, Landmark, Eye, FileText } from 'lucide-react';

const ADMIN_PASSWORD = 'kushal2024';

const TAGS = ['Taxation', 'Investing', 'Personal Finance', 'Business', 'Planning'];

const Admin = ({ onNavigateHome }) => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', tag: 'Personal Finance', readTime: '3 min read' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('kp_admin_auth');
    if (auth === 'true') setIsAuthed(true);
    loadPosts();
  }, []);

  const loadPosts = () => {
    const stored = localStorage.getItem('kp_blog_posts');
    if (stored) setPosts(JSON.parse(stored));
  };

  const savePosts = (updated) => {
    localStorage.setItem('kp_blog_posts', JSON.stringify(updated));
    setPosts(updated);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthed(true);
      sessionStorage.setItem('kp_admin_auth', 'true');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthed(false);
    sessionStorage.removeItem('kp_admin_auth');
  };

  const handleSave = () => {
    if (!form.title || !form.content) return;
    let updated;
    if (editingPost) {
      updated = posts.map(p => p.id === editingPost.id ? { ...editingPost, ...form } : p);
    } else {
      const newPost = {
        id: Date.now(),
        ...form,
        date: new Date().toISOString().split('T')[0],
      };
      updated = [newPost, ...posts];
    }
    savePosts(updated);
    setEditingPost(null);
    setIsCreating(false);
    setForm({ title: '', excerpt: '', content: '', tag: 'Personal Finance', readTime: '3 min read' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsCreating(true);
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content, tag: post.tag, readTime: post.readTime });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this post?')) {
      savePosts(posts.filter(p => p.id !== id));
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingPost(null);
    setForm({ title: '', excerpt: '', content: '', tag: 'Personal Finance', readTime: '3 min read' });
  };

  // Login screen
  if (!isAuthed) {
    return (
      <div className="bg-[#020617] text-white min-h-screen font-sans flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-white/5 mx-auto mb-6">
              <Lock size={28} className="text-emerald-400" />
            </div>
            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-3">Admin Access</div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">BLOG MANAGER</h1>
          </div>
          <form onSubmit={handleLogin} className="bg-slate-900/60 border border-white/5 rounded-3xl p-10 shadow-2xl">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => { setPassword(e.target.value); setPasswordError(false); }}
              className={`w-full bg-white/5 border rounded-2xl px-6 py-5 outline-none text-white placeholder:text-gray-600 mb-4 text-lg transition-all ${passwordError ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-emerald-500'}`}
              autoFocus
            />
            {passwordError && <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4 text-center">Incorrect password</p>}
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-sm active:scale-[0.98]">
              Enter
            </button>
            <button type="button" onClick={() => onNavigateHome()} className="w-full mt-4 text-slate-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors py-2">
              ← Back to site
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#020617] text-white min-h-screen font-sans">
      {/* Header */}
      <nav className="fixed w-full z-[100] py-4 bg-slate-950/90 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 flex justify-between items-center">
          <button onClick={() => onNavigateHome()} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-xl flex items-center justify-center border border-white/5">
              <Landmark size={20} className="text-emerald-400" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest text-slate-400">Admin Panel</span>
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigateHome('blog')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
              <Eye size={14} /> View Blog
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-24 px-6 sm:px-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-2">Blog Manager</div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase">YOUR POSTS</h1>
          </div>
          <button onClick={() => { setIsCreating(true); setEditingPost(null); setForm({ title: '', excerpt: '', content: '', tag: 'Personal Finance', readTime: '3 min read' }); }}
            className="flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95">
            <Plus size={18} /> New Post
          </button>
        </div>

        {/* Saved toast */}
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl">
              ✓ Post saved successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor */}
        <AnimatePresence>
          {isCreating && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-slate-900/60 border border-emerald-500/20 rounded-[2rem] p-8 md:p-12 mb-12 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">{editingPost ? 'Edit Post' : 'New Post'}</h2>
                <button onClick={handleCancel} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} className="text-slate-400" /></button>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Title *</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="Your post title..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-all text-white placeholder:text-gray-600 text-lg font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Category</label>
                  <select value={form.tag} onChange={e => setForm({...form, tag: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-all text-white">
                    {TAGS.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Read Time</label>
                  <input value={form.readTime} onChange={e => setForm({...form, readTime: e.target.value})}
                    placeholder="e.g. 4 min read"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-all text-white placeholder:text-gray-600" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Short Excerpt (shown on blog listing)</label>
                  <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})}
                    placeholder="A brief summary that appears on the blog page..."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-all text-white placeholder:text-gray-600 resize-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Content * (use **bold text** for headings)</label>
                  <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                    placeholder="Write your post here...&#10;&#10;Use double line breaks for paragraphs.&#10;Use **Your Heading** for bold headings."
                    rows={14}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-all text-white placeholder:text-gray-600 resize-none font-mono text-sm leading-relaxed" />
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <button onClick={handleCancel} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={!form.title || !form.content}
                  className="flex items-center gap-3 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95">
                  <Save size={16} /> {editingPost ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts list */}
        {posts.length === 0 ? (
          <div className="text-center py-24 text-slate-600">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-black uppercase tracking-widest text-sm italic">No posts yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between gap-4 hover:border-white/10 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{post.tag}</span>
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest">{post.date}</span>
                  </div>
                  <h3 className="font-black text-white truncate">{post.title}</h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => handleEdit(post)}
                    className="p-3 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 border border-white/10 rounded-xl transition-all">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(post.id)}
                    className="p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
