export const customerIdExample = '44444444-4444-4444-4444-444444444444';
export const loyaltyAccountIdExample = '55555555-5555-5555-5555-555555555555';

export const customerExample = {
  id: customerIdExample,
  name: 'Anna Petrova',
  phone: '+10000000000',
  email: 'anna@example.com',
  birthday: '1995-06-15',
  notes: 'VIP customer',
  createdAt: '2026-01-30T12:00:00.000Z',
  loyaltyAccount: {
    id: loyaltyAccountIdExample,
    points: 120,
    level: 'silver',
  },
};

export const createCustomerExample = {
  name: 'Anna Petrova',
  phone: '+10000000000',
  email: 'anna@example.com',
  birthday: '1995-06-15',
  notes: 'VIP customer',
};

export const updateCustomerExample = {
  phone: '+10000000001',
  notes: 'Updated note',
};

export const loyaltyAccountExample = {
  id: loyaltyAccountIdExample,
  customer: {
    id: customerIdExample,
    name: 'Anna Petrova',
  },
  points: 120,
  level: 'silver',
};

export const createLoyaltyAccountExample = {
  customerId: customerIdExample,
  points: 120,
  level: 'silver',
};

export const updateLoyaltyAccountExample = {
  points: 150,
  level: 'gold',
};
