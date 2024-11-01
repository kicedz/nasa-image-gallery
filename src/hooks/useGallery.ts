// src/hooks/useGallery.ts
import { useState, useCallback, useEffect } from 'react';
import { Entry } from 'contentful';
import { NasaCardEntrySkeleton } from '../../types';

interface UseGalleryProps {
  itemsPerPage: number;
}

export const useGallery = ({ itemsPerPage }: UseGalleryProps) => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<Entry<NasaCardEntrySkeleton>[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Load initial items
  useEffect(() => {
    const loadInitialItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/loadPage?page=1&itemsPerPage=${itemsPerPage}`);
        const data = await res.json();
        const newItems: Entry<NasaCardEntrySkeleton>[] = data.items;
        const totalItems: number = data.total;

        setItems(newItems);
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
      } catch (error) {
        console.error('Error loading initial items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialItems();
  }, [itemsPerPage]);

  // Load more items for infinite scroll
  const loadMoreItems = useCallback(async () => {
    if (loading || currentPage >= totalPages) return;

    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const res = await fetch(`/api/loadPage?page=${nextPage}&itemsPerPage=${itemsPerPage}`);
      const data = await res.json();
      const newItems: Entry<NasaCardEntrySkeleton>[] = data.items;

      setItems((prevItems) => [...prevItems, ...newItems]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, loading, totalPages]);

  // Sync NASA images and load the newest items at the top
  const syncNasaImages = useCallback(async () => {
    setLoading(true);
    try {
      // Trigger sync API to fetch new NASA images
      await fetch('/api/syncNasa');

      // Reset the gallery state to fetch new data starting from page 1
      setCurrentPage(1);
      const res = await fetch(`/api/loadPage?page=1&itemsPerPage=${itemsPerPage}`);
      const data = await res.json();
      const newItems: Entry<NasaCardEntrySkeleton>[] = data.items;
      const totalItems: number = data.total;

      setItems(newItems);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error('Error syncing NASA images:', error);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  return {
    items,
    loadMoreItems,
    syncNasaImages,
    loading,
    hasMore: currentPage < totalPages,
  };
};
