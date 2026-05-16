import { motion } from "motion/react";
import { useState } from "react";
import { Sparkles, BrainCircuit, Cpu, ArrowRight, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GeminiService } from "@/services/geminiService";

export default function GeminiAdvisor() {
  const [projectGoal, setProjectGoal] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!projectGoal) return;
    setLoading(true);
    try {
      const recs = await GeminiService.getRecommendations(projectGoal);
      setRecommendations(recs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-premium border-indigo-500/30 overflow-hidden rounded-[2.5rem] relative">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <BrainCircuit className="w-40 h-40" />
      </div>
      <CardContent className="p-10 relative z-10">
         <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
                <h3 className="text-xl font-bold tracking-tight uppercase italic">APIVerse <span className="text-indigo-500">Intelligent Advisor</span></h3>
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Powered by Gemini 3 series</p>
            </div>
         </div>

         <div className="mb-10">
            <h4 className="text-lg font-bold mb-4 tracking-tight">What are you building today?</h4>
            <div className="relative group">
                <textarea
                    value={projectGoal}
                    onChange={(e) => setProjectGoal(e.target.value)}
                    placeholder="e.g. A real-time fintech dashboard with fraud detection..."
                    className="w-full h-32 bg-background/50 border border-white/10 rounded-3xl p-6 text-sm focus:border-indigo-500 outline-none transition-all resize-none"
                />
                <Button 
                    className="absolute bottom-4 right-4 rounded-full px-6 bg-indigo-500 hover:bg-indigo-600 font-bold uppercase tracking-widest text-[10px]"
                    onClick={handleAsk}
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Get AI Insights"}
                    <ArrowRight className="ml-2 w-3 h-3" />
                </Button>
            </div>
         </div>

         <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Recommended Architectures</h5>
            <div className="flex flex-wrap gap-3">
                {recommendations.length > 0 ? (
                    recommendations.map(rec => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={rec}
                            className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 group cursor-pointer hover:bg-indigo-500/20 transition-all"
                        >
                            <Zap className="w-3 h-3 text-indigo-400" />
                            <span className="text-xs font-bold uppercase tracking-widest">{rec}</span>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-xs text-muted-foreground italic">Enter your project goal above to receive personalized API recommendations.</p>
                )}
            </div>
         </div>

         <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background" />)}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Used by 12k+ architects</p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-widest gap-2">
                <MessageCircle className="w-3 h-3" /> Chat with AI
            </Button>
         </div>
      </CardContent>
    </Card>
  );
}
