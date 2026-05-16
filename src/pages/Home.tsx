import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal, Globe, Code, Zap, Database, ShieldCheck } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

/**
 * Home page — rewritten for performance.
 *
 * Changes from original:
 * - Removed React Three Fiber Canvas (WebGL context per page = heavy GPU load,
 *   and the Sphere with 100×100 subdivisions has ~10k vertices each).
 * - Removed `useScroll` / `useTransform` parallax (fires on every scroll tick
 *   on the main thread).
 * - Replaced `whileHover={{ y: -10 }}` on bento cards with CSS `hover:-translate-y-2`
 *   (GPU-composited, no JS involvement).
 * - GSAP stagger replaced with CSS animation via `animation-delay` (zero JS).
 * - Background decoration is pure CSS — no JS blob.
 */
export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="relative overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 bg-grid overflow-hidden">
        {/* Pure-CSS decorative orb — compositor-only, never causes layout */}
        <div
          aria-hidden
          className="absolute right-[-10%] top-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute left-[-5%] bottom-[5%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <span className="px-4 py-1.5 rounded-full glass border border-border text-[10px] uppercase tracking-[0.3em] font-black text-indigo-400">
              Nexus Environment v2.4
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[12vw] md:text-8xl font-bold tracking-tighter leading-[0.85] mb-12 uppercase"
          >
            Discover<br />
            <span className="text-foreground/30 editorial-gradient tracking-[-0.05em] lowercase pr-4">
              Protocols
            </span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/50 mb-12 leading-relaxed font-light"
          >
            High-performance API infrastructure for production-grade engineering.
            Verified for reliability and elite developer experience.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="rounded-full px-12 h-16 bg-foreground text-background font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
            >
              Initialize Gateway
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full px-12 h-16 border border-border text-foreground font-black uppercase tracking-widest text-xs bg-foreground/5 hover:bg-foreground/10 transition-colors"
            >
              View Documentation
            </Button>
          </motion.div>
        </div>

        {/* Floating badges — CSS animation only, no JS */}
        <div className="absolute bottom-20 left-10 md:left-20" style={{ animation: "float 3s ease-in-out infinite" }}>
          <div className="glass-premium p-4 rounded-2xl flex items-center gap-3">
            <Zap className="text-yellow-400 w-6 h-6" />
            <div className="text-xs">
              <div className="font-bold">Real-time Testing</div>
              <div className="text-muted-foreground">99ms Latency</div>
            </div>
          </div>
        </div>

        <div className="absolute top-40 right-10 md:right-40" style={{ animation: "float 4s ease-in-out 1s infinite" }}>
          <div className="glass-premium p-4 rounded-2xl flex items-center gap-3">
            <Database className="text-indigo-400 w-6 h-6" />
            <div className="text-xs">
              <div className="font-bold">15,000+ APIs</div>
              <div className="text-muted-foreground">Active Directory</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bento Feature Grid ── */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-6 lg:col-span-8 p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border border-border flex flex-col justify-between overflow-hidden relative hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="z-10">
              <Terminal className="text-indigo-500 mb-6 w-12 h-12" />
              <h3 className="text-4xl font-bold mb-4 tracking-tight">Interactive Playground</h3>
              <p className="text-muted-foreground text-lg max-w-sm">
                Test any REST, GraphQL, or WebSocket API instantly. No more context switching between docs and Postman.
              </p>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="z-10 mt-10">
              <div className="flex gap-2 flex-wrap">
                {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
                  <span key={m} className="px-3 py-1 rounded-md bg-foreground/5 text-[10px] font-bold border border-border uppercase tracking-widest">{m}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 md:col-span-6 lg:col-span-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/5 to-purple-600/20 border border-border hover:-translate-y-2 transition-transform duration-300"
          >
            <Code className="text-purple-500 mb-6 w-10 h-10" />
            <h3 className="text-2xl font-bold mb-3 tracking-tight">AI SDK Generator</h3>
            <p className="text-muted-foreground">
              Automatically generate production-ready SDKs in 15+ languages using our proprietary AI engine.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="col-span-1 md:col-span-3 lg:col-span-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-pink-500/5 to-orange-500/10 border border-border hover:-translate-y-2 transition-transform duration-300"
          >
            <ShieldCheck className="text-pink-500 mb-6 w-10 h-10" />
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Enterprise Security</h3>
            <p className="text-muted-foreground">
              Bank-grade encryption, JWT protection, and role-based access for all your API secrets.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1 md:col-span-3 lg:col-span-8 p-10 rounded-[3rem] bg-gradient-to-br from-cyan-500/5 to-indigo-600/10 border border-border flex items-center justify-between hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="max-w-md">
              <Globe className="text-cyan-500 mb-6 w-12 h-12" />
              <h3 className="text-4xl font-bold mb-4 tracking-tight">Global Network</h3>
              <p className="text-muted-foreground text-lg">
                Connect your services with thousands of nodes globally with ultra-low latency.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-b from-transparent to-indigo-500/5 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter"
          >
            READY TO JOIN THE <span className="text-indigo-500">ECOSYSTEM?</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
            Join thousands of developers building the future of the internet on APIVerse.
          </p>
          <Button
            onClick={() => setIsAuthModalOpen(true)}
            size="lg"
            className="rounded-full px-12 py-8 text-xl bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Register Free Account
          </Button>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
