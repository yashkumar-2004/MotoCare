import * as yup from 'yup';

// Indian Phone Regex (10 digits starting with 6,7,8,9, optional +91)
const phoneRegex = /^(\+91[\-\s]?)?[6789]\d{9}$/;

// Vehicle Registration Plate Regex (e.g. DL 03 CB 4192, DL-01-A-1234, HR26EW7014)
const vehicleRegRegex = /^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,3}[ -]?[0-9]{4}$/i;

// 6-digit Indian PIN code regex
const pincodeRegex = /^[1-9][0-9]{5}$/;

export const vehicleSchema = yup.object().shape({
  regNumber: yup
    .string()
    .required('Vehicle registration number is required')
    .matches(vehicleRegRegex, 'Enter a valid Indian registration number (e.g. DL 03 CB 4192)'),
  brand: yup.string().required('Vehicle brand/manufacturer is required'),
  model: yup.string().required('Vehicle model name is required'),
  type: yup.string().required('Select a vehicle category/type'),
  year: yup
    .number()
    .typeError('Enter a valid year')
    .min(1990, 'Year must be 1990 or newer')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .required('Manufacturing year is required'),
  odometer: yup
    .number()
    .typeError('Odometer must be a valid number')
    .min(0, 'Odometer cannot be negative')
    .max(500000, 'Please enter a valid mileage')
    .required('Current odometer reading is required in km'),
  fuelType: yup.string().default('Petrol')
});

export const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email address is required'),
  phone: yup
    .string()
    .required('Contact number is required')
    .matches(phoneRegex, 'Enter a valid 10-digit Indian mobile number (+91 optional)'),
  address: yup
    .string()
    .required('Street address is required')
    .min(5, 'Address is too short'),
  city: yup.string().required('City / NCR region is required'),
  pincode: yup
    .string()
    .required('6-digit PIN code is required')
    .matches(pincodeRegex, 'Enter a valid 6-digit Delhi NCR PIN code'),
  emergencyContact: yup
    .string()
    .matches(phoneRegex, { message: 'Enter a valid emergency contact number', excludeEmptyString: true })
    .nullable()
});

export const bookingFormStep1Schema = yup.object().shape({
  selectedVehicleId: yup.string().required('Please select or add a vehicle for service')
});

export const bookingFormStep2Schema = yup.object().shape({
  selectedServiceId: yup.string().required('Please choose a service package')
});

export const bookingFormStep3Schema = yup.object().shape({
  serviceCentreId: yup.string().required('Please select a Delhi NCR service centre'),
  appointmentDate: yup
    .string()
    .required('Please select an appointment date')
    .test('is-future-date', 'Appointment date cannot be in the past', (val) => {
      if (!val) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosen = new Date(val);
      return chosen >= today;
    }),
  appointmentSlot: yup.string().required('Please choose a preferred time slot')
});

export const bookingFormStep4Schema = yup.object().shape({
  customerName: yup.string().required('Full name is required'),
  customerPhone: yup
    .string()
    .required('Phone number is required')
    .matches(phoneRegex, 'Enter a valid 10-digit mobile number'),
  customerEmail: yup.string().email('Enter valid email').required('Email is required'),
  pickupDrop: yup.boolean(),
  pickupAddress: yup.string().when('pickupDrop', {
    is: true,
    then: (schema) => schema.required('Pickup address is required when doorstep pickup is selected').min(8, 'Provide detailed doorstep address'),
    otherwise: (schema) => schema.nullable()
  }),
  notes: yup.string().max(300, 'Notes cannot exceed 300 characters').nullable()
});
