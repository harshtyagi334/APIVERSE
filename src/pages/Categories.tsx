import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderPlus, 
  Trash2, 
  Edit3, 
  Search, 
  ChevronRight, 
  Plus, 
  X,
  Tag,
  Palette,
  Layout
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/lib/AuthContext';
import { useUser } from '@/hooks/useUser';

export default function Categories() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  const { user } = useAuth();
  const { profile } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form State
  const [newCat, setNewCat] = useState({ name: '', description: '', icon: '', color: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newCat.name) return;
    await addCategory(newCat);
    setNewCat({ name: '', description: '', icon: '', color: '' });
    setIsAddDialogOpen(false);
  };

  const handleUpdate = async () => {
    if (!editingId || !newCat.name) return;
    await updateCategory(editingId, newCat);
    setEditingId(null);
    setNewCat({ name: '', description: '', icon: '', color: '' });
    setIsAddDialogOpen(false);
  };

  const startEdit = (cat: any) => {
    setNewCat({ 
      name: cat.name, 
      description: cat.description, 
      icon: cat.icon || '', 
      color: cat.color || '' 
    });
    setEditingId(cat.id);
    setIsAddDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="pt-32 px-10 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto space-y-12">
          <Skeleton className="h-20 w-96 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 rounded-[2rem]" />)}
          </div>
        </div>
      </div>
    );
  }

  // Only Admin check
  const isAdmin = profile?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="pt-32 min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Layout className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Restricted <span className="text-indigo-500">Access</span></h2>
          <p className="text-white/50 mb-8 font-light">This administrative console is reserved for authorized system engineers only. Please return to the marketplace.</p>
          <Button className="rounded-full px-10 h-14 bg-white text-black font-bold uppercase tracking-widest text-[10px]" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
          <div className="max-w-2xl">
            <h1 className="text-[10vw] md:text-8xl font-black tracking-tighter leading-none mb-6 uppercase">
              Registry<br/>
              <span className="text-white/30 editorial-gradient">Taxonomy</span>
            </h1>
            <p className="text-white/50 text-xl max-w-sm font-light leading-relaxed">
              Define the structural categories used to index global protocols across the APIVerse ecosystem.
            </p>
          </div>
          
          <div className="flex flex-col gap-6 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
              <Input 
                placeholder="Search Taxonomy..." 
                className="pl-14 pr-6 py-8 rounded-full border-white/5 bg-white/5 focus-visible:ring-1 focus-visible:ring-white/20 text-lg w-full md:w-[400px] font-mono tracking-tighter"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingId(null);
                setNewCat({ name: '', description: '', icon: '', color: '' });
              }
            }}>
              <DialogTrigger render={
                <Button className="h-16 rounded-full px-10 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-white/90 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                  <Plus className="mr-2 w-4 h-4" />
                  Define New Class
                </Button>
              } />
              <DialogContent className="glass-premium border-white/10 text-white rounded-[2.5rem] p-8 max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic">
                    {editingId ? 'Modify' : 'Define'} <span className="text-indigo-500">Category</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">Class Identification</label>
                    <Input 
                      placeholder="e.g. Artificial Intelligence" 
                      className="h-14 rounded-2xl bg-white/5 border-white/10 px-6 focus:ring-indigo-500/50"
                      value={newCat.name}
                      onChange={(e) => setNewCat({...newCat, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">Definition Payload</label>
                    <textarea 
                      placeholder="Describe the category scope..." 
                      className="w-full min-h-[120px] rounded-2xl bg-white/5 border-white/10 p-6 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all resize-none font-light text-sm"
                      value={newCat.description}
                      onChange={(e) => setNewCat({...newCat, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">Visual Icon ( Lucide )</label>
                      <Input 
                        placeholder="Sparkles" 
                        className="h-14 rounded-2xl bg-white/5 border-white/10 px-6"
                        value={newCat.icon}
                        onChange={(e) => setNewCat({...newCat, icon: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">Chroma Code ( HEX )</label>
                      <Input 
                        placeholder="#6366f1" 
                        className="h-14 rounded-2xl bg-white/5 border-white/10 px-6"
                        value={newCat.color}
                        onChange={(e) => setNewCat({...newCat, color: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs mt-4"
                    onClick={editingId ? handleUpdate : handleAdd}
                  >
                    {editingId ? 'Push Update' : 'Initialize Category'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.3, ease: "easeOut" }}
                className="group relative p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/[0.07] transition-colors overflow-hidden"
              >
                <div 
                  className="absolute top-0 right-0 w-48 h-48 blur-[80px] -mr-24 -mt-24 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: cat.color || '#6366f1' }}
                />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl">
                    <Tag className="w-6 h-6" style={{ color: cat.color || '#6366f1' }} />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(cat)}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </button>
                    <Dialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
                      <DialogTrigger render={
                        <button 
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 transition-colors group/del"
                          onClick={() => setCategoryToDelete(cat)}
                        >
                          <Trash2 className="w-4 h-4 text-white/40 group-hover/del:text-red-500 transition-colors" />
                        </button>
                      } />
                      <DialogContent className="glass-premium border-white/10 text-white rounded-[2.5rem] p-8 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic text-red-500">
                            Terminate <span className="text-white">Classification</span>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 mt-6">
                          <p className="text-white/60 font-light leading-relaxed">
                            You are about to delete the <span className="text-white font-bold">{categoryToDelete?.name}</span> taxonomy class. 
                            This action is <span className="text-red-400 font-bold uppercase tracking-widest">irreversible</span> and will orphan all protocols currently indexed under this registry.
                          </p>
                          <div className="flex gap-4">
                            <Button 
                              variant="ghost" 
                              className="flex-1 h-14 rounded-2xl border border-white/10 text-white/60 uppercase tracking-widest text-[10px]"
                              onClick={() => setCategoryToDelete(null)}
                            >
                              Abort
                            </Button>
                            <Button 
                              className="flex-1 h-14 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-red-600"
                              onClick={async () => {
                                await deleteCategory(categoryToDelete.id);
                                setCategoryToDelete(null);
                              }}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <h3 className="font-bold text-2xl tracking-tighter mb-2 uppercase italic font-serif relative z-10">{cat.name}</h3>
                <p className="text-white/40 leading-relaxed mb-8 relative z-10 font-light text-sm line-clamp-3">
                  {cat.description || 'No definition payload provided for this category class.'}
                </p>

                <div className="flex justify-between items-center relative z-10 pt-6 border-t border-white/5 text-[10px] font-mono tracking-widest text-white/20 uppercase">
                  <span>ID: {cat.id}</span>
                  <span className="text-white/40">{new Date(cat.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredCategories.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-widest text-white/40">No Taxonomy Matches</h3>
              <p className="text-white/20 text-sm font-light mt-2">Try adjusting your search query or define a new category class.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
