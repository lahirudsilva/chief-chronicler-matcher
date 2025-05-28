import {
  parseLocationInput,
  createLocationPairs,
  processLocationData,
  validateInput,
  verifyWithExample
} from '../locationMatcher';

import {
  testInputs,
  expectedResults,
  testLocationLists,
  createTestInput,
} from '../../__tests__/helpers/testData';

/**
 * Covering the most critical functionality with minimal test cases
 */
describe('LocationMatcher Service', () => {
  
  // End-to-end processing
  it('should process location data correctly with the main algorithm', () => {
    const result = processLocationData(testInputs.simple);
    
    // Verify against expected results
    expect(result.totalDistance).toBe(expectedResults.simple.totalDistance);
    expect(result.pairsCount).toBe(expectedResults.simple.pairsCount);
    expect(result.pairs).toEqual(expectedResults.simple.pairs);
    
    // Verify statistics are calculated
    expect(result.statistics.average).toBeCloseTo(11 / 6, 2);
    
    // Verify algorithm correctness
    expect(verifyWithExample()).toBe(true);
  });

  // Input Parsing & Validation - Various input formats and validation
  it('should parse different input formats and validate correctly', () => {
    // Valid parsing
    const parsed = parseLocationInput(testInputs.simple);
    expect(parsed.list1).toEqual([3, 4, 2, 1, 3, 3]);
    expect(parsed.list2).toEqual([4, 3, 5, 3, 9, 3]);
    
    // Single line input
    const singleResult = parseLocationInput(testInputs.singleLine);
    expect(singleResult.list1).toEqual([1]);
    expect(singleResult.list2).toEqual([5]);
    
    // Mixed valid/invalid input
    const mixedResult = parseLocationInput(testInputs.mixedValid);
    expect(mixedResult.list1).toEqual([3, 2]);
    expect(mixedResult.list2).toEqual([4, 5]);
    
    // Validation tests
    expect(validateInput(testInputs.simple).isValid).toBe(true);
    expect(validateInput(testInputs.empty).isValid).toBe(false);
    expect(validateInput(testInputs.invalidNumbers).isValid).toBe(false);
  });

  // Pair Creation & Sorting - Core sorting and pairing logic
  it('should create location pairs correctly with proper sorting', () => {
    const result = createLocationPairs(testLocationLists);
    
    // Verify correct sorting and pairing
    expect(result).toHaveLength(6);
    expect(result[0]).toEqual({ index: 1, left: 1, right: 3, distance: 2 });
    expect(result[5]).toEqual({ index: 6, left: 4, right: 9, distance: 5 });
    
    // Test immutability - original arrays unchanged
    const originalLists = { list1: [3, 1, 2], list2: [6, 4, 5] };
    const originalCopy = { list1: [...originalLists.list1], list2: [...originalLists.list2] };
    createLocationPairs(originalLists);
    expect(originalLists).toEqual(originalCopy);
    
    // Test edge cases
    const identicalPairs = { list1: [5, 5], list2: [5, 5] };
    const identicalResult = createLocationPairs(identicalPairs);
    expect(identicalResult[0].distance).toBe(0);
    expect(identicalResult[1].distance).toBe(0);
  });

  // Error Handling - All error scenarios and edge cases
  it('should handle errors and edge cases appropriately', () => {
    // Should throw errors for invalid input
    expect(() => processLocationData(testInputs.empty)).toThrow('Input data cannot be empty');
    expect(() => processLocationData(testInputs.invalidNumbers)).toThrow('No valid number pairs found');
    expect(() => processLocationData('   ')).toThrow('Input data cannot be empty');
    
    // Edge case numbers should work
    const negativeInput = `-5 5\n-10 10`;
    const negativeResult = processLocationData(negativeInput);
    expect(negativeResult.totalDistance).toBe(30);
    
    const decimalInput = `3.7 4.2\n2.1 5.9`;
    const decimalResult = processLocationData(decimalInput);
    expect(decimalResult.totalDistance).toBeCloseTo(4.3, 5);
    
    const zeroInput = `0 0\n0 0`;
    const zeroResult = processLocationData(zeroInput);
    expect(zeroResult.totalDistance).toBe(0);
    
    // Should handle extra numbers gracefully
    const extraNumbers = `1 2 3\n4 5 6`;
    const extraResult = processLocationData(extraNumbers);
    expect(extraResult.pairsCount).toBe(2);
  });

  // Performance & Integration - Large datasets and complete workflow
  it('should handle performance requirements and complete integration', () => {
    // Performance test - large dataset
    const largeInput = createTestInput(1000);
    const startTime = Date.now();
    const largeResult = processLocationData(largeInput);
    const processingTime = Date.now() - startTime;
    
    expect(largeResult.pairsCount).toBe(1000);
    expect(processingTime).toBeLessThan(1000); // Should process within 1 second
    
    // Integration test - complete result structure
    const completeResult = processLocationData(testInputs.simple);
    expect(completeResult).toMatchObject({
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
        average: expect.any(Number),
      })
    });
    
    // Verify algorithm consistency
    const verifyResults = Array.from({ length: 3 }, () => verifyWithExample());
    expect(verifyResults.every(r => r === true)).toBe(true);
    
    // Test with different size datasets
    expect(() => processLocationData(createTestInput(100))).not.toThrow();
    expect(() => processLocationData(createTestInput(10))).not.toThrow();
  });
});