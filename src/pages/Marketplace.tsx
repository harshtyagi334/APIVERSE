import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Star, Zap, Clock, Users, ChevronRight, Sparkles, TrendingUp, ShieldCheck, Compass, Info, Brain, CreditCard, Shield, Database, MessageSquare, Wrench, Map, Fingerprint, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_APIS } from "@/lib/mock-data";
import { API } from "@/types";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/lib/AuthContext";
import { useUser } from "@/hooks/useUser";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Tag as TagIcon, Loader2 } from "lucide-react";
import { useAPIs } from "@/hooks/useAPIs";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, collection, getDocs, writeBatch, query, limit } from "firebase/firestore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TryItModal } from "@/components/marketplace/TryItModal";

export default function Marketplace() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { user } = useAuth();
  const { profile } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<'all' | 'newest' | 'trending' | 'performance' | 'legacy'>('all');
  const [testApi, setTestApi] = useState<API | null>(null);
  
  // New API Form State
  const [isAddApiOpen, setIsAddApiOpen] = useState(false);
  const [newApi, setNewApi] = useState({ 
    name: '', 
    description: '', 
    category: '', 
    provider: '',
    baseUrl: '',
    icon: '',
    pricing: 'Freemium' 
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const { apis, loading: apisLoading } = useAPIs({
    category: selectedCategory,
    searchQuery,
    sortBy
  });

  const isAdmin = profile?.role === 'admin';
  const categoryNames = useMemo(() => ["All", ...categories.map(c => c.name)], [categories]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & Machine Learning': return <Brain className="w-8 h-8" />;
      case 'Payments': return <CreditCard className="w-8 h-8" />;
      case 'Security': return <Shield className="w-8 h-8" />;
      case 'Data & Analytics': return <Database className="w-8 h-8" />;
      case 'Communication': return <MessageSquare className="w-8 h-8" />;
      case 'DevTools': return <Wrench className="w-8 h-8" />;
      case 'Maps & Location': return <Map className="w-8 h-8" />;
      case 'Identity': return <Fingerprint className="w-8 h-8" />;
      default: return <Activity className="w-8 h-8" />;
    }
  };

  // Seeding logic for demo purposes if empty
  const seedMarketplace = async () => {
    if (!isAdmin) return;
    try {
      const q = query(collection(db, 'apis'), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        const batch = writeBatch(db);
        MOCK_APIS.forEach((api) => {
          const docRef = doc(collection(db, 'apis'));
          batch.set(docRef, {
            ...api,
            createdAt: serverTimestamp(),
            usageCount: Math.floor(Math.random() * 1000000),
            latency: Math.floor(Math.random() * 200 + 50),
            uptime: 99 + Math.random()
          });
        });
        await batch.commit();
        toast.success("Marketplace seeded with baseline protocols.");
      }
    } catch (e) {
      console.error("Seeding failed", e);
    }
  };

  const handleRegisterApi = async () => {
    if (!newApi.name || !newApi.category) {
      toast.error("Protocol name and category are required.");
      return;
    }

    setIsRegistering(true);
    const id = `api-${Math.random().toString(36).substr(2, 9)}`;
    const apiData = {
      ...newApi,
      id,
      provider: newApi.provider || (user?.displayName ?? 'Independent Node'),
      rating: 5.0,
      reviewsCount: 0,
      usageCount: 0,
      latency: 100,
      uptime: 100,
      tags: [newApi.category.toLowerCase()],
      isPremium: false,
      isTrending: false,
      docsUrl: '#',
      createdAt: new Date().toISOString(),
      serverTimestamp: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'apis', id), apiData);
      toast.success("Protocol registered in global registry.");
      setIsAddApiOpen(false);
      setNewApi({ name: '', description: '', category: '', provider: '', baseUrl: '', icon: '', pricing: 'Freemium' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `apis/${id}`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
          <div className="max-w-2xl w-full">
            <h1 className="text-[12vw] sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-6 uppercase">
              Discover<br/>
              <span className="text-foreground/30">Protocols</span>
            </h1>
            <p className="text-foreground/50 text-base sm:text-lg lg:text-xl max-w-sm font-light leading-relaxed">
              High-performance APIs, verified for production reliability and developer experience.
            </p>
          </div>
          <div className="flex flex-col gap-6 w-full md:w-auto">
            <div className="relative group w-full md:w-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30 w-5 h-5" />
              <Input 
                placeholder="Query Registry..." 
                className="pl-14 pr-6 py-8 rounded-full border-border bg-foreground/5 focus-visible:ring-1 focus-visible:ring-foreground/20 text-base sm:text-lg w-full md:w-[400px] font-mono tracking-tighter"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 sm:flex gap-2">
              {[
                { label: "Newest", value: "newest" as const },
                { label: "Popularity", value: "trending" as const },
                { label: "Performance", value: "performance" as const },
                { label: "Legacy", value: "legacy" as const },
              ].map((btn) => (
                <button 
                  key={btn.value} 
                  onClick={() => setSortBy(sortBy === btn.value ? 'all' : btn.value)}
                  className={`px-4 sm:px-6 py-3 border transition-all font-mono rounded-full uppercase tracking-widest text-[10px] font-bold ${
                    sortBy === btn.value 
                      ? "bg-foreground text-background border-foreground shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                      : "bg-foreground/5 border-border text-foreground hover:bg-foreground/10"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
              {(sortBy !== 'all' || selectedCategory !== 'All' || searchQuery !== '') && (
                <button 
                  onClick={() => {
                    setSortBy('all');
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-4 sm:px-6 py-3 border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all font-mono rounded-full uppercase tracking-widest text-[10px] font-bold"
                >
                  Reset
                </button>
              )}
              {isAdmin && (
                <Dialog open={isAddApiOpen} onOpenChange={setIsAddApiOpen}>
                  <DialogTrigger render={
                    <button className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 text-white font-bold text-[10px] rounded-full uppercase tracking-widest hover:bg-indigo-600 transition-all font-mono shadow-lg shadow-indigo-500/20">
                      <Plus className="w-3 h-3" />
                      Register
                    </button>
                  } />
                  <DialogContent className="glass-premium border-border text-foreground rounded-[2.5rem] p-8 max-w-lg overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic">
                        Register <span className="text-indigo-500">Protocol</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-4">Protocol Identity</label>
                          <Input 
                            placeholder="e.g. Nexus Core" 
                            className="h-14 rounded-2xl bg-foreground/5 border-border px-6 focus:ring-indigo-500/50"
                            value={newApi.name}
                            onChange={(e) => setNewApi({...newApi, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-4">Provider</label>
                          <Input 
                            placeholder="e.g. Google AI" 
                            className="h-14 rounded-2xl bg-foreground/5 border-border px-6 focus:ring-indigo-500/50"
                            value={newApi.provider}
                            onChange={(e) => setNewApi({...newApi, provider: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-4">Classification Registry</label>
                        <select 
                          className="w-full h-14 rounded-2xl bg-foreground/5 border-border px-6 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none appearance-none cursor-pointer"
                          value={newApi.category}
                          onChange={(e) => setNewApi({...newApi, category: e.target.value})}
                        >
                          <option value="" disabled className="bg-background">Select Class...</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.name} className="bg-background">
                              {cat.name.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-4">Endpoint Base URL</label>
                        <Input 
                          placeholder="https://api.nexus.io" 
                          className="h-14 rounded-2xl bg-foreground/5 border-border px-6 focus:ring-indigo-500/50"
                          value={newApi.baseUrl}
                          onChange={(e) => setNewApi({...newApi, baseUrl: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-4">Instructional Overview</label>
                        <textarea 
                          placeholder="Define the functional scope..." 
                          className="w-full min-h-[100px] rounded-2xl bg-foreground/5 border-border p-6 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all resize-none font-light text-sm"
                          value={newApi.description}
                          onChange={(e) => setNewApi({...newApi, description: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-4">Icon URL</label>
                          <Input 
                            placeholder="https://..." 
                            className="h-14 rounded-2xl bg-foreground/5 border-border px-6"
                            value={newApi.icon}
                            onChange={(e) => setNewApi({...newApi, icon: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-4">Monetization</label>
                          <select 
                            className="w-full h-14 rounded-2xl bg-foreground/5 border-border px-6 text-sm"
                            value={newApi.pricing}
                            onChange={(e) => setNewApi({...newApi, pricing: e.target.value})}
                          >
                            <option value="Free" className="bg-background">FREE</option>
                            <option value="Freemium" className="bg-background">FREEMIUM</option>
                            <option value="Paid" className="bg-background">PAID</option>
                          </select>
                        </div>
                      </div>

                      <Button 
                        disabled={isRegistering}
                        onClick={handleRegisterApi}
                        className="w-full h-16 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-xs mt-4 hover:opacity-90 transition-all font-mono"
                      >
                        {isRegistering ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Initialize Deployment"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        {/* Categories / Filters */}
        <div className="mb-16 border-b border-border pb-8 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 min-w-max md:min-w-0 md:flex-wrap">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] uppercase tracking-[0.25em] font-bold transition-all px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === cat ? "text-foreground bg-foreground/10" : "text-foreground/40 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {apisLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-8 bg-foreground/5 border border-border rounded-[2.5rem] backdrop-blur-md space-y-6">
                <div className="flex items-center gap-6">
                  <Skeleton className="w-16 h-16 rounded-2xl bg-foreground/10" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4 bg-foreground/10" />
                    <div className="flex gap-2">
                       <Skeleton className="h-3 w-16 bg-foreground/10" />
                       <Skeleton className="h-3 w-20 bg-foreground/10" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-foreground/10" />
                  <Skeleton className="h-4 w-[90%] bg-foreground/10" />
                  <Skeleton className="h-4 w-[80%] bg-foreground/10" />
                </div>
                <div className="pt-6 border-t border-border flex justify-between items-center">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24 bg-foreground/10" />
                    <Skeleton className="h-2 w-16 bg-foreground/10" />
                  </div>
                  <Skeleton className="h-3 w-20 bg-foreground/10" />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {apis.map((api, index) => (
                <motion.div
                  key={api.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.35, ease: "easeOut" }}
                  onClick={() => navigate(`/marketplace/${api.id}`)}
                  className="group relative p-8 bg-foreground/5 border border-border rounded-[2.5rem] hover:bg-foreground/[0.07] transition-colors cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px] -mr-24 -mt-24 pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />
                  
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center font-bold text-indigo-400 p-3 shadow-2xl">
                      {getCategoryIcon(api.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-xl tracking-tight uppercase font-mono">{api.name}</h3>
                        {api.isTrending && <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />}
                        {api.createdAt && (new Date().getTime() - new Date(api.createdAt).getTime()) < 24 * 60 * 60 * 1000 && (
                          <Badge className="bg-indigo-500 text-white border-none text-[8px] px-1.5 py-0 font-black h-4 flex items-center justify-center animate-pulse">
                            NEW
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-widest">{api.category}</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                          {api.uptime}% UPTIME
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-foreground/50 leading-relaxed mb-8 relative z-10 font-light text-sm line-clamp-3">
                    {api.description}
                  </p>

                  <div className="flex justify-between items-center relative z-10 pt-6 border-t border-border">
                    <div className="flex flex-col">
                      <div className="text-[10px] font-mono text-foreground/20 tracking-widest uppercase">
                        ID: {api.id.split('-')[0]}
                      </div>
                      <div className="text-[8px] font-mono text-indigo-500/50 uppercase tracking-widest mt-1">
                        {api.provider}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button 
                        onClick={(e) => { e.stopPropagation(); setTestApi(api); }}
                        variant="outline" 
                        size="sm" 
                        className="rounded-full text-[10px] font-black uppercase tracking-widest border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:text-white h-8"
                      >
                        Try It
                      </Button>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-indigo-400 transition-colors font-mono">
                        Access &rarr;
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {!apisLoading && apis.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No APIs Found</h3>
            <p className="text-muted-foreground mb-8">Try adjusting your search or filters to find what you're looking for.</p>
            {isAdmin && (
              <Button onClick={seedMarketplace} variant="outline" className="rounded-full px-8 border-indigo-500/30 text-indigo-500">
                Seed Baseline Protocols
              </Button>
            )}
          </div>
        )}
      </div>

      <TryItModal 
        api={testApi} 
        isOpen={!!testApi} 
        onClose={() => setTestApi(null)} 
      />
    </div>
  );
}
