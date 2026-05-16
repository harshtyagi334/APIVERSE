import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Search, 
  ArrowRight, 
  Play, 
  Terminal,
  Zap,
  Globe,
  Ghost
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TUTORIALS = [
  {
    id: 1,
    title: 'Integrating Gemini Vision into Production',
    description: 'Learn how to leverage multimodal capabilities for real-time image analysis.',
    type: 'Video',
    duration: '15 min',
    category: 'AI & ML',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Advanced Webhook Security Patterns',
    description: 'Protect your endpoints from replay attacks and untrusted origins.',
    type: 'Article',
    duration: '8 min read',
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Stripe Global Pay: The Complete Guide',
    description: 'A deep dive into multi-currency routing and automated tax compliance.',
    type: 'Guide',
    duration: '20 min read',
    category: 'Payments',
    image: 'https://images.unsplash.com/photo-1559526324-c1f2756309bb?q=80&w=600&auto=format&fit=crop'
  }
];

const GUIDES = [
  { id: 'g1', title: 'API Authentication Best Practices', icon: Terminal },
  { id: 'g2', title: 'Rate Limiting Strategies', icon: Zap },
  { id: 'g3', title: 'Handling Pagination at Scale', icon: Globe },
];

const BLOGS = [
  {
    id: 'b1',
    title: 'The Future of Zero-Trust API Architecture',
    author: 'Elena Vance',
    date: 'May 08, 2026',
    excerpt: 'How shifting to protocol-level verification changes everything for enterprise security.',
  },
  {
    id: 'b2',
    title: 'Optimizing Recharts for Real-time Dashboards',
    author: 'Caleb Rivers',
    date: 'May 04, 2026',
    excerpt: 'A deep dive into high-frequency data rendering without UI lag.',
  }
];

export default function LearningHub() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        {/* Hero Section */}
        <div className="max-w-4xl mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10vw] md:text-8xl font-black tracking-tighter leading-none mb-8 uppercase"
          >
            Learning<br/>
            <span className="text-foreground/30 editorial-gradient">Center</span>
          </motion.h1>
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <p className="text-muted-foreground text-xl max-w-sm font-light leading-relaxed">
              Master the protocols that power the global digital economy with expert guides and walkthroughs.
            </p>
            <div className="relative group w-full md:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 w-5 h-5" />
              <Input 
                placeholder="Search resources..." 
                className="pl-14 pr-6 py-8 rounded-full border-border bg-foreground/5 focus-visible:ring-1 focus-visible:ring-foreground/20 text-lg w-full font-mono tracking-tighter"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Featured Guides & Blogs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">Architectural Guides</h2>
              <div className="space-y-4">
                {GUIDES.map((guide) => (
                  <Card key={guide.id} className="glass border-border p-6 rounded-3xl hover:border-indigo-500/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                        <guide.icon className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm tracking-tight group-hover:text-indigo-500 transition-colors uppercase">{guide.title}</h4>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">Latest Theory</h2>
              <div className="space-y-6">
                {BLOGS.map(blog => (
                  <div key={blog.id} className="group cursor-pointer">
                    <p className="text-[10px] font-black uppercase text-indigo-500/60 mb-2">{blog.date} &bull; {blog.author}</p>
                    <h4 className="font-bold tracking-tight mb-2 group-hover:text-indigo-400 transition-colors uppercase">{blog.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full h-14 rounded-3xl uppercase font-black text-[10px] tracking-widest mt-4">
              View All Resources
            </Button>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Trending Tutorials</h2>
              <div className="flex gap-2">
                {['All', 'Video', 'Articles'].map(t => (
                  <Badge key={t} variant="outline" className="rounded-full px-4 py-1 text-[10px] font-bold cursor-pointer hover:bg-foreground/5">{t}</Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {TUTORIALS.map((tutorial, index) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.3, ease: "easeOut" }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-6">
                    <img src={tutorial.image} alt={tutorial.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                      {tutorial.type === 'Video' && (
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <Play className="w-5 h-5 text-black fill-current ml-1" />
                        </div>
                      )}
                    </div>
                    <Badge className="absolute top-6 left-6 bg-black/50 backdrop-blur-md border border-white/10 text-white font-mono text-[10px]">
                      {tutorial.duration}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{tutorial.category}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{tutorial.type}</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight mb-2 group-hover:text-indigo-500 transition-colors">{tutorial.title}</h3>
                  <p className="text-muted-foreground font-light text-sm line-clamp-2">{tutorial.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Section */}
        <section className="relative h-[400px] rounded-[3rem] overflow-hidden flex items-center p-12 lg:p-24">
          <div className="absolute inset-0 bg-indigo-500" />
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-background/20 to-transparent" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white mb-6 leading-none shadow-sm">
              Contribute to the<br/>
              <span className="text-white/60 italic font-serif">Protocol Registry</span>
            </h2>
            <p className="text-white/90 text-lg font-light mb-10 max-w-md">
              Our documentation is community-maintained. Help us index the world's most robust APIs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-black font-black uppercase tracking-widest text-[10px] h-14 px-10 rounded-2xl hover:bg-white/90 shadow-lg">
                Write a Guide
              </Button>
              <Button variant="outline" className="border-white/20 text-white font-black uppercase tracking-widest text-[10px] h-14 px-10 rounded-2xl hover:bg-white/10 outline-none hover:border-white transition-colors">
                Developer Discord
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 hidden lg:block select-none opacity-20">
            <Ghost className="w-full h-full text-white rotate-12" />
          </div>
        </section>
      </div>
    </div>
  );
}
