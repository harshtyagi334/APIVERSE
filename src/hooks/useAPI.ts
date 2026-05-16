import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { API } from '@/types';
import { MOCK_APIS } from '@/lib/mock-data';

export const useAPI = (apiId: string | undefined) => {
  const [api, setApi] = useState<API | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiId) {
      setLoading(false);
      return;
    }

    const fetchApi = async () => {
      setLoading(true);
      try {
        // First check mock data for immediate response if it exists
        const mockApi = MOCK_APIS.find(a => a.id === apiId);
        
        const docRef = doc(db, 'apis', apiId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setApi({ ...docSnap.data(), id: docSnap.id } as API);
        } else if (mockApi) {
          setApi(mockApi);
        } else {
          setApi(null);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `apis/${apiId}`);
        // Fallback to mock if available
        const mockApi = MOCK_APIS.find(a => a.id === apiId);
        setApi(mockApi || null);
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [apiId]);

  return { api, loading };
};
