export const TEA_CATEGORY_IMAGES = {
  'Black Tea': '/images/tea-products/black-tea.jpg',
  'Green Tea': '/images/tea-products/green-tea.jpg',
  'Oolong Tea': '/images/tea-products/oolong-tea.jpg',
  'White Tea': '/images/tea-products/white-tea.jpg',
  'Pu-erh Tea': '/images/tea-products/pu-erh-tea.png',
  Matcha: '/images/tea-products/matcha.jpg',
};

export const TEA_CATEGORY_GALLERIES = {
  'Black Tea': [
    TEA_CATEGORY_IMAGES['Black Tea'],
    '/images/tea-products/black-tea-2.jpg',
    '/images/tea-products/black-tea-3.jpg',
    '/images/tea-products/black-tea-4.jpg',
  ],
  'Green Tea': [
    TEA_CATEGORY_IMAGES['Green Tea'],
    '/images/tea-products/green-tea-2.jpg',
    '/images/tea-products/green-tea-3.jpg',
    '/images/tea-products/green-tea-4.jpg',
  ],
  'Oolong Tea': [
    TEA_CATEGORY_IMAGES['Oolong Tea'],
    '/images/tea-products/oolong-tea-2.jpg',
    '/images/tea-products/oolong-tea-3.jpg',
    '/images/tea-products/oolong-tea-4.jpg',
  ],
  'White Tea': [
    TEA_CATEGORY_IMAGES['White Tea'],
    '/images/tea-products/white-tea-2.jpg',
    '/images/tea-products/white-tea-3.jpg',
    '/images/tea-products/white-tea-4.jpg',
  ],
  'Pu-erh Tea': [
    TEA_CATEGORY_IMAGES['Pu-erh Tea'],
    '/images/tea-products/pu-erh-tea-2.jpg',
    '/images/tea-products/pu-erh-tea-3.jpg',
    '/images/tea-products/pu-erh-tea-4.jpg',
  ],
  Matcha: [
    TEA_CATEGORY_IMAGES.Matcha,
    '/images/tea-products/matcha-2.jpg',
    '/images/tea-products/matcha-3.jpg',
    '/images/tea-products/matcha-4.jpg',
  ],
};

const defaultPublicSiteUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://kings-tea-frontend.onrender.com';
const publicSiteUrl = (import.meta.env.VITE_PUBLIC_SITE_URL || defaultPublicSiteUrl).replace(/\/$/, '');

export function getAdminImageUrl(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${publicSiteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getTeaCategoryImage(category) {
  const key = Object.keys(TEA_CATEGORY_IMAGES).find(
    (name) => name.toLowerCase() === String(category || '').trim().toLowerCase()
  );
  return key ? TEA_CATEGORY_IMAGES[key] : '';
}

export function getTeaCategoryGallery(category) {
  const key = Object.keys(TEA_CATEGORY_GALLERIES).find(
    (name) => name.toLowerCase() === String(category || '').trim().toLowerCase()
  );
  return key ? TEA_CATEGORY_GALLERIES[key] : [];
}
