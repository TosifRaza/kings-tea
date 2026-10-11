const MAX_WEIGHT_GRAMS = 10000;

export function parseWeightGrams(value) {
  if (Number.isFinite(Number(value))) return Number(value);
  const match = String(value || '').trim().match(/(\d+(?:\.\d+)?)\s*(kg|g)?/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  return Math.round(match[2]?.toLowerCase() === 'kg' ? amount * 1000 : amount);
}

export function getProductWeightOptions(product) {
  const baseWeight = parseWeightGrams(product?.weight) || 100;
  const configured = Array.isArray(product?.weightOptions)
    ? product.weightOptions.map(parseWeightGrams)
    : [];
  return [...new Set([...configured, baseWeight])]
    .filter((grams) => Number.isInteger(grams) && grams > 0 && grams <= MAX_WEIGHT_GRAMS)
    .sort((a, b) => a - b);
}

export function getPriceForWeight(price, baseWeight, selectedWeight) {
  const baseGrams = parseWeightGrams(baseWeight) || 100;
  const selectedGrams = Number(selectedWeight);
  const basePrice = Number(price) || 0;
  if (!Number.isInteger(selectedGrams) || selectedGrams < 1 || selectedGrams > MAX_WEIGHT_GRAMS) return basePrice;
  return Math.round((basePrice * selectedGrams) / baseGrams);
}

export function formatWeight(grams) {
  return `${Number(grams).toLocaleString('en-IN')}g`;
}
