import { useQuery } from '@tanstack/react-query';
import api from '@/api/axiosConfig';

interface UseGetOptions {
  params?: Record<string, any>;
  enabled?: boolean;
}

export function useGet<T>(url: string, options?: UseGetOptions) {
  return useQuery<T>({
    queryKey: [url, options?.params],
    queryFn: async () => {
      const response = await api.get<T>(url, {
        params: options?.params,
      });
      return response.data;
    },
    enabled: options?.enabled ?? true,
  });
}