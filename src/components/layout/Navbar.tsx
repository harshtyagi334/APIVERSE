import { Link, useLocation } from "react-router-dom";
import {
  Search, Menu, X, Zap, BookOpen, Users, Compass,
  LogOut, LayoutDashboard, Tag, Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { AuthModal } from "@/components/auth/AuthModal";
import { motion, AnimatePresence } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";

export default function Navbar() {
  const { t } = useTranslation();
  const { setTheme } = useTheme();
  const { user } = useAuth();
  const { profile } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();

  const handleLogin = () => {
    setIsAuthModalOpen(true);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully signed out");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  // Passive scroll listener — never blocks scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isAdmin = profile?.role === "admin";

  const navLinks = [
    { name: t("nav.marketplace"), path: "/marketplace", icon: Compass },
    { name: t("nav.playground"),  path: "/playground",  icon: Zap },
    { name: t("nav.learning"),    path: "/learning",    icon: BookOpen },
    { name: t("nav.community"),   path: "/community",   icon: Users },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border py-3"
            : "bg-transparent py-6"
        }`}
      >
        {/* Single-row, no-wrap container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4 min-w-0">

          {/* ── Left: Logo + Desktop Nav ── */}
          <div className="flex items-center gap-6 lg:gap-10 min-w-0 shrink-0">
            <Link
              to="/"
              className="text-xl lg:text-2xl font-bold tracking-tighter
                         bg-gradient-to-r from-foreground via-foreground to-foreground/40
                         bg-clip-text text-transparent italic font-serif whitespace-nowrap"
            >
              APIVERSE.
            </Link>

            {/* Desktop nav — only visible at xl (1280px+) */}
            <div className="hidden xl:flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] font-black text-foreground/50">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 transition-colors hover:text-foreground whitespace-nowrap ${
                    location.pathname === link.path ? "text-foreground" : ""
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-foreground/5 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                    />
                  )}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Right: Actions ── */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Gateway status — only at 2xl */}
            <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-border rounded-full text-[10px] font-mono tracking-widest text-foreground/60 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              GATEWAY: ACTIVE
            </div>

            {/* Dark mode pill — only at xl */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 glass rounded-full border-border/50 text-[10px] font-black uppercase tracking-widest text-indigo-400 whitespace-nowrap">
              <Moon className="w-3 h-3" />
              DARK
            </div>

            {/* Sign-in / Avatar */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-border">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback className="text-xs">{user.displayName?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                } />
                <DropdownMenuContent
                  className="w-52 rounded-2xl p-2 bg-background/95 backdrop-blur-xl border-border"
                  align="end"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-bold leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-border my-1" />
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="flex items-center w-full gap-2 cursor-pointer rounded-xl">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem>
                      <Link to="/categories" className="flex items-center w-full gap-2 cursor-pointer rounded-xl">
                        <Tag className="h-4 w-4" />
                        <span>Categories</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-border my-1" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer rounded-xl text-red-500 focus:text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleLogin}
                size="sm"
                className="rounded-full px-4 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600
                           hover:from-indigo-600 hover:to-purple-700 border-none
                           shadow-lg shadow-indigo-500/20 text-white text-xs font-bold whitespace-nowrap"
              >
                Sign In
              </Button>
            )}

            {/* Hamburger — shows below xl */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden rounded-full h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden fixed inset-0 z-[60] bg-background flex flex-col"
          >
            {/* Header row */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <span className="text-xl font-serif italic font-bold tracking-tighter">APIVERSE.</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-2 p-6 flex-grow">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-black uppercase tracking-tight transition-colors ${
                      location.pathname === link.path
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "hover:bg-foreground/5 text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom actions */}
            <div className="p-6 border-t border-border space-y-3">
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1 rounded-xl h-12 glass text-[10px] font-black uppercase tracking-widest gap-2"
                  onClick={() => setTheme("light")}
                >
                  Light
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 rounded-xl h-12 glass text-[10px] font-black uppercase tracking-widest gap-2"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="w-4 h-4" /> Dark
                </Button>
              </div>
              {user ? (
                <Button
                  onClick={handleLogout}
                  className="w-full h-12 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 uppercase font-black tracking-widest text-xs"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="w-full h-12 rounded-xl bg-indigo-500 text-white uppercase font-black tracking-widest text-xs"
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
