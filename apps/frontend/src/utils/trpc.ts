import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../backend/src/router';

function getBaseUrl() {
  // In production, always use the deployed backend
  if (process.env.NODE_ENV === 'production') {
    return 'https://chief-chronicler-matcher-backend.vercel.app';
  }
  
  // In development, use local backend
  if (typeof window !== 'undefined') {
    return 'http://localhost:3001'; // browser should use local backend
  }
  
  return 'http://localhost:3001'; // dev SSR should use local backend
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});