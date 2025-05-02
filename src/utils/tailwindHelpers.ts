export function getColorClass(
  color: string,
  prefix: string = 'text',
  modifier?: string
) {
  const basePrefix = modifier ? `${modifier}:${prefix}` : prefix;

  const colorMap: Record<string, string> = {
    cosmic: `${basePrefix}-cosmic`,
    nebula: `${basePrefix}-nebula`,
    supernova: `${basePrefix}-supernova`,
    martian: `${basePrefix}-martian`,
    pulsar: `${basePrefix}-pulsar`,
    deepspace: `${basePrefix}-deepspace`,
    celestial: `${basePrefix}-celestial`,
    aurora: `${basePrefix}-aurora`,
  };

  return colorMap[color] || colorMap.cosmic;
}
