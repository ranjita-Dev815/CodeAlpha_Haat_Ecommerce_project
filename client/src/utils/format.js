export const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const shortId = (id) => `#${String(id).slice(-8).toUpperCase()}`;

// Mirrors server/utils/calcPrices.js for DISPLAY only.
// The server recalculates everything when the order is placed.
export const FREE_SHIPPING_ABOVE = 1000;
export const SHIPPING_FEE = 49;
export const TAX_RATE = 0.18;

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

export function calcPrices(itemsPrice) {
  const items = round2(itemsPrice);
  const shipping = items > FREE_SHIPPING_ABOVE || items === 0 ? 0 : SHIPPING_FEE;
  const tax = round2(items * TAX_RATE);
  return { items, shipping, tax, total: round2(items + shipping + tax) };
}
