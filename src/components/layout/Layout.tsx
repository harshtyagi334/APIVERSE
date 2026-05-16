import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "@/hooks/useUser";

export default function Layout() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, loading } = useUser();

  useEffect(() => {
    if (
      !loading &&
      profile &&
      profile.setupCompleted === false &&
      location.pathname !== "/onboarding"
    ) {
      navigate("/onboarding");
    }
  }, [profile, loading, location.pathname, navigate]);

  return (
    <TooltipProvider>
      {/*
        overflow-x: hidden on this wrapper is the single source of truth for
        horizontal clipping — prevents ANY child (blobs, wide headers, etc.)
        from producing a horizontal scrollbar. overflow-y must stay visible so
        native vertical scroll works.
      */}
      <div
        className="min-h-screen flex flex-col bg-background text-foreground
                   selection:bg-indigo-500/30 selection:text-foreground"
        style={{ overflowX: "hidden" }}
      >
        {/*
          Ambient blobs — pure CSS animation, compositor-only.
          `contain: strict` prevents them from affecting layout of siblings.
          They are siblings of Navbar/main/Footer (not parents), so their
          positioning cannot overflow the wrapper's clipping boundary.
        */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{ contain: "strict" }}
        >
          <div className="ambient-blob ambient-blob--indigo" />
          <div className="ambient-blob ambient-blob--purple" />
        </div>

        <Navbar />

        {/*
          Opacity-only page transition.
          - No y-translation → zero layout recalculation per frame.
          - `initial={false}` skips the very first render animation (instant first paint).
        */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="relative flex-grow z-10"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>

        <Footer />
        <Toaster
          position="bottom-right"
          theme={theme === "dark" ? "dark" : "light"}
          richColors
        />
      </div>
    </TooltipProvider>
  );
}
