import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function PrivateRoute() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
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

  // Redirect to onboarding if not authenticated since there is no /login route explicitly
  return authenticated ? <Outlet /> : <Navigate to="/onboarding" replace />;
}
