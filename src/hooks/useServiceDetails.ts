// hooks/useServiceDetails.ts
import { useQuery } from '@tanstack/react-query';

export const useServiceDetails = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const res = await fetch(`/api/services/${id}`);
      if (!res.ok) throw new Error('Failed to fetch service');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 min
    refetchOnWindowFocus: true,
  });
};
