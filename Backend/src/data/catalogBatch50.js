const products = [
  ['Assam Golden Dawn', 'Black Tea', ['malty', 'bright', 'full-bodied']],
  ['Darjeeling First Light', 'Black Tea', ['floral', 'crisp', 'muscatel']],
  ['Nilgiri Mountain Mist', 'Black Tea', ['fragrant', 'smooth', 'bright']],
  ['Assam Malt Reserve', 'Black Tea', ['rich', 'malty', 'rounded']],
  ['Darjeeling Muscatel Crown', 'Black Tea', ['muscatel', 'floral', 'lively']],
  ['Dooars Amber Breakfast', 'Black Tea', ['amber', 'brisk', 'smooth']],
  ['Kangra Valley Black', 'Black Tea', ['delicate', 'fruity', 'clean']],
  ['Ceylon Estate Reserve', 'Black Tea', ['citrus', 'brisk', 'bright']],
  ['Himalayan Black Reserve', 'Black Tea', ['smooth', 'honeyed', 'balanced']],

  ['Jasmine Pearl Green', 'Green Tea', ['jasmine', 'soft', 'sweet']],
  ['Dragon Well Spring Reserve', 'Green Tea', ['chestnut', 'fresh', 'mellow']],
  ['Sencha Spring Meadow', 'Green Tea', ['grassy', 'fresh', 'clean']],
  ['Gunpowder Green Reserve', 'Green Tea', ['toasty', 'bold', 'rounded']],
  ['Kashmiri Kahwa Green', 'Green Tea', ['warming', 'fragrant', 'spiced']],
  ['Moroccan Mint Green', 'Green Tea', ['minty', 'cool', 'bright']],
  ['Himalayan Green First Flush', 'Green Tea', ['floral', 'fresh', 'gentle']],
  ['Anji White Green Reserve', 'Green Tea', ['sweet', 'delicate', 'vegetal']],
  ['Roasted Rice Green Tea', 'Green Tea', ['toasty', 'nutty', 'smooth']],

  ['Ceremonial Matcha No. 1', 'Matcha', ['umami', 'creamy', 'bright']],
  ['Uji Stoneground Matcha', 'Matcha', ['smooth', 'sweet', 'vegetal']],
  ['Morning Matcha Reserve', 'Matcha', ['rich', 'balanced', 'fresh']],
  ['Hikari Matcha Select', 'Matcha', ['silky', 'sweet', 'umami']],
  ['Kyoto Matcha Tradition', 'Matcha', ['deep', 'creamy', 'rounded']],
  ['Everyday Matcha Blend', 'Matcha', ['bold', 'smooth', 'versatile']],
  ['First Harvest Matcha', 'Matcha', ['fresh', 'sweet', 'delicate']],
  ['Tencha Emerald Reserve', 'Matcha', ['mellow', 'vibrant', 'umami']],

  ['Iron Goddess Spring Orchid', 'Oolong Tea', ['orchid', 'creamy', 'floral']],
  ['Oriental Beauty Amber', 'Oolong Tea', ['honeyed', 'fruity', 'rounded']],
  ['High Mountain Oolong', 'Oolong Tea', ['floral', 'clean', 'lively']],
  ['Roasted Tieguanyin Reserve', 'Oolong Tea', ['toasty', 'mineral', 'smooth']],
  ['Milk Oolong Silken Leaf', 'Oolong Tea', ['buttery', 'soft', 'sweet']],
  ['Wuyi Rock Oolong', 'Oolong Tea', ['roasted', 'mineral', 'deep']],
  ['Four Seasons Oolong', 'Oolong Tea', ['fragrant', 'bright', 'balanced']],
  ['Phoenix Honey Orchid', 'Oolong Tea', ['honeyed', 'orchid', 'layered']],

  ['Aged Pu-erh Reserve 2012', 'Pu-erh Tea', ['earthy', 'smooth', 'deep']],
  ['Raw Pu-erh Spring Cake', 'Pu-erh Tea', ['bright', 'mineral', 'evolving']],
  ['Golden Ripe Pu-erh', 'Pu-erh Tea', ['earthy', 'mellow', 'rounded']],
  ['Yunnan Ancient Tree Pu-erh', 'Pu-erh Tea', ['rich', 'woody', 'layered']],
  ['Moonlight White Pu-erh', 'Pu-erh Tea', ['soft', 'floral', 'sweet']],
  ['Imperial Pu-erh Tuocha', 'Pu-erh Tea', ['smooth', 'woody', 'balanced']],
  ['Mountain Path Raw Pu-erh', 'Pu-erh Tea', ['fresh', 'earthy', 'bright']],
  ['Copper Label Pu-erh 2016', 'Pu-erh Tea', ['warm', 'mellow', 'rounded']],

  ['Silver Bud White Reserve', 'White Tea', ['delicate', 'honeyed', 'soft']],
  ['White Peony Spring Leaf', 'White Tea', ['floral', 'sweet', 'gentle']],
  ['Moonlight White Tea', 'White Tea', ['fruity', 'mellow', 'silky']],
  ['Silver Needle Select', 'White Tea', ['light', 'fresh', 'subtle']],
  ['Bai Mu Dan Imperial', 'White Tea', ['soft', 'floral', 'rounded']],
  ['White Tea Garden Reserve', 'White Tea', ['sweet', 'clean', 'delicate']],
  ['Peach Blossom White Tea', 'White Tea', ['fragrant', 'honeyed', 'gentle']],
  ['Cloud Garden White Tips', 'White Tea', ['fresh', 'silky', 'bright']],
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const categoryAssets = {
  'Black Tea': ['black-tea.jpg', 'black-tea-2.jpg', 'black-tea-3.jpg', 'black-tea-4.jpg'],
  'Green Tea': ['green-tea.jpg', 'green-tea-2.jpg', 'green-tea-3.jpg', 'green-tea-4.jpg'],
  'Matcha': ['matcha.jpg', 'matcha-2.jpg', 'matcha-3.jpg', 'matcha-4.jpg'],
  'Oolong Tea': ['oolong-tea.jpg', 'oolong-tea-2.jpg', 'oolong-tea-3.jpg', 'oolong-tea-4.jpg'],
  'Pu-erh Tea': ['pu-erh-tea.png', 'pu-erh-tea-2.jpg', 'pu-erh-tea-3.jpg', 'pu-erh-tea-4.jpg'],
  'White Tea': ['white-tea.jpg', 'white-tea-2.jpg', 'white-tea-3.jpg', 'white-tea-4.jpg'],
};

module.exports = products.map(([name, category, tastingNotes], index) => {
  const slug = slugify(name);
  return {
    name,
    slug,
    category,
    price: 749 + index * 137,
    weight: '100g',
    tastingNotes,
    description: `A carefully selected ${category.toLowerCase()} with ${tastingNotes.join(', ')} character. Packed in King's Tea signature premium style; brew to taste using the guide below.`,
    shortDescription: `${category} with ${tastingNotes.slice(0, 2).join(' and ')} notes.`,
    origin: '',
    fermentation: category === 'Pu-erh Tea' ? 'post-fermented' : 'none',
    season: 'year-round',
    caffeine: category === 'White Tea' ? 'low' : 'medium',
    brewingGuide: {
      temperature: category === 'Green Tea' || category === 'White Tea' || category === 'Matcha' ? '80°C' : '95°C',
      steepTime: category === 'Green Tea' || category === 'White Tea' ? '2-3 min' : '3-4 min',
      amount: '2g per 200ml',
      instructions: 'Warm the cup, add tea, pour freshly heated water at the listed temperature, steep, and adjust to taste.',
    },
    images: [
      ...categoryAssets[category].map((filename) => `/images/tea-products/${filename}`),
      ...(slug === 'himalayan-black-reserve'
        ? ['/images/tea-products/kingstea-packets/himalayan-black-reserve-estate.png']
        : []),
    ],
    newArrival: true,
  };
});
