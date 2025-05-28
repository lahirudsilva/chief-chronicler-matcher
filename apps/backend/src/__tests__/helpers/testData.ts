import { LocationLists, ProcessingResult } from '@chronicler/types';

/**
 * Test data fixtures for consistent testing
 */

export const testInputs = {
  // Valid inputs
  simple: `3 4
4 3
2 5
1 3
3 9
3 3`,

  singleLine: `1 5`,

  multipleSpaces: `3    4
4  3
2     5`,

  withEmptyLines: `3 4

4 3

2 5`,

  // Invalid inputs
  empty: '',
  whitespaceOnly: '   \n  \n  ',
  invalidNumbers: `abc def
ghi jkl`,
  mixedValid: `3 4
abc def
2 5`,
  singleNumber: `3
4`,
  noNumbers: `not numbers here`,
} as const;

export const expectedResults = {
  simple: {
    totalDistance: 11,
    pairsCount: 6,
    pairs: [
      { index: 1, left: 1, right: 3, distance: 2 },
      { index: 2, left: 2, right: 3, distance: 1 },
      { index: 3, left: 3, right: 3, distance: 0 },
      { index: 4, left: 3, right: 4, distance: 1 },
      { index: 5, left: 3, right: 5, distance: 2 },
      { index: 6, left: 4, right: 9, distance: 5 },
    ],
  },
  
  singleLine: {
    totalDistance: 4,
    pairsCount: 1,
    pairs: [
      { index: 1, left: 1, right: 5, distance: 4 },
    ],
  },
} as const;

export const testLocationLists: LocationLists = {
  list1: [3, 4, 2, 1, 3, 3],
  list2: [4, 3, 5, 3, 9, 3],
};

export const sortedLocationLists: LocationLists = {
  list1: [1, 2, 3, 3, 3, 4],
  list2: [3, 3, 3, 4, 5, 9],
};

/**
 * Helper function to create test input with specified number of pairs
 */
export function createTestInput(numPairs: number): string {
  const lines: string[] = [];
  for (let i = 1; i <= numPairs; i++) {
    lines.push(`${i} ${i + 1}`);
  }
  return lines.join('\n');
}

/**
 * Helper function to validate ProcessingResult structure
 */
export function isValidProcessingResult(result: any): result is ProcessingResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    typeof result.totalDistance === 'number' &&
    typeof result.pairsCount === 'number' &&
    Array.isArray(result.pairs) &&
    typeof result.statistics === 'object' &&
    typeof result.statistics.average === 'number' &&
    typeof result.statistics.maximum === 'number' &&
    typeof result.statistics.minimum === 'number'
  );
}

/**
 * Generate large test data for performance testing
 */
export function generateLargeTestInput(size: number): string {
  const lines: string[] = [];
  for (let i = 0; i < size; i++) {
    const num1 = Math.floor(Math.random() * 1000);
    const num2 = Math.floor(Math.random() * 1000);
    lines.push(`${num1} ${num2}`);
  }
  return lines.join('\n');
}

/**
 * Create test input with specific patterns
 */
export const testPatterns = {
  ascending: (size: number): string => {
    const lines: string[] = [];
    for (let i = 1; i <= size; i++) {
      lines.push(`${i} ${i}`);
    }
    return lines.join('\n');
  },

  descending: (size: number): string => {
    const lines: string[] = [];
    for (let i = size; i >= 1; i--) {
      lines.push(`${i} ${i}`);
    }
    return lines.join('\n');
  },

  random: (size: number, max: number = 1000): string => {
    const lines: string[] = [];
    for (let i = 0; i < size; i++) {
      const num1 = Math.floor(Math.random() * max);
      const num2 = Math.floor(Math.random() * max);
      lines.push(`${num1} ${num2}`);
    }
    return lines.join('\n');
  },

  identical: (size: number, value: number = 5): string => {
    const lines: string[] = [];
    for (let i = 0; i < size; i++) {
      lines.push(`${value} ${value}`);
    }
    return lines.join('\n');
  }
};

/**
 * Test data for edge cases
 */
export const edgeCases = {
  largeNumbers: `999999999 1000000000
1000000000 999999999`,

  negativeNumbers: `-5 5
-10 10`,

  decimalNumbers: `3.7 4.2
2.1 5.9`,

  zeroValues: `0 0
0 0`,

  mixedSigns: `-1 1
0 2`,

  singlePair: `42 24`,

  duplicateValues: `5 5
5 5
5 5`,
};

/**
 * Validation test cases
 */
export const validationCases = {
  valid: [
    testInputs.simple,
    testInputs.singleLine,
    testInputs.multipleSpaces,
    testInputs.withEmptyLines,
    testInputs.mixedValid,
    edgeCases.largeNumbers,
    edgeCases.negativeNumbers,
  ],

  invalid: [
    testInputs.empty,
    testInputs.whitespaceOnly,
    testInputs.invalidNumbers,
    testInputs.singleNumber,
    testInputs.noNumbers,
  ]
};

/**
 * Performance test configurations
 */
export const performanceTests = {
  small: { size: 100, maxTime: 100 },
  medium: { size: 1000, maxTime: 500 },
  large: { size: 10000, maxTime: 5000 },
  xlarge: { size: 50000, maxTime: 15000 },
};

/**
 * Mock result generator for testing
 */
export function createMockResult(overrides: Partial<ProcessingResult> = {}): ProcessingResult {
  return {
    totalDistance: 10,
    pairsCount: 2,
    pairs: [
      { index: 1, left: 1, right: 3, distance: 2 },
      { index: 2, left: 2, right: 4, distance: 2 }
    ],
    statistics: {
      average: 2
    },
    ...overrides
  };
}

/**
 * Helper to create router test data
 */
export const routerTestData = {
  validProcessInput: {
    inputData: testInputs.simple
  },

  invalidProcessInput: [
    { inputData: '' },
    { inputData: '   ' },
    { inputData: 'invalid data' }
  ],

  expectedHealthResponse: {
    status: 'ok',
    service: 'Chief Chronicler Location Matcher API'
  },

  expectedVerifyResponse: {
    isCorrect: true,
    message: 'Algorithm verification passed! ✅'
  }
};