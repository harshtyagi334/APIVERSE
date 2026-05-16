import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  ExternalLink, 
  Terminal, 
  BookOpen, 
  Shield, 
  Zap, 
  Activity, 
  Globe, 
  Database, 
  Lock,
  ArrowRight,
  Star,
  Users,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useAPI } from "@/hooks/useAPI";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function APIDetails() {
  const { id } = useParams<{ id: string }>();
  const { api, loading } = useAPI(id);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <Skeleton className="h-6 w-32 mb-12 rounded-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <Skeleton className="h-20 w-3/4 rounded-2xl" />
                <Skeleton className="h-6 w-1/4 rounded-full" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                 {Array.from({ length: 4 }).map((_, i) => (
                   <Skeleton key={i} className="h-32 rounded-3xl" />
                 ))}
              </div>
              <Skeleton className="h-96 rounded-[3rem]" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-80 rounded-[3rem]" />
              <Skeleton className="h-64 rounded-[3rem]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!api) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Protocol Identity Missing</h2>
          <Link to="/marketplace" className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            Return to Registry
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Back Link */}
        <Link 
          to="/marketplace" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 group font-mono text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Protocols
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className="bg-indigo-500/10 text-indigo-500 border-none uppercase tracking-[0.2em] font-black text-[10px] px-4 py-1.5 rounded-full">
                  {api.category}
                </Badge>
                {api.pricing === 'Paid' ? (
                  <Badge className="bg-amber-500/10 text-amber-500 border-none uppercase tracking-[0.2em] font-black text-[10px] px-4 py-1.5 rounded-full">
                    Enterprise
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none uppercase tracking-[0.2em] font-black text-[10px] px-4 py-1.5 rounded-full">
                    Open Access
                  </Badge>
                )}
                {api.isTrending && (
                    <Badge className="bg-rose-500/10 text-rose-500 border-none uppercase tracking-[0.2em] font-black text-[10px] px-4 py-1.5 rounded-full flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Trending
                    </Badge>
                )}
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 uppercase italic font-serif">
                {api.name}
              </h1>
              <p className="text-xl md:text-2xl text-foreground/60 font-light leading-relaxed max-w-3xl">
                {api.description}
              </p>
            </motion.div>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
              {[
                { label: 'Latency', value: `${api.latency}ms`, icon: Zap, color: 'text-indigo-400' },
                { label: 'Uptime', value: `${api.uptime}%`, icon: Shield, color: 'text-emerald-400' },
                { label: 'Rating', value: api.rating.toFixed(1), icon: Star, color: 'text-amber-400' },
                { label: 'Usage', value: (api.usageCount / 1000000).toFixed(1) + 'M', icon: Users, color: 'text-sky-400' },
              ].map((stat, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={stat.label}
                  className="p-6 bg-card/30 border border-border rounded-3xl backdrop-blur-xl group hover:border-foreground/20 transition-all"
                >
                  <stat.icon className={`w-5 h-5 mb-4 ${stat.color}`} />
                  <div className="text-2xl font-black tracking-tighter mb-1">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Comprehensive Info Tabs */}
            <Tabs defaultValue="endpoints" className="w-full">
              <TabsList className="bg-foreground/5 p-1 rounded-2xl mb-8 border border-white/5 w-full sm:w-auto h-auto grid grid-cols-3 sm:flex">
                <TabsTrigger value="endpoints" className="rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background">Endpoints</TabsTrigger>
                <TabsTrigger value="auth" className="rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background">Authentication</TabsTrigger>
                <TabsTrigger value="limits" className="rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background">Rate Limits</TabsTrigger>
              </TabsList>
              
              <TabsContent value="endpoints" className="space-y-4">
                {api.endpoints && api.endpoints.length > 0 ? (
                    api.endpoints.map((ep, i) => (
                        <div key={i} className="p-6 bg-card/30 border border-border rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-card/50 transition-all">
                             <div className="flex items-center gap-6">
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    ep.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500' :
                                    ep.method === 'POST' ? 'bg-indigo-500/10 text-indigo-500' :
                                    'bg-amber-500/10 text-amber-500'
                                }`}>
                                    {ep.method}
                                </span>
                                <div className="font-mono text-sm tracking-tight text-foreground/80">{ep.path}</div>
                             </div>
                             <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors max-w-sm">
                                {ep.description || "Standard protocol endpoint for data synchronization."}
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center border-2 border-dashed border-border rounded-[3rem] bg-foreground/2">
                        <Terminal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h4 className="font-black uppercase tracking-tighter text-xl mb-2">Endpoint Manifest Pending</h4>
                        <p className="text-muted-foreground max-w-md mx-auto">This protocol is currently undergoing indexing. Complete endpoint definitions will be available shortly.</p>
                    </div>
                )}
              </TabsContent>

              <TabsContent value="auth">
                <div className="p-10 bg-card/30 border border-border rounded-[3rem] space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                       <Lock className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Security Protocol</h3>
                        <p className="text-muted-foreground">Standard Bearer Token Authentication</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Header Pattern</h4>
                        <div className="p-6 rounded-2xl bg-black/40 font-mono text-sm border border-white/5 text-emerald-400">
                           Authorization: Bearer {'<YOUR_PROTOCOL_KEY>'}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-foreground/5 space-y-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <h5 className="font-bold uppercase tracking-tight text-sm">OAuth 2.0 Ready</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">Full scope support for delegated access control.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-foreground/5 space-y-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <h5 className="font-bold uppercase tracking-tight text-sm">TLS 1.3 Encryption</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">Enterprise-grade encryption for all over-the-wire traffic.</p>
                        </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="limits">
                <div className="p-10 bg-card/30 border border-border rounded-[3rem] space-y-8 text-center">
                    <Activity className="w-16 h-16 text-indigo-500 mx-auto" />
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black uppercase tracking-tighter">Traffic Control</h3>
                        <p className="text-muted-foreground">Dynamic allocation based on subscription tier.</p>
                    </div>
                    <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                        <div>
                            <div className="text-4xl font-black tracking-tighter mb-2">10k</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Free Tier / Day</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black tracking-tighter mb-2">1M+</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pro Tier / Month</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black tracking-tighter mb-2">ULM</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Enterprise Support</div>
                        </div>
                    </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-8 sticky top-32">
            <Card className="glass-premium border-white/5 rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-8 font-mono">Registry Intelligence</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Provider</span>
                            <span className="font-black tracking-tighter uppercase text-sm italic font-serif ">{api.provider}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Pricing</span>
                            <span className="font-mono text-sm">{api.pricing}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Base URI</span>
                            <span className="font-mono text-xs text-indigo-400 select-all truncate ml-4" title={api.baseUrl}>{api.baseUrl}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Last Synced</span>
                            <span className="font-mono text-xs">{new Date(api.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="mt-12 space-y-4">
                        <Link 
                          to={`/docs/${api.id}`}
                          className="w-full h-16 rounded-2xl bg-indigo-500 hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 text-xs font-black uppercase tracking-widest gap-3 inline-flex items-center justify-center text-white transition-all"
                        >
                            <BookOpen className="w-5 h-5" />
                            Review Documentation
                        </Link>
                        <Link 
                          to={`/playground?apiId=${api.id}`}
                          className="w-full h-16 rounded-2xl glass hover:bg-foreground/5 text-xs font-black uppercase tracking-widest gap-3 inline-flex items-center justify-center border border-white/10 transition-all font-mono"
                        >
                            <Terminal className="w-5 h-5" />
                            Launch Simulator
                        </Link>
                        {api.docsUrl && api.docsUrl !== '#' && (
                            <a 
                              href={api.docsUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full h-14 rounded-2xl hover:bg-foreground/5 text-xs font-black uppercase tracking-widest gap-3 text-muted-foreground inline-flex items-center justify-center transition-all"
                            >
                                <Globe className="w-4 h-4" />
                                Official Website
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Tags Section */}
            <div className="p-8 bg-foreground/5 border border-border rounded-[2.5rem]">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">Metadata Classifiers</h4>
                 <div className="flex flex-wrap gap-2">
                    {api.tags.map(tag => (
                        <span key={tag} className="px-4 py-2 bg-background border border-border rounded-full text-[10px] font-black uppercase tracking-tight text-foreground/60">
                           #{tag}
                        </span>
                    ))}
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
