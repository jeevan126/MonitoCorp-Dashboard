// hooks/useServiceEvents.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export const useServiceEvents = (id: string) => {
  return useInfiniteQuery({
    queryKey: ['events', id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/services/${id}/events?page=${pageParam}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json(); // { data: [], hasMore: boolean }
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    refetchOnWindowFocus: false,
  });
};
