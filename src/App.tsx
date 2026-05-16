import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/AuthContext";
import Layout from "@/components/layout/Layout";
import { lazy, Suspense } from "react";
import "@/lib/i18n-loader";

// Lazy-load all pages — each becomes a separate JS chunk loaded on demand
const Home          = lazy(() => import("@/pages/Home"));
const Marketplace   = lazy(() => import("@/pages/Marketplace"));
const APIDetails    = lazy(() => import("@/pages/APIDetails"));
const Playground    = lazy(() => import("@/pages/Playground"));
const Documentation = lazy(() => import("@/pages/Documentation"));
const LearningHub   = lazy(() => import("@/pages/LearningHub"));
const Pricing       = lazy(() => import("@/pages/Pricing"));
const Community     = lazy(() => import("@/pages/Community"));
const Dashboard     = lazy(() => import("@/pages/Dashboard"));
const Categories    = lazy(() => import("@/pages/Categories"));
const Onboarding    = lazy(() => import("@/pages/Onboarding"));

/** Minimal inline spinner while a lazy chunk loads */
function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-500/60 inline-block"
            style={{ animation: `pulse 0.9s ease-in-out ${i * 0.18}s infinite alternate` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="apiverse-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Suspense fallback={<PageFallback />}><Home /></Suspense>} />
              <Route path="/marketplace" element={<Suspense fallback={<PageFallback />}><Marketplace /></Suspense>} />
              <Route path="/marketplace/:id" element={<Suspense fallback={<PageFallback />}><APIDetails /></Suspense>} />
              <Route path="/playground" element={<Suspense fallback={<PageFallback />}><Playground /></Suspense>} />
              <Route path="/docs/:apiId" element={<Suspense fallback={<PageFallback />}><Documentation /></Suspense>} />
              <Route path="/learning" element={<Suspense fallback={<PageFallback />}><LearningHub /></Suspense>} />
              <Route path="/pricing" element={<Suspense fallback={<PageFallback />}><Pricing /></Suspense>} />
              <Route path="/community" element={<Suspense fallback={<PageFallback />}><Community /></Suspense>} />
              <Route path="/dashboard" element={<Suspense fallback={<PageFallback />}><Dashboard /></Suspense>} />
              <Route path="/categories" element={<Suspense fallback={<PageFallback />}><Categories /></Suspense>} />
              <Route path="/onboarding" element={<Suspense fallback={<PageFallback />}><Onboarding /></Suspense>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
