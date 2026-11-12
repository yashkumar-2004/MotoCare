/**
 * Formats a numeric value into INR currency string (₹)
 * @param {number|string} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a date string into readable Indian standard format (e.g., 25 Nov 2024)
 * @param {string|Date} dateInput
 * @param {boolean} includeTime
 * @returns {string}
 */
export const formatDate = (dateInput, includeTime = false) => {
  if (!dateInput) return '—';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);
    
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: true } : {})
    };
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  } catch {
    return String(dateInput);
  }
};

/**
 * Standardizes vehicle registration plate display (e.g. DL 03 CB 4192)
 * @param {string} reg
 * @returns {string}
 */
export const formatRegNumber = (reg) => {
  if (!reg) return '';
  return reg.toUpperCase().trim();
};

/**
 * Generates unique Delhi NCR service booking ID
 * Format: MC-DEL-YYYY-XXXX
 */
export const generateBookingId = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `MC-DEL-${year}-${randomSuffix}`;
};

/**
 * Calculate tax (18% GST) and total
 */
export const calculateBilling = (subtotal, isPickup = false, pickupFee = 299) => {
  const base = Number(subtotal) || 0;
  const transitFee = isPickup ? pickupFee : 0;
  const combined = base + transitFee;
  const tax = Math.round(combined * 0.18);
  const total = combined + tax;
  return {
    subtotal: combined,
    baseServiceAmount: base,
    transitFee,
    tax,
    total
  };
};
