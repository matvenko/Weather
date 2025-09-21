import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // შენი პრეფერენსი
      retry: 2,                    // მსუბუქი retry
      staleTime: 60_000,           // 1 წთ "სველი" მონაცემები
      gcTime: 5 * 60_000,          // cache GC 5 წუთში
      refetchOnReconnect: true,
      networkMode: 'online',
    },
    mutations: {
      retry: 0,                    // avoid duplicate side-effects
      networkMode: 'online',
    },
  }
});

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
