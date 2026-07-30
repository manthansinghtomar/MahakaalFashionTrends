/**
 * Centralized currency formatting utility for Mahakaal Fashion Trends.
 * Formats numbers into clean Indian Rupee (₹) strings matching Admin and Storefront requirements.
 * Example: 499 -> ₹499, 1299 -> ₹1,299
 */
export const formatRupees = (val) => {
  if (val === undefined || val === null || val === '' || Number.isNaN(Number(val))) {
    return '0';
  }
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatPrice = (val) => {
  return `₹${formatRupees(val)}`;
};

export default formatRupees;
