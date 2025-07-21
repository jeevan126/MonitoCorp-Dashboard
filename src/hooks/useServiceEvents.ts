import { useInfiniteQuery } from '@tanstack/react-query';

type ServiceEvent = {
  id: string;
  status: string;
  timestamp: string;
  serviceId: string;
};

type EventsResponse = {
  data: ServiceEvent[];
  hasMore: boolean;
};

export const useServiceEvents = (serviceId: string) => {
  return useInfiniteQuery<EventsResponse>({
    queryKey: ['events', serviceId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/services/${serviceId}/events?page=${pageParam}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    refetchOnWindowFocus: false,
    initialPageParam: 1, 
  });
};
