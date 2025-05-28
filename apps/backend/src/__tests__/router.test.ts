import { appRouter } from '../router';
import * as locationMatcher from '../services/locationMatcher';

// Test data
const testInputs = {
  simple: `3 4
4 3
2 5
1 3
3 9
3 3`,
  empty: '',
  invalidNumbers: `abc def
ghi jkl`,
};

/**
 * Covering the most critical functionality with minimal test cases
 */
describe('App Router', () => {
  const caller = appRouter.createCaller({});

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // processLocations with valid data
  it('should process valid location data successfully', async () => {
    const result = await caller.processLocations({
      inputData: testInputs.simple
    });

    expect(result).toBeDefined();
    expect(result.totalDistance).toBe(11);
    expect(result.pairsCount).toBe(6);
    expect(result.pairs).toHaveLength(6);
    expect(result.statistics).toBeDefined();
    expect(typeof result.statistics.average).toBe('number');
  });

  // Input Validation - Should reject invalid input
  it('should reject invalid input with appropriate errors', async () => {
    // Empty input - Zod validation
    await expect(
      caller.processLocations({ inputData: testInputs.empty })
    ).rejects.toThrow('Input data is required');

    // Invalid numbers - Custom validation
    await expect(
      caller.processLocations({ inputData: testInputs.invalidNumbers })
    ).rejects.toThrow('No valid number pairs found');

    // Missing parameter - Zod validation
    await expect(
      // @ts-expect-error - Testing validation
      caller.processLocations({})
    ).rejects.toThrow();
  });

  // Error Handling - Should handle processing errors gracefully
  it('should handle processing errors gracefully', async () => {
    // Mock service to throw error
    jest.spyOn(locationMatcher, 'processLocationData').mockImplementation(() => {
      throw new Error('Service error');
    });

    await expect(
      caller.processLocations({ inputData: testInputs.simple })
    ).rejects.toThrow('Processing failed: Service error');

    // Mock validation to return invalid
    jest.spyOn(locationMatcher, 'validateInput').mockReturnValue({
      isValid: false,
      error: 'Validation error'
    });

    await expect(
      caller.processLocations({ inputData: 'valid for zod' })
    ).rejects.toThrow('Validation error');
  });

  // Algorithm Verification - Should verify algorithm and health endpoints
  it('should handle verifyAlgorithm and health procedures correctly', async () => {
    // Test algorithm verification
    const verifyResult = await caller.verifyAlgorithm();
    expect(verifyResult.isCorrect).toBe(true);
    expect(verifyResult.message).toBe('Algorithm verification passed! ✅');

    // Test health endpoint
    const healthResult = await caller.health();
    expect(healthResult.status).toBe('ok');
    expect(healthResult.service).toBe('Chief Chronicler Location Matcher API');
    expect(healthResult.algorithmVerified).toBe(true);
    expect(typeof healthResult.timestamp).toBe('string');

    // Consistency between endpoints
    expect(healthResult.algorithmVerified).toBe(verifyResult.isCorrect);
  });

  // Router Structure - Should have proper TypeScript integration
  it('should maintain proper router structure and type safety', async () => {
    // Router structure
    expect(typeof appRouter.processLocations).toBe('function');
    expect(typeof appRouter.verifyAlgorithm).toBe('function');
    expect(typeof appRouter.health).toBe('function');

    // Procedure definitions
    expect(appRouter._def.procedures.processLocations).toBeDefined();
    expect(appRouter._def.procedures.verifyAlgorithm).toBeDefined();
    expect(appRouter._def.procedures.health).toBeDefined();

    // All procedures should be callable
    const routerKeys = Object.keys(appRouter._def.procedures);
    expect(routerKeys).toEqual(['processLocations', 'verifyAlgorithm', 'health']);

    // Integration test - complete result structure
    const result = await caller.processLocations({ inputData: testInputs.simple });
    expect(result).toMatchObject({
      totalDistance: expect.any(Number),
      pairsCount: expect.any(Number),
      pairs: expect.arrayContaining([
        expect.objectContaining({
          index: expect.any(Number),
          left: expect.any(Number),
          right: expect.any(Number),
          distance: expect.any(Number)
        })
      ]),
      statistics: expect.objectContaining({
        average: expect.any(Number)
      })
    });

    // Verify statistics has all expected properties
    expect(result.statistics).toHaveProperty('average');
    expect(typeof result.statistics.average).toBe('number');
  });
});