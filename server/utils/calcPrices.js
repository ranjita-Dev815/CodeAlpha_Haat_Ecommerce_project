const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// Prices are ALWAYS calculated on the server from DB values, never trusted from the client
export const FREE_SHIPPING_ABOVE = 1000;
export const SHIPPING_FEE = 49;
export const TAX_RATE = 0.18; // GST

export default function calcPrices(items) {
  const itemsPrice = round2(items.reduce((sum, i) => sum + i.price * i.qty, 0));
  const shippingPrice = itemsPrice > FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  const taxPrice = round2(itemsPrice * TAX_RATE);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}
