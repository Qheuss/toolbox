// utils/colorHelpers.ts
export type SpaceColor =
  | 'cosmic'
  | 'aurora'
  | 'celestial'
  | 'deepspace'
  | 'pulsar'
  | 'nebula'
  | 'martian'
  | 'supernova';

/**
 * Returns the appropriate CSS class for the given color, type, and modifier
 */
export function getSpaceColorClass(
  color: SpaceColor = 'cosmic',
  type: 'text' | 'bg' | 'border' = 'text',
  modifier?: 'hover' | 'group-hover' | 'focus' | 'active'
): string {
  // If there's a modifier, construct the full class name
  if (modifier) {
    return `${modifier}:${type}-${color}`;
  }

  // Otherwise, just return the base class
  return `${type}-${color}`;
}
