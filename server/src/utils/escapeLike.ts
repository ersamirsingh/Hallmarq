export const escapeLike = (input: string): string => {
  return input.replace(/([%_\\])/g, '\\$1');
};
