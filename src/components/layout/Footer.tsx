import { Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="h-16 border-t border-border flex items-center justify-between px-6 lg:px-10 text-[10px] font-mono tracking-[0.2em] text-foreground/30 uppercase bg-background relative z-10">
      <div className="flex gap-6 sm:gap-8">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          NODES: GLOBAL (24)
        </div>
        <div className="hidden sm:flex items-center gap-2">
          LOAD: 1.2M / SEC
        </div>
        <div className="hidden md:flex items-center gap-2">
          LATENCY: 12MS AVG
        </div>
      </div>

      <div className="flex gap-6 items-center">
        <div className="hidden lg:block">EN</div>
        <div className="text-foreground/60 font-bold border-l border-border pl-6 sm:pl-8">
          SECURE ENV — TLS 1.3
        </div>
      </div>
    </footer>
  );
}
