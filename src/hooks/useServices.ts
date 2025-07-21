import { useQuery } from '@tanstack/react-query';

export const useServices = (params: {
  page?: number;
  limit?: number;
  status?: string;
  name_like?: string;
}) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));
      if (params.status) query.append('status', params.status);
      if (params.name_like) query.append('name_like', params.name_like);

      const res = await fetch(`/api/services?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch services');
      return res.json(); // { data, total, page, limit }
    },
    keepPreviousData: true,
    staleTime: 60_000,
  });
};
