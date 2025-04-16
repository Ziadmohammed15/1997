import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollOptions<T> {
  initialData?: T[];
  pageSize?: number;
  fetchMore: (page: number) => Promise<T[]>;
}

export function useInfiniteScroll<T>({ 
  initialData = [], 
  pageSize = 10,
  fetchMore 
}: UseInfiniteScrollOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const newItems = await fetchMore(page);
      
      if (newItems.length < pageSize) {
        setHasMore(false);
      }
      
      setData(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more items:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    hasMore,
    loadMoreRef: ref
  };
}