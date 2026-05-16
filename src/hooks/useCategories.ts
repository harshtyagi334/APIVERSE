import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Category } from '@/types';
import { toast } from 'sonner';
import { CATEGORIES } from '@/lib/mock-data';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats: Category[] = [];
      snapshot.forEach((doc) => {
        cats.push({ ...doc.data(), id: doc.id } as Category);
      });
      
      if (cats.length === 0) {
        // Fallback to mock categories if DB is empty
        const mockCats = CATEGORIES.slice(1).map(name => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          description: `Protocols in the ${name} classification.`,
          createdAt: new Date().toISOString()
        })) as Category[];
        setCategories(mockCats);
      } else {
        setCategories(cats);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'categories');
      // Fallback on error
      const mockCats = CATEGORIES.slice(1).map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        description: `Protocols in the ${name} classification.`,
        createdAt: new Date().toISOString()
      })) as Category[];
      setCategories(mockCats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addCategory = async (category: Omit<Category, 'id' | 'createdAt'>) => {
    const id = category.name.toLowerCase().replace(/\s+/g, '-');
    const newCategory = {
      ...category,
      id,
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'categories', id), newCategory);
      toast.success('Category added successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `categories/${id}`);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      await setDoc(doc(db, 'categories', id), category, { merge: true });
      toast.success('Category updated successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      toast.success('Category deleted successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  return { categories, loading, addCategory, updateCategory, deleteCategory };
};
