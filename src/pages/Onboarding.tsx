import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: "",
    company: "",
    role: "Developer",
  });

  useEffect(() => {
    if (profile?.setupCompleted) {
      navigate("/dashboard");
    }
    if (profile && !formData.displayName) {
      setFormData(prev => ({ ...prev, displayName: profile.displayName || "" }));
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!formData.displayName.trim()) {
      toast.error("Please enter a display name.");
      return;
    }

    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: formData.displayName,
        company: formData.company,
        jobRole: formData.role,
        setupCompleted: true,
      });
      toast.success("Profile setup complete!");
      window.location.href = "/dashboard"; // force reload to update profile context completely
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile.");
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Complete Setup</h1>
          <p className="text-muted-foreground text-sm font-light">Tell us a bit about yourself to personalize your APIVerse experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-foreground/5 p-8 rounded-[2.5rem] border border-border backdrop-blur-xl shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-4">Display Name</label>
            <Input 
              required
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              className="h-14 rounded-2xl bg-background/50 border-border px-6 focus:ring-indigo-500/50"
              placeholder="e.g. Alex Node"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-4">Company (Optional)</label>
            <Input 
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="h-14 rounded-2xl bg-background/50 border-border px-6 focus:ring-indigo-500/50"
              placeholder="e.g. TechCorp"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-4">Primary Role</label>
            <select 
              className="w-full h-14 rounded-2xl bg-background/50 border-border px-6 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none appearance-none cursor-pointer"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="Developer" className="bg-background">Developer / Engineer</option>
              <option value="Product Manager" className="bg-background">Product Manager</option>
              <option value="Data Scientist" className="bg-background">Data Scientist</option>
              <option value="Founder" className="bg-background">Founder / Executive</option>
              <option value="Other" className="bg-background">Other</option>
            </select>
          </div>

          <Button 
            disabled={isSaving}
            type="submit" 
            className="w-full h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-xs mt-8 transition-all"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <span className="flex items-center">
                Enter APIVerse <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
