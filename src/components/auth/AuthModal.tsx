import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Github, Mail } from "lucide-react";
import { motion } from "motion/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Successfully signed in!");
      onClose();
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("User closed the login popup.");
        toast.info("Login was cancelled.");
      } else {
        console.error("Login error:", error);
        toast.error("Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotImplemented = (method: string) => {
    toast.info(`${method} login is not implemented yet.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background/90 backdrop-blur-xl border-border/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-serif italic font-bold tracking-tighter text-center bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
            APIVERSE.
          </DialogTitle>
          <DialogDescription className="text-center text-foreground/60 mt-2">
            Authenticate to access premium API features and integrations.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full relative overflow-hidden group border-border/50 bg-foreground/5 hover:bg-foreground/10 transition-all rounded-xl h-14"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-center gap-3 w-full relative z-10">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              <span className="font-semibold tracking-wide">Continue with Google</span>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full relative overflow-hidden group border-border/50 bg-foreground/5 hover:bg-foreground/10 transition-all rounded-xl h-14"
            onClick={() => handleNotImplemented("GitHub")}
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-3 w-full relative z-10">
              <Github className="w-5 h-5" />
              <span className="font-semibold tracking-wide">Continue with GitHub</span>
            </div>
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground tracking-widest font-mono">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full relative overflow-hidden group border-border/50 bg-foreground/5 hover:bg-foreground/10 transition-all rounded-xl h-14"
            onClick={() => handleNotImplemented("Email")}
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-3 w-full relative z-10">
              <Mail className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
              <span className="font-semibold tracking-wide text-foreground/80 group-hover:text-foreground transition-colors">Continue with Email</span>
            </div>
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 px-4 leading-relaxed">
          By continuing, you agree to our <a href="#" className="underline hover:text-foreground transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
        </p>
      </DialogContent>
    </Dialog>
  );
}
