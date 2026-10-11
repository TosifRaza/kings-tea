const MAX_WEIGHT_GRAMS = 10000;

const parseWeightGrams = (value) => {
  if (Number.isFinite(Number(value))) return Number(value);
  const match = String(value || '').trim().match(/(\d+(?:\.\d+)?)\s*(kg|g)?/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  return Math.round(match[2]?.toLowerCase() === 'kg' ? amount * 1000 : amount);
};

const normalizeWeightGrams = (value, fallback) => {
  const grams = Number(value);
  if (Number.isInteger(grams) && grams > 0 && grams <= MAX_WEIGHT_GRAMS) return grams;
  return fallback;
};

const getPriceForWeight = (price, baseWeight, selectedWeight) => {
  const baseGrams = parseWeightGrams(baseWeight) || 100;
  const selectedGrams = normalizeWeightGrams(selectedWeight, baseGrams);
  return Math.round((Number(price || 0) * selectedGrams) / baseGrams);
};

const parseWeightOptions = (value) => {
  if (value === undefined) return undefined;
  let raw = value;
  if (typeof value === 'string') {
    try { raw = JSON.parse(value); } catch { return null; }
  }
  if (!Array.isArray(raw)) return null;
  const values = raw.map((item) => Number(item));
  if (values.some((grams) => !Number.isInteger(grams) || grams < 1 || grams > MAX_WEIGHT_GRAMS)) return null;
  return [...new Set(values)].sort((a, b) => a - b);
};

module.exports = { MAX_WEIGHT_GRAMS, parseWeightGrams, normalizeWeightGrams, getPriceForWeight, parseWeightOptions };
