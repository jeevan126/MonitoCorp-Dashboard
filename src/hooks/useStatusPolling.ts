import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useStatusPolling = ({ page, limit }: { page: number; limit: number }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchAndUpdate = async () => {
      try {
        const res = await fetch(`/api/services/statuses?page=${page}&limit=${limit}`);
        if (!res.ok) throw new Error('Status update failed');
        const updates: { id: string; status: string }[] = await res.json();

        queryClient.setQueryData(['services', { page, limit }], (old: any) => {
          if (!old?.data) return old;

          const newData = old.data.map((s: any) => {
            const updated = updates.find((u) => u.id === s.id);
            return updated ? { ...s, status: updated.status } : s;
          });

          return { ...old, data: newData };
        });
      } catch (err) {
        console.warn('Polling error:', err);
      }
    };

    interval = setInterval(fetchAndUpdate, 15_000);
    fetchAndUpdate();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchAndUpdate();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [queryClient, page, limit]);
};
