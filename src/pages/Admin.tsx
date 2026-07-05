import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import SmoothScroll from '../components/layout/SmoothScroll';

export interface Project {
  id?: string;
  title: string;
  category: string;
  description: string;
  challenge: string;
  solution: string;
  technologies: string;
  features: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  colSpan: number;
}

export interface Experience {
  id?: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  text: string;
  stars?: number;
}

export interface AdminUser {
  id?: string;
  email: string;
}

export interface ContactMsg {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: any;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'experience' | 'testimonials' | 'resume' | 'admins' | 'contacts'>('projects');
  
  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Project>({
    title: '', category: '', description: '', challenge: '', solution: '', technologies: '', features: '', githubUrl: '', liveUrl: '', imageUrl: '', colSpan: 12
  });

  // Experience State
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState<Experience>({ role: '', company: '', period: '', description: '' });

  // Testimonial State
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [testForm, setTestForm] = useState<Testimonial>({ name: '', role: '', text: '', stars: 5 });

  // Admins State
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminForm, setAdminForm] = useState({ email: '' });

  // Resume State
  const [resumeUrl, setResumeUrl] = useState('');

  // Contacts State
  const [contacts, setContacts] = useState<ContactMsg[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        if (u.email === 'prashantgupta9258@gmail.com') {
          setUser(u);
          fetchData();
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', u.email || ''));
            if (adminDoc.exists()) {
              setUser(u);
              fetchData();
            } else {
              
              signOut(auth);
              setUser(null);
            }
          } catch (e) {
            console.error(e);
            
            signOut(auth);
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    // Fetch Projects
    const pSnap = await getDocs(collection(db, 'projects'));
    setProjects(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    
    // Fetch Experiences
    const eSnap = await getDocs(collection(db, 'experience'));
    setExperiences(eSnap.docs.map(d => ({ id: d.id, ...d.data() } as Experience)));

    // Fetch Testimonials
    const tSnap = await getDocs(collection(db, 'testimonials'));
    setTestimonials(tSnap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));

    // Fetch Admins
    const aSnap = await getDocs(collection(db, 'admins'));
    setAdmins(aSnap.docs.map(d => ({ id: d.id, ...d.data() } as AdminUser)));

    // Fetch Resume
    const rDoc = await getDoc(doc(db, 'settings', 'resume'));
    if (rDoc.exists()) {
      setResumeUrl(rDoc.data().url || '');
    }

    // Fetch Contacts
    const cSnap = await getDocs(collection(db, 'contacts'));
    setContacts(cSnap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMsg)));
  };

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        
      } else {
        alert(`Login failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const logout = () => signOut(auth);

  // --- Project Handlers ---
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProjectId) await updateDoc(doc(db, 'projects', editingProjectId), projectForm as any);
      else await addDoc(collection(db, 'projects'), projectForm);
      setProjectForm({ title: '', category: '', description: '', challenge: '', solution: '', technologies: '', features: '', githubUrl: '', liveUrl: '', imageUrl: '', colSpan: 12 });
      setEditingProjectId(null);
      fetchData();
    } catch (err) { console.error(err);  }
  };
  const deleteProject = async (id: string) => {  await deleteDoc(doc(db, 'projects', id)); fetchData(); };

  // --- Experience Handlers ---
  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExpId) await updateDoc(doc(db, 'experience', editingExpId), expForm as any);
      else await addDoc(collection(db, 'experience'), expForm);
      setExpForm({ role: '', company: '', period: '', description: '' });
      setEditingExpId(null);
      fetchData();
    } catch (err) { console.error(err);  }
  };
  const deleteExp = async (id: string) => {  await deleteDoc(doc(db, 'experience', id)); fetchData(); };

  // --- Testimonial Handlers ---
  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestId) await updateDoc(doc(db, 'testimonials', editingTestId), testForm as any);
      else await addDoc(collection(db, 'testimonials'), testForm);
      setTestForm({ name: '', role: '', text: '', stars: 5 });
      setEditingTestId(null);
      fetchData();
    } catch (err) { console.error(err);  }
  };
  const deleteTest = async (id: string) => {  await deleteDoc(doc(db, 'testimonials', id)); fetchData(); };

  // --- Admin Handlers ---
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'admins', adminForm.email), { email: adminForm.email });
      setAdminForm({ email: '' });
      fetchData();
    } catch (err) { console.error(err);  }
  };
  const deleteAdmin = async (email: string) => { 
    if (email === 'prashantgupta9258@gmail.com') {  return; }
     await deleteDoc(doc(db, 'admins', email)); fetchData(); 
  };

  // --- Resume Handlers ---
  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'resume'), { url: resumeUrl });
      
    } catch (err) { console.error(err);  }
  };

  // --- Contact Handlers ---
  const deleteContact = async (id: string) => {
     await deleteDoc(doc(db, 'contacts', id)); fetchData();
  };

  if (!user) {
    return (
      <SmoothScroll>
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 pt-32">
          <div className="max-w-md w-full glass-card p-10 rounded-[32px] text-center border border-foreground/10">
            <h1 className="text-3xl font-heading font-bold mb-6">Admin Login</h1>
            <Button onClick={login} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              Sign in with Google
            </Button>
          </div>
        </div>
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll>
      <main className="pt-32 pb-24 min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-heading font-bold">Admin Dashboard</h1>
            <Button onClick={logout} variant="outline" className="border-foreground/10 hover:bg-foreground/5">Logout</Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-12 border-b border-foreground/10 pb-4">
            {(['projects', 'experience', 'testimonials', 'resume', 'contacts', 'admins'] as const).map(tab => (
              <Button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                variant={activeTab === tab ? 'default' : 'outline'}
                className="capitalize"
              >
                {tab}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {activeTab === 'projects' && (
              <>
                <div>
                  <h2 className="text-2xl font-semibold mb-6">{editingProjectId ? 'Edit Project' : 'Add New Project'}</h2>
                  <form onSubmit={handleProjectSubmit} className="space-y-4 glass-card p-8 rounded-[32px] border border-foreground/10">
                    <input required placeholder="Title" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                    <div className="pt-2">
                      <label className="block text-sm text-muted-foreground mb-2">Categories (Required)</label>
                      <div className="flex flex-wrap gap-4">
                        {['Desktop', 'Tablet', 'Mobile'].map(cat => (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={projectForm.category.split(', ').includes(cat)}
                              onChange={(e) => {
                                const currentCats = projectForm.category ? projectForm.category.split(', ').filter(Boolean) : [];
                                if (e.target.checked) {
                                  setProjectForm({...projectForm, category: [...currentCats, cat].join(', ')});
                                } else {
                                  setProjectForm({...projectForm, category: currentCats.filter(c => c !== cat).join(', ')});
                                }
                              }}
                              className="accent-primary w-4 h-4"
                            />
                            <span className="text-sm">{cat}</span>
                          </label>
                        ))}
                      </div>
                      <input type="text" required value={projectForm.category} className="hidden" onChange={()=>{}} />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground pt-2">Project Image</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        required={!projectForm.imageUrl}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const MAX_WIDTH = 800;
                                const MAX_HEIGHT = 800;
                                let width = img.width;
                                let height = img.height;

                                if (width > height) {
                                  if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                  }
                                } else {
                                  if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                  }
                                }

                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                ctx?.drawImage(img, 0, 0, width, height);
                                
                                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                                setProjectForm({...projectForm, imageUrl: compressedBase64});
                              };
                              img.src = reader.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                      />
                      {projectForm.imageUrl && (
                        <div className="mt-2">
                          <img src={projectForm.imageUrl} alt="Preview" className="h-20 object-cover rounded-lg border border-foreground/10" />
                        </div>
                      )}
                    </div>
                    <textarea required placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" rows={3} />
                    <textarea required placeholder="Challenge" value={projectForm.challenge} onChange={e => setProjectForm({...projectForm, challenge: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" rows={2} />
                    <textarea required placeholder="Solution" value={projectForm.solution} onChange={e => setProjectForm({...projectForm, solution: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" rows={2} />
                    <input required placeholder="Technologies (comma separated)" value={projectForm.technologies} onChange={e => setProjectForm({...projectForm, technologies: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                    <input required placeholder="Features (comma separated)" value={projectForm.features} onChange={e => setProjectForm({...projectForm, features: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                    <input placeholder="GitHub URL" value={projectForm.githubUrl || ''} onChange={e => setProjectForm({...projectForm, githubUrl: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                    <input required placeholder="Live URL" value={projectForm.liveUrl || ''} onChange={e => setProjectForm({...projectForm, liveUrl: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                    <label className="block text-sm text-muted-foreground pt-2">Grid Column Span (4, 8, or 12)</label>
                    <select value={projectForm.colSpan} onChange={e => setProjectForm({...projectForm, colSpan: Number(e.target.value)})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary">
                      <option value={4}>4 (Small Card)</option>
                      <option value={8}>8 (Wide Card)</option>
                      <option value={12}>12 (Full Width)</option>
                    </select>
                    <div className="pt-4 flex gap-4">
                      <Button type="submit" className="flex-1 bg-primary text-primary-foreground">{editingProjectId ? 'Update' : 'Add'}</Button>
                      {editingProjectId && <Button type="button" onClick={() => {setEditingProjectId(null); setProjectForm({ title: '', category: '', description: '', challenge: '', solution: '', technologies: '', features: '', githubUrl: '', liveUrl: '', imageUrl: '', colSpan: 12 })}} variant="outline">Cancel</Button>}
                    </div>
                  </form>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Manage Projects</h2>
                  <div className="space-y-4">
                    {projects.map(p => (
                      <div key={p.id} className="glass-card p-6 rounded-2xl border border-foreground/10 flex justify-between items-center">
                        <div><h3 className="font-semibold">{p.title}</h3><p className="text-sm text-muted-foreground">{p.category}</p></div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingProjectId(p.id!); setProjectForm(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteProject(p.id!)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && <p className="text-muted-foreground">No projects yet.</p>}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'experience' && (
              <>
                <div>
                  <h2 className="text-2xl font-semibold mb-6">{editingExpId ? 'Edit Experience' : 'Add Experience'}</h2>
                  <form onSubmit={handleExpSubmit} className="space-y-4 glass-card p-8 rounded-[32px] border border-foreground/10">
                    <input required placeholder="Role" value={expForm.role} onChange={e => setExpForm({...expForm, role: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                    <input required placeholder="Company" value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                    <input required placeholder="Period (e.g. 2020 - Present)" value={expForm.period} onChange={e => setExpForm({...expForm, period: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                    <textarea required placeholder="Description" value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" rows={3} />
                    <div className="pt-4 flex gap-4">
                      <Button type="submit" className="flex-1 bg-primary text-primary-foreground">{editingExpId ? 'Update' : 'Add'}</Button>
                      {editingExpId && <Button type="button" onClick={() => {setEditingExpId(null); setExpForm({ role: '', company: '', period: '', description: '' })}} variant="outline">Cancel</Button>}
                    </div>
                  </form>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Manage Experience</h2>
                  <div className="space-y-4">
                    {experiences.map(e => (
                      <div key={e.id} className="glass-card p-6 rounded-2xl border border-foreground/10 flex justify-between items-center">
                        <div><h3 className="font-semibold">{e.role}</h3><p className="text-sm text-muted-foreground">{e.company}</p></div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingExpId(e.id!); setExpForm(e); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteExp(e.id!)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                    {experiences.length === 0 && <p className="text-muted-foreground">No experience added.</p>}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'testimonials' && (
              <>
                <div>
                  <h2 className="text-2xl font-semibold mb-6">{editingTestId ? 'Edit Review' : 'Add Review'}</h2>
                  <form onSubmit={handleTestSubmit} className="space-y-4 glass-card p-8 rounded-[32px] border border-foreground/10">
                    <input required placeholder="Client Name" value={testForm.name} onChange={e => setTestForm({...testForm, name: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                    <input required placeholder="Client Role/Company" value={testForm.role} onChange={e => setTestForm({...testForm, role: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                    <textarea required placeholder="Review text..." value={testForm.text} onChange={e => setTestForm({...testForm, text: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" rows={4} />
                    <div className="flex items-center gap-4 py-2">
                      <label className="text-sm text-muted-foreground">Rating:</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setTestForm({...testForm, stars: star})}
                            className={`w-6 h-6 ${(testForm.stars || 5) >= star ? 'text-primary' : 'text-muted-foreground/30'} hover:text-primary transition-colors`}
                          >
                            <svg className="w-full h-full fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 flex gap-4">
                      <Button type="submit" className="flex-1 bg-primary text-primary-foreground">{editingTestId ? 'Update' : 'Add'}</Button>
                      {editingTestId && <Button type="button" onClick={() => {setEditingTestId(null); setTestForm({ name: '', role: '', text: '', stars: 5 })}} variant="outline">Cancel</Button>}
                    </div>
                  </form>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Manage Reviews</h2>
                  <div className="space-y-4">
                    {testimonials.map(t => (
                      <div key={t.id} className="glass-card p-6 rounded-2xl border border-foreground/10 flex justify-between items-center">
                        <div><h3 className="font-semibold">{t.name}</h3><p className="text-sm text-muted-foreground">{t.role}</p></div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingTestId(t.id!); setTestForm(t); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteTest(t.id!)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                    {testimonials.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'resume' && (
              <div className="lg:col-span-2 max-w-xl mx-auto w-full">
                <h2 className="text-2xl font-semibold mb-6">Manage Resume</h2>
                <form onSubmit={handleResumeSubmit} className="space-y-4 glass-card p-8 rounded-[32px] border border-foreground/10">
                  <p className="text-sm text-muted-foreground mb-4">Paste a link to your resume (e.g. Google Drive PDF link). This link will be used in the Hero section.</p>
                  <input required placeholder="https://..." value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                  <div className="pt-4">
                    <Button type="submit" className="w-full bg-primary text-primary-foreground">Save Resume URL</Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="lg:col-span-2 w-full">
                <h2 className="text-2xl font-semibold mb-6">Messages Received</h2>
                <div className="space-y-4">
                  {contacts.map(c => (
                    <div key={c.id} className="glass-card p-6 rounded-2xl border border-foreground/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{c.name}</h3>
                          <a href={`mailto:${c.email}`} className="text-primary text-sm hover:underline">{c.email}</a>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => deleteContact(c.id!)}>Delete</Button>
                      </div>
                      <p className="text-muted-foreground whitespace-pre-wrap">{c.message}</p>
                      {c.createdAt && (
                        <div className="mt-4 text-xs text-muted-foreground/50">
                          {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ''}
                        </div>
                      )}
                    </div>
                  ))}
                  {contacts.length === 0 && <p className="text-muted-foreground">No messages received yet.</p>}
                </div>
              </div>
            )}

            {activeTab === 'admins' && (
              <>
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Add Admin</h2>
                  <form onSubmit={handleAdminSubmit} className="space-y-4 glass-card p-8 rounded-[32px] border border-foreground/10">
                    <p className="text-sm text-muted-foreground mb-4">Add email addresses that are allowed to access this admin dashboard.</p>
                    <input required type="email" placeholder="email@example.com" value={adminForm.email} onChange={e => setAdminForm({ email: e.target.value.toLowerCase() })} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                    <div className="pt-4">
                      <Button type="submit" className="w-full bg-primary text-primary-foreground">Whitelist Email</Button>
                    </div>
                  </form>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Authorized Admins</h2>
                  <div className="space-y-4">
                    <div className="glass-card p-6 rounded-2xl border border-foreground/10 flex justify-between items-center">
                      <div><h3 className="font-semibold">prashantgupta9258@gmail.com</h3><p className="text-xs text-primary mt-1">Super Admin (Cannot be removed)</p></div>
                    </div>
                    {admins.map(a => (
                      <div key={a.id} className="glass-card p-6 rounded-2xl border border-foreground/10 flex justify-between items-center">
                        <div><h3 className="font-semibold">{a.email}</h3></div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive" onClick={() => deleteAdmin(a.id!)}>Revoke</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </main>
    </SmoothScroll>
  );
}
