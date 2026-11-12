import { describe, it, expect } from 'vitest';
import { calculateBilling, generateBookingId, formatCurrency } from '../utils/formatters';
import { vehicleSchema, profileSchema } from '../utils/validators';

describe('Validation Schemas & Billing Calculations', () => {
  it('validates Delhi NCR registration plates format', async () => {
    const validVehicle = {
      regNumber: 'DL 03 CB 4192',
      brand: 'Honda',
      model: 'Activa 6G',
      type: 'Scooter',
      year: 2022,
      odometer: 8500,
      fuelType: 'Petrol'
    };

    const isValid = await vehicleSchema.isValid(validVehicle);
    expect(isValid).toBe(true);

    const invalidVehicle = {
      ...validVehicle,
      regNumber: 'INVALID_PLATE_123',
    };
    const isInvalid = await vehicleSchema.isValid(invalidVehicle);
    expect(isInvalid).toBe(false);
  });

  it('validates customer profile schema with Indian phone number', async () => {
    const validProfile = {
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      phone: '9810123456',
      address: 'B-42 Defence Colony, New Delhi',
      city: 'Delhi NCR',
      pincode: '110024'
    };

    const isValid = await profileSchema.isValid(validProfile);
    expect(isValid).toBe(true);

    const invalidProfile = {
      ...validProfile,
      phone: '12345', // invalid length
    };
    const isInvalid = await profileSchema.isValid(invalidProfile);
    expect(isInvalid).toBe(false);
  });

  it('calculates 18% GST and total billing accurately', () => {
    // 1499 base without pickup
    const billingWithoutPickup = calculateBilling(1499, false);
    expect(billingWithoutPickup.subtotal).toBe(1499);
    expect(billingWithoutPickup.transitFee).toBe(0);
    expect(billingWithoutPickup.tax).toBe(Math.round(1499 * 0.18)); // 270
    expect(billingWithoutPickup.total).toBe(1499 + 270);

    // 1499 base with 299 doorstep transit fee
    const billingWithPickup = calculateBilling(1499, true, 299);
    const expectedCombined = 1499 + 299; // 1798
    const expectedTax = Math.round(expectedCombined * 0.18); // 324
    expect(billingWithPickup.subtotal).toBe(expectedCombined);
    expect(billingWithPickup.transitFee).toBe(299);
    expect(billingWithPickup.tax).toBe(expectedTax);
    expect(billingWithPickup.total).toBe(expectedCombined + expectedTax);
  });

  it('generates unique booking IDs conforming to format MC-DEL-YYYY-XXXX', () => {
    const id1 = generateBookingId();
    const id2 = generateBookingId();
    const currentYear = new Date().getFullYear();

    expect(id1).toMatch(new RegExp(`^MC-DEL-${currentYear}-\\d{4}$`));
    expect(id2).toMatch(new RegExp(`^MC-DEL-${currentYear}-\\d{4}$`));
    expect(id1).not.toBe(id2);
  });

  it('formats currency into Indian Rupee format correctly', () => {
    expect(formatCurrency(1499)).toMatch(/₹\s?1,499/);
    expect(formatCurrency(0)).toMatch(/₹\s?0/);
    expect(formatCurrency(null)).toBe('₹0');
  });
});
