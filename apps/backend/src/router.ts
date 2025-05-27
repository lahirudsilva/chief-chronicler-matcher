import { router, publicProcedure } from './trpc';
import { z } from 'zod';
import { 
  processLocationData, 
  validateInput, 
  verifyWithExample 
} from './services/locationMatcher';

export const appRouter = router({
  // Process location data from input string
  processLocations: publicProcedure
    .input(z.object({
      inputData: z.string().min(1, "Input data is required")
    }))
    .mutation(async ({ input }) => {
      // Validate input first
      const validation = validateInput(input.inputData);
      if (!validation.isValid) {
        throw new Error(validation.error || "Invalid input data");
      }
      
      // Process the data
      try {
        const result = processLocationData(input.inputData);
        return result;
      } catch (error) {
        throw new Error(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  // Verify algorithm with example data
  verifyAlgorithm: publicProcedure
    .query(() => {
      const isCorrect = verifyWithExample();
      return {
        isCorrect,
        message: isCorrect 
          ? "Algorithm verification passed! ✅" 
          : "Algorithm verification failed! ❌"
      };
    }),

  // Get health status
  health: publicProcedure
    .query(() => {
      return { 
        status: 'ok' as const, 
        timestamp: new Date().toISOString(),
        service: 'Chief Chronicler Location Matcher API',
        algorithmVerified: verifyWithExample()
      };
    })
});

export type AppRouter = typeof appRouter;