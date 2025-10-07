type UnitConversion = { unit: string; amount: number };

export function convertToGrams(
  amount: number,
  unit: string,
  conversions: UnitConversion[]
): number {
  const conv = conversions.find((c) => c.unit === unit);
  if (!conv) throw new Error(`Unknown unit: ${unit}`);
  return amount * conv.amount;
}
