export type SpaceColor =
  | 'cosmic'
  | 'aurora'
  | 'celestial'
  | 'deepspace'
  | 'pulsar'
  | 'nebula'
  | 'martian'
  | 'supernova';

export function getSpaceColorClass(
  color: SpaceColor = 'cosmic',
  type: 'text' | 'bg' | 'border' = 'text',
  modifier?: 'hover' | 'group-hover' | 'focus' | 'active'
): string {
  if (modifier) {
    return `${modifier}:${type}-${color}`;
  }

  return `${type}-${color}`;
}
