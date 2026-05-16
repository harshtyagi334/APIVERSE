import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
    MessageSquare, ThumbsUp, Share2, 
    MessageCircle, MoreVertical, Search, 
    Filter, Users, Plus, TrendingUp,
    MessageCircleCode, ChevronRight, Star,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { db, auth, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";

export default function Community() {
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [isDiscussionDialogOpen, setIsDiscussionDialogOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState("general");
    
    const discussionGroups = [
        { id: "general", name: "General Nexus", icon: MessageSquare, description: "General developer communication and strategy." },
        { id: "showcase", name: "API Prototypes", icon: Zap, description: "Share and demo your latest protocol integrations." },
        { id: "updates", name: "Nexus Release", icon: TrendingUp, description: "Official updates and protocol version logs." },
        { id: "bugs", name: "Optimizations", icon: MessageCircleCode, description: "Technical help and performance debugging." }
    ];

    const [reviewForm, setReviewForm] = useState({
        apiName: "",
        rating: 5,
        content: "",
        pros: "",
        cons: ""
    });

    const [discussionForm, setDiscussionForm] = useState({
        title: "",
        content: "",
        tags: "",
        groupId: "general"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recentReviews, setRecentReviews] = useState<any[]>([]);
    const [realDiscussions, setRealDiscussions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [discussionsLoading, setDiscussionsLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, "api_reviews"), orderBy("createdAt", "desc"), limit(5));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRecentReviews(reviews);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching reviews:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setDiscussionsLoading(true);
        const q = query(
            collection(db, "discussions"), 
            orderBy("createdAt", "desc"),
            limit(20)
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const filtered = selectedGroup === 'all' 
                ? docs 
                : docs.filter((d: any) => d.groupId === selectedGroup);
            setRealDiscussions(filtered);
            setDiscussionsLoading(false);
        }, (error) => {
            console.error("Error fetching discussions:", error);
            setDiscussionsLoading(false);
        });
        return () => unsubscribe();
    }, [selectedGroup]);

    const handleSubmitReview = async () => {
        if (!auth.currentUser) {
            toast.error("Please sign in to broadcast reviews.");
            return;
        }

        if (!reviewForm.apiName || !reviewForm.content) {
            toast.error("Please fill in the protocol identifier and feedback.");
            return;
        }

        setIsSubmitting(true);
        const path = "api_reviews";
        try {
            await addDoc(collection(db, path), {
                ...reviewForm,
                authorId: auth.currentUser.uid,
                authorName: auth.currentUser.displayName || "Anonymous",
                createdAt: serverTimestamp(),
            });

            toast.success("Protocol review broadcasted to the nexus.");
            setIsReviewDialogOpen(false);
            setReviewForm({ apiName: "", rating: 5, content: "", pros: "", cons: "" });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, path);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitDiscussion = async () => {
        if (!auth.currentUser) {
            toast.error("Sign in to access the communication uplink.");
            return;
        }

        if (!discussionForm.title || !discussionForm.content) {
            toast.error("Subject and content required for transmission.");
            return;
        }

        setIsSubmitting(true);
        const path = "discussions";
        try {
            await addDoc(collection(db, path), {
                title: discussionForm.title,
                content: discussionForm.content,
                groupId: discussionForm.groupId,
                tags: discussionForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ""),
                authorId: auth.currentUser.uid,
                authorName: auth.currentUser.displayName || "Anonymous",
                authorAvatar: auth.currentUser.photoURL || "",
                likes: 0,
                commentCount: 0,
                createdAt: serverTimestamp(),
                isTrending: false
            });

            toast.success("Transmission stabilized. Topic shared with members.");
            setIsDiscussionDialogOpen(false);
            setDiscussionForm({ title: "", content: "", tags: "", groupId: "general" });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, path);
        } finally {
            setIsSubmitting(false);
        }
    };

    const staticDiscussionsPlaceholder = [
        {
            id: 'p1',
            authorName: "dev_nexus",
            title: "Scaling Gemini API for 100k+ real-time users",
            content: "Has anyone successfully implemented efficient caching strategies for Gemini multimodal responses? I'm seeing some latency spikes during peak hours...",
            tags: ["AI", "Scaling", "Gemini"],
            likes: 42,
            commentCount: 15,
            createdAt: new Date().toISOString(),
            isTrending: true,
            groupId: 'general'
        },
        {
            id: 'p2',
            authorName: "frontend_queen",
            title: "The best React hooks for Stripe integration",
            content: "I've been experimenting with custom hooks to handle complex Stripe payment flows. Here's a pattern that reduced my bundle size by 15%...",
            tags: ["React", "Stripe", "Fintech"],
            likes: 128,
            commentCount: 34,
            createdAt: new Date().toISOString(),
            isTrending: true,
            groupId: 'showcase'
        }
    ];

    const displayDiscussions = realDiscussions.length > 0 
        ? realDiscussions 
        : staticDiscussionsPlaceholder.filter(d => selectedGroup === 'all' || d.groupId === selectedGroup);

    return (
        <div className="pt-32 pb-24 min-h-screen bg-background">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Community Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6"
                        >
                            <Users className="w-3 h-3" />
                            <span>DEVELOPER ECOSYSTEM</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-tight uppercase font-serif">
                            Nexus <span className="text-indigo-500 underline decoration-indigo-500/30">Intelligence.</span> <br /> 
                            <span className="opacity-40">Sync Your Strategy.</span>
                        </h1>
                    </div>
                    
                    <Dialog open={isDiscussionDialogOpen} onOpenChange={setIsDiscussionDialogOpen}>
                        <DialogTrigger render={
                            <Button size="lg" className="rounded-2xl px-10 py-8 bg-indigo-500 hover:bg-indigo-600 gap-3 shadow-2xl shadow-indigo-500/30 text-xs font-black uppercase tracking-widest group">
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                Initiate Uplink
                            </Button>
                        } />
                        <DialogContent className="glass-premium border-border text-foreground rounded-[3rem] p-6 sm:p-10 max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                            <DialogHeader>
                                <DialogTitle className="text-4xl font-black tracking-tighter uppercase italic">Open <span className="text-indigo-500">Uplink</span></DialogTitle>
                                <DialogDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground opacity-70">Broadcast your technical discovery to the global nexus.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Frequency Group Selection</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {discussionGroups.map(group => (
                                                <Button
                                                    key={group.id}
                                                    variant="outline"
                                                    type="button"
                                                    className={`h-auto py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-tight border-border transition-all flex flex-col gap-2 items-center justify-center text-center leading-none ${discussionForm.groupId === group.id ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'hover:bg-foreground/5'}`}
                                                    onClick={() => setDiscussionForm({ ...discussionForm, groupId: group.id })}
                                                >
                                                    <group.icon className="w-4 h-4" />
                                                    <span className="truncate w-full">{group.name.split(' ')[0]}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Meta Tags (comma separated)</Label>
                                        <Input 
                                            placeholder="React, scaling, bug" 
                                            className="bg-foreground/5 border-border rounded-xl h-12" 
                                            value={discussionForm.tags}
                                            onChange={(e) => setDiscussionForm({ ...discussionForm, tags: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Subject Header</Label>
                                    <Input 
                                        placeholder="Optimizing Protocol Latency..." 
                                        className="bg-foreground/5 border-border rounded-2xl h-14 text-lg font-bold" 
                                        value={discussionForm.title}
                                        onChange={(e) => setDiscussionForm({ ...discussionForm, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Technical Payload</Label>
                                    <textarea 
                                        className="w-full min-h-[160px] bg-foreground/5 border border-border rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none scrollbar-hide" 
                                        placeholder="Describe your implementation or finding with full technical detail..." 
                                        value={discussionForm.content}
                                        onChange={(e) => setDiscussionForm({ ...discussionForm, content: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button 
                                    disabled={isSubmitting}
                                    onClick={handleSubmitDiscussion}
                                    className="w-full h-16 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20"
                                >
                                    {isSubmitting ? "ENCRYPTING..." : "Broadcast to Nexus"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Groups Navigation Mobile */}
                    <div className="lg:hidden flex overflow-x-auto gap-3 pb-4 scrollbar-hide -mx-4 px-4 sticky top-24 z-30 bg-background/80 backdrop-blur-md py-4">
                        {discussionGroups.map((group) => (
                            <Button
                                key={group.id}
                                variant={selectedGroup === group.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedGroup(group.id)}
                                className={`rounded-full flex-shrink-0 uppercase tracking-widest text-[10px] font-black h-10 px-6 ${selectedGroup === group.id ? 'bg-indigo-500' : 'glass'}`}
                            >
                                <group.icon className="w-3 h-3 mr-2" />
                                {group.name}
                            </Button>
                        ))}
                    </div>

                    {/* Left Sidebar - Desktop Groups */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-10">
                        <div className="space-y-2">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500/60 mb-6 font-mono">Frequency Bands</h4>
                             <div className="space-y-2">
                                {discussionGroups.map((group) => (
                                    <button
                                        key={group.id}
                                        onClick={() => setSelectedGroup(group.id)}
                                        className={`w-full text-left p-5 rounded-3xl group transition-all relative overflow-hidden ${
                                            selectedGroup === group.id 
                                            ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20" 
                                            : "hover:bg-foreground/5 text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <group.icon className={`w-5 h-5 ${selectedGroup === group.id ? 'text-white' : 'text-indigo-400'}`} />
                                            <div>
                                                <div className="text-xs font-black uppercase tracking-widest">{group.name}</div>
                                                <div className={`text-[9px] mt-1 line-clamp-1 ${selectedGroup === group.id ? 'text-indigo-100' : 'text-muted-foreground'}`}>
                                                    {group.description}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                             </div>
                        </div>

                        <Card className="glass border-border rounded-[2.5rem] p-8">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-6 font-mono">Recent Reviews</h4>
                            <div className="space-y-6">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="space-y-3 pb-6 border-b border-border/40 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-center">
                                                <Skeleton className="h-3 w-20 bg-foreground/10" />
                                                <Skeleton className="h-3 w-16 bg-foreground/10" />
                                            </div>
                                            <Skeleton className="h-4 w-32 bg-foreground/10" />
                                        </div>
                                    ))
                                ) : (recentReviews.length > 0 ? recentReviews : [
                                    { authorName: "alpha_coder", apiName: "Gemini Vision", rating: 5 },
                                    { authorName: "fintech_labs", apiName: "Stripe Global", rating: 4 }
                                ]).map((rev, i) => (
                                    <div key={rev.id || i} className="space-y-2 pb-6 border-b border-border/40 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">@{rev.authorName}</span>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, j) => (
                                                    <Star key={j} className={`w-2.5 h-2.5 ${j < rev.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground/30'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-bold tracking-tight uppercase leading-relaxed">on <span className="text-indigo-400">{rev.apiName}</span></p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </aside>

                    {/* Main Feed */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground font-mono">Feed Transmission</h3>
                                <Badge className="rounded-full bg-emerald-500/10 text-emerald-500 border-none uppercase text-[8px] tracking-[0.2em] font-black">Live Uplink</Badge>
                            </div>
                            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                                <DialogTrigger render={
                                    <Button variant="ghost" className="text-indigo-400 hover:bg-indigo-500/10 rounded-full text-[10px] uppercase font-black tracking-widest px-6 h-10 border border-indigo-500/30">
                                        Post Review
                                    </Button>
                                } />
                                <DialogContent className="glass-premium border-border text-foreground rounded-[3rem] p-6 sm:p-10 max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide">
                                    <DialogHeader>
                                        <DialogTitle className="text-3xl sm:text-4xl font-black tracking-tighter uppercase italic">Broadcast <span className="text-indigo-500">Analysis</span></DialogTitle>
                                        <DialogDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground opacity-70">Contribute to the collective intelligence.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6 py-6">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Protocol / API Identity</Label>
                                            <Input 
                                                placeholder="e.g. Stripe Global Sync" 
                                                className="bg-foreground/5 border-border rounded-xl h-12" 
                                                value={reviewForm.apiName}
                                                onChange={(e) => setReviewForm({ ...reviewForm, apiName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Experience Index</Label>
                                            <div className="flex gap-2 sm:gap-3">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Button 
                                                        key={s} 
                                                        variant="ghost" 
                                                        className={`flex-1 h-12 rounded-xl border border-border hover:bg-yellow-500/10 ${reviewForm.rating >= s ? 'text-yellow-500 border-yellow-500/50 bg-yellow-500/5' : ''}`}
                                                        onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                                                    >
                                                        <Star className={`w-4 h-4 sm:w-5 h-5 ${reviewForm.rating >= s ? 'fill-yellow-500' : ''}`} />
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Technical Assessment</Label>
                                            <textarea 
                                                className="w-full min-h-[100px] bg-foreground/5 border border-border rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none scrollbar-hide" 
                                                placeholder="Detail your throughput analysis..." 
                                                value={reviewForm.content}
                                                onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button 
                                            disabled={isSubmitting}
                                            onClick={handleSubmitReview}
                                            className="w-full h-16 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                                        >
                                            {isSubmitting ? "SYNCING..." : "Broadcast Intelligence"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="relative mb-10">
                             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                             <Input placeholder="Filter frequency by keywords, protocols, or bug IDs..." className="pl-14 h-16 rounded-full glass border-white/5 focus:border-indigo-500/50 text-base font-medium tracking-tight" />
                        </div>

                        {discussionsLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-64 w-full rounded-[2.5rem] bg-foreground/5 animate-pulse" />
                            ))
                        ) : displayDiscussions.length > 0 ? (
                            displayDiscussions.map((d, i) => (
                                <motion.div
                                    key={d.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: Math.min(i, 5) * 0.06 }}
                                >
                                    <Card className="glass border-border hover:border-indigo-500/30 transition-all rounded-[2.5rem] overflow-hidden group">
                                        <CardContent className="p-10">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="w-12 h-12 border-2 border-indigo-500/20 ring-4 ring-indigo-500/5">
                                                        <AvatarImage src={d.authorAvatar} />
                                                        <AvatarFallback className="bg-indigo-500 text-white font-black uppercase tracking-tighter italic">
                                                            {d.authorName?.substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="text-sm font-black tracking-tight uppercase group-hover:text-indigo-400 transition-colors">@{d.authorName}</div>
                                                        <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">
                                                            {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Nexus Stream'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge className="bg-indigo-500/10 text-indigo-400 border-none rounded-full font-black text-[9px] py-1 px-4 uppercase tracking-[0.2em]">
                                                    {discussionGroups.find(g => g.id === d.groupId)?.name || 'General'}
                                                </Badge>
                                            </div>

                                            <h3 className="text-3xl font-black mb-6 tracking-tighter group-hover:text-indigo-400 transition-colors uppercase leading-none font-serif italic">
                                                {d.title}
                                            </h3>
                                            <p className="text-muted-foreground/80 mb-10 line-clamp-3 text-lg leading-relaxed font-light">
                                                {d.content}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-10">
                                                {d.tags?.map((tag: any) => (
                                                    <Badge key={tag} className="rounded-full glass border-white/5 uppercase text-[9px] font-black px-4 py-2 tracking-widest text-muted-foreground hover:text-foreground cursor-pointer">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                                <div className="flex gap-8">
                                                    <button className="flex items-center gap-3 text-muted-foreground hover:text-indigo-500 transition-all group/btn">
                                                        <ThumbsUp className="w-5 h-5 group-hover/btn:scale-110" />
                                                        <span className="text-xs font-black uppercase tracking-widest">{d.likes}</span>
                                                    </button>
                                                    <button className="flex items-center gap-3 text-muted-foreground hover:text-indigo-500 transition-all group/btn">
                                                        <MessageCircle className="w-5 h-5 group-hover/btn:rotate-12" />
                                                        <span className="text-xs font-black uppercase tracking-widest">{d.commentCount}</span>
                                                    </button>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 transition-colors"><Share2 className="w-5 h-5" /></Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-foreground/5 rounded-[3rem] border border-dashed border-border px-8">
                                <MessageSquare className="w-16 h-16 text-indigo-500/50 mx-auto mb-6" />
                                <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">No active transmissions</h4>
                                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">Frequency band <span className="text-indigo-400 font-bold">#{selectedGroup}</span> is currently silent. Be the first to initiate a technical broadcast.</p>
                                <Button 
                                    onClick={() => setIsDiscussionDialogOpen(true)}
                                    className="mt-8 rounded-full bg-indigo-500 px-8 py-6 h-auto uppercase font-black tracking-widest text-xs"
                                >
                                    Initiate Local Uplink
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Stats & Socials */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-8">
                        <Card className="glass border-border rounded-[2.5rem] p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 font-mono">Nexus Rank</h4>
                                <Badge className="bg-indigo-500 text-white border-none rounded-sm px-2 text-[8px] font-black tracking-widest">SEASON 01</Badge>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { name: "syntax_ghost", points: "4,820", rank: 1, avatar: "SG" },
                                    { name: "proto_viking", points: "3,150", rank: 2, avatar: "PV" },
                                    { name: "api_alchemist", points: "2,980", rank: 3, avatar: "AA" }
                                ].map(dev => (
                                    <div key={dev.rank} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-6 h-6 flex items-center justify-center font-black text-[10px] ${dev.rank === 1 ? 'bg-amber-500 text-black' : 'text-indigo-500'}`}>{dev.rank}</div>
                                            <Avatar className="w-10 h-10 border border-white/5">
                                                <AvatarFallback className="text-[10px] font-black bg-foreground/5">{dev.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="text-[11px] font-black uppercase tracking-tight group-hover:text-indigo-400 transition-colors">@{dev.name}</div>
                                                <div className="text-[9px] text-muted-foreground uppercase font-black font-mono tracking-widest">{dev.points} PX</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-10 rounded-2xl border border-white/5 uppercase text-[9px] font-black tracking-[0.2em] h-12">
                                Expansion View
                            </Button>
                        </Card>

                        <div className="p-10 rounded-[3rem] bg-indigo-500 text-white shadow-2xl shadow-indigo-500/30 overflow-hidden relative group">
                             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MessageCircleCode className="w-32 h-32 rotate-12" />
                             </div>
                             <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic leading-none relative z-10">Sync <br /> Global</h3>
                             <p className="text-indigo-100 text-xs mb-10 tracking-tight leading-relaxed font-medium relative z-10">
                                Connect with the collective in our encrypted Discord channel.
                             </p>
                             <Button className="w-full rounded-2xl bg-white text-indigo-500 hover:bg-white/90 shadow-xl font-black uppercase tracking-widest h-14 text-[10px] relative z-10 group/btn">
                                Sync with Discord
                                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                             </Button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}