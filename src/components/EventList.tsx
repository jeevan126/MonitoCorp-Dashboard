import { useRef, useEffect } from 'react';
import { useServiceEvents } from '@/hooks/useServiceEvents';
import { Loader2 } from 'lucide-react';
import { EventType } from '@/lib/type';

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
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1 }
    );
    const node = loadMoreRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, fetchNextPage]);

  const allEvents = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4">
      {status === 'pending' && (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      )}

      {allEvents.length === 0 && status !== 'pending' && (
        <p className="text-sm text-center text-gray-400">No historical events found.</p>
      )}

      {allEvents.map((event: EventType) => (
        <div
          key={event.id}
          className="border rounded-lg px-4 py-3 bg-white shadow-sm flex justify-between items-center"
        >
          <div className="text-sm font-medium text-gray-800">{event.status}</div>
          <div className="text-xs text-gray-500">
            {new Date(event.timestamp).toLocaleString()}
          </div>
        </div>
      ))}

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin w-5 h-5 text-gray-400" />
        </div>
      )}

      <div ref={loadMoreRef} />
    </div>
  );
};
