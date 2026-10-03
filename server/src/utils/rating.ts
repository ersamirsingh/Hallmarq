export const calculateWeightedRating = (
  count: number,
  avg: number,
  globalAvg: number,
  m: number = 5
): number => {
  if (count === 0 && globalAvg === 0) return 0;
  return (count * avg + m * globalAvg) / (count + m);
};
