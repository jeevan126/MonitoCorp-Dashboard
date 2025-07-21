import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ServicesResponse, ServiceType } from '@/lib/type';

export const useStatusPolling = ({ page, limit }: { page: number; limit: number }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const res = await fetch(`/api/services/statuses?page=${page}&limit=${limit}`);
        if (!res.ok) throw new Error('Status update failed');
        const updates: { id: string; status: string }[] = await res.json();

        queryClient.setQueryData(['services', { page, limit }], (old: ServicesResponse) => {
          if (!old?.data) return old;

          const newData = old.data.map((s: ServiceType) => {
            const updated = updates.find((u) => u.id === s.id);
            return updated ? { ...s, status: updated.status } : s;
          });

          return { ...old, data: newData };
        });
      } catch (err) {
        console.warn('Polling error:', err);
      }
    };

    const interval: NodeJS.Timeout = setInterval(fetchAndUpdate, 15_000);
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
