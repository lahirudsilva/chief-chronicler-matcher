/**
 * Global test setup file
 * Runs before all tests
 */

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Suppress console.error and console.warn during tests unless explicitly needed
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  // Restore original console methods
  console.error = originalError;
  console.warn = originalWarn;
});

// Custom Jest matchers
expect.extend({
  toBeValidLocationResult(received: any) {
    const pass = (
      typeof received === 'object' &&
      received !== null &&
      typeof received.totalDistance === 'number' &&
      typeof received.pairsCount === 'number' &&
      Array.isArray(received.pairs) &&
      typeof received.statistics === 'object'
    );

    return {
      message: () => pass 
        ? `Expected ${received} not to be a valid location result`
        : `Expected ${received} to be a valid location result`,
      pass,
    };
  },
});