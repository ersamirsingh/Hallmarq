import { describe, it, expect } from 'vitest';
import { calculateWeightedRating } from '../src/utils/rating.js';
import { escapeLike } from '../src/utils/escapeLike.js';

describe('Rating and EscapeLike utilities', () => {
  it('calculates weighted rating correctly with formula (count * avg + m * globalAvg) / (count + m)', () => {
    expect(calculateWeightedRating(0, 0, 0, 5)).toBe(0);
    const result1 = calculateWeightedRating(1, 5.0, 4.0, 5);
    expect(result1).toBeCloseTo((1 * 5.0 + 5 * 4.0) / (1 + 5), 4);
    const result200 = calculateWeightedRating(200, 4.7, 4.0, 5);
    expect(result200).toBeCloseTo((200 * 4.7 + 5 * 4.0) / (200 + 5), 4);
    expect(result200).toBeGreaterThan(result1);
  });

  it('escapes %, _, and \\ characters in strings for SQL LIKE patterns', () => {
    expect(escapeLike('normal_search')).toBe('normal\\_search');
    expect(escapeLike('100% discount')).toBe('100\\% discount');
    expect(escapeLike('c:\\path\\file')).toBe('c:\\\\path\\\\file');
    expect(escapeLike('plain text')).toBe('plain text');
  });
});
