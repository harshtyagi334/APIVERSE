import { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { API } from '@/types';
import { MOCK_APIS } from '@/lib/mock-data';

export const useAPIs = (options: { 
  category?: string; 
  searchQuery?: string;
  sortBy?: 'newest' | 'trending' | 'performance' | 'all' | 'legacy';
} = {}) => {
  const [apis, setApis] = useState<API[]>(MOCK_APIS);
  const [loading, setLoading] = useState(true);

  // Daily freshness: Add a virtual "Daily Top" API based on current date
  const dailyApis = useMemo(() => {
    const today = new Date().toDateString();
    const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dailyApi: API = {
      id: `daily-${hash}`,
      name: `Protocol Delta-${hash % 100}`,
      description: `Auto-generated daily optimization protocol. Last synced: ${today}. Optimized for high-throughput edge nodes.`,
      category: 'DevTools',
      provider: 'Nexus AI',
      icon: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/cpu.svg',
      rating: 5.0,
      reviewsCount: hash % 500,
      usageCount: hash * 100,
      latency: 20 + (hash % 30),
      uptime: 99.99,
      tags: ['daily', 'optimization', 'nexus'],
      isPremium: true,
      isTrending: true,
      docsUrl: '#',
      baseUrl: 'https://api.nexus.io/v1',
      pricing: 'Free',
      createdAt: new Date().toISOString(),
      endpoints: []
    };
    return [dailyApi];
  }, []);

  useEffect(() => {
    let q = query(collection(db, 'apis'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbData: API[] = [];
      snapshot.forEach((doc) => {
        dbData.push({ ...doc.data(), id: doc.id } as API);
      });

      // Combine DB data with Mock data, ensuring no duplicates by name (since IDs might differ)
      const combined = [...dbData];
      const dbNames = new Set(dbData.map(a => a.name));
      
      MOCK_APIS.forEach(mockApi => {
        if (!dbNames.has(mockApi.name)) {
          combined.push(mockApi);
        }
      });

      // Add the daily fresh API
      if (!dbNames.has(dailyApis[0].name)) {
        combined.push(dailyApis[0]);
      }

      setApis(combined);
      setLoading(false);
    }, (error) => {
      // In case of error (e.g. permission or network), still fallback to mock data
      handleFirestoreError(error, OperationType.LIST, 'apis');
      setApis([...MOCK_APIS, ...dailyApis]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dailyApis]);

  const filteredAndSortedAPIs = useMemo(() => {
    let result = [...apis];

    // Search Filter
    if (options.searchQuery) {
      const search = options.searchQuery.toLowerCase();
      result = result.filter(api => 
        api.name.toLowerCase().includes(search) || 
        api.description.toLowerCase().includes(search) ||
        api.tags.some(tag => tag.toLowerCase().includes(search)) ||
        api.provider.toLowerCase().includes(search)
      );
    }

    // Category Filter
    if (options.category && options.category !== 'All') {
      result = result.filter(api => api.category === options.category);
    }

    // Sorting
    switch (options.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'trending':
        result.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
        break;
      case 'legacy':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'performance':
        // Higher uptime and lower latency
        result.sort((a, b) => {
          const scoreA = (a.uptime || 0) - (a.latency || 1000) / 100;
          const scoreB = (b.uptime || 0) - (b.latency || 1000) / 100;
          return scoreB - scoreA;
        });
        break;
    }

    return result;
  }, [apis, options.category, options.searchQuery, options.sortBy]);

  return { apis: filteredAndSortedAPIs, loading };
};
