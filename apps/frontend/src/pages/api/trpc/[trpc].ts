import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../../../backend/src/router';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});