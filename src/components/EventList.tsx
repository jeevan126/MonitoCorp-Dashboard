import { useRef, useEffect } from 'react';
import { useServiceEvents } from '@/hooks/useServiceEvents';

export const EventList = ({ serviceId }: { serviceId: string }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useServiceEvents(serviceId);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1 }
    );
    const node = loadMoreRef.current;
    if (node) observer.observe(node);
    return () => node && observer.unobserve(node);
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="space-y-4">
      {data?.pages.flatMap(page =>
        page.data.map((event: any) => (
          <div
            key={event.id}
            className="p-3 border rounded shadow-sm bg-gray-50"
          >
            <div className="text-sm font-medium">{event.status}</div>
            <div className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</div>
          </div>
        ))
      )}

      {status === 'loading' && <p>Loading events...</p>}
      {isFetchingNextPage && <p>Loading more...</p>}
      <div ref={loadMoreRef}></div>
    </div>
  );
};
