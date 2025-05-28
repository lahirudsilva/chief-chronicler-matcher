import { ProcessingResult, LocationPair, LocationLists, ValidationResult } from '@chronicler/types';

/**
 * Parse input string into two arrays of numbers
 * Pure function - no side effects
 */
export function parseLocationInput(inputData: string): LocationLists {
  const lines = inputData.trim().split('\n');
  const list1: number[] = [];
  const list2: number[] = [];
  
  lines.forEach(line => {
    if (line.trim()) {
      const [num1, num2] = line.trim().split(/\s+/).map(Number);
      
      // Validate that we got two valid numbers
      if (!isNaN(num1) && !isNaN(num2)) {
        list1.push(num1);
        list2.push(num2);
      }
    }
  });
  
  return { list1, list2 };
}

/**
 * Sort both arrays and create location pairs
 * Pure function - doesn't modify original arrays
 */
export function createLocationPairs(lists: LocationLists): LocationPair[] {
  // Create copies to avoid mutating original arrays
  const sortedList1 = [...lists.list1].sort((a, b) => a - b);
  const sortedList2 = [...lists.list2].sort((a, b) => a - b);
  
  const pairs: LocationPair[] = [];
  
  for (let i = 0; i < sortedList1.length; i++) {
    const distance = Math.abs(sortedList1[i] - sortedList2[i]);
    
    pairs.push({
      index: i + 1,
      left: sortedList1[i],
      right: sortedList2[i],
      distance: distance
    });
  }
  
  return pairs;
}

/**
 * Calculate statistics from distance array
 * Pure function - takes array, returns stats
 */
export function calculateStatistics(pairs: LocationPair[]) {
  const distances = pairs.map(pair => pair.distance);
  const totalDistance = distances.reduce((sum, distance) => sum + distance, 0);
  
  return {
    totalDistance,
    average: totalDistance / pairs.length,
    maximum: Math.max(...distances),
    minimum: Math.min(...distances)
  };
}

/**
 * Main processing function - orchestrates the entire workflow
 * Combines all pure functions to solve the problem
 */
export function processLocationData(inputData: string): ProcessingResult {
  // Validate input first and throw if invalid
  const validation = validateInput(inputData);
  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid input data");
  }
  
  // Step 1: Parse input into two lists
  const locationLists = parseLocationInput(inputData);
  
  // Additional check: ensure we have pairs after parsing
  if (locationLists.list1.length === 0 || locationLists.list2.length === 0) {
    throw new Error("No valid location pairs found after parsing");
  }
  
  // Step 2: Create pairs by sorting and matching
  const pairs = createLocationPairs(locationLists);
  
  // Step 3: Calculate statistics
  const stats = calculateStatistics(pairs);
  
  // Step 4: Return complete result
  return {
    totalDistance: stats.totalDistance,
    pairsCount: pairs.length,
    pairs: pairs,
    statistics: {
      average: stats.average
    }
  };
}

/**
 * Utility function to validate input data
 * Returns validation result with helpful error messages
 */
export function validateInput(inputData: string): ValidationResult {
  if (!inputData || inputData.trim().length === 0) {
    return {
      isValid: false,
      error: "Input data cannot be empty"
    };
  }
  
  const lines = inputData.trim().split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return {
      isValid: false,
      error: "No valid data lines found"
    };
  }
  
  // Check if at least some lines have valid number pairs
  let validLines = 0;
  for (const line of lines.slice(0, 10)) { // Check first 10 lines
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
      validLines++;
    }
  }
  
  if (validLines === 0) {
    return {
      isValid: false,
      error: "No valid number pairs found. Expected format: 'number number' per line"
    };
  }
  
  return { isValid: true };
}

/**
 * Example function to verify algorithm with test data
 * Useful for debugging and validation
 */
export function verifyWithExample(): boolean {
  const exampleInput = `3 4
4 3
2 5
1 3
3 9
3 3`;
  
  const result = processLocationData(exampleInput);
  
  // Expected result from the problem statement
  const expectedDistance = 11;
  
  return result.totalDistance === expectedDistance;
}