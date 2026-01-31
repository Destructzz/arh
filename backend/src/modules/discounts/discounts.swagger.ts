export const discountIdExample = '66666666-6666-6666-6666-666666666666';

export const discountExample = {
  id: discountIdExample,
  code: 'SALE10',
  type: 'percent',
  value: 10,
  startsAt: '2026-02-01T00:00:00.000Z',
  endsAt: '2026-02-28T23:59:59.000Z',
  isActive: true,
};

export const createDiscountExample = {
  code: 'SALE10',
  type: 'percent',
  value: 10,
  startsAt: '2026-02-01T00:00:00.000Z',
  endsAt: '2026-02-28T23:59:59.000Z',
  isActive: true,
};

export const updateDiscountExample = {
  value: 15,
  isActive: false,
};
