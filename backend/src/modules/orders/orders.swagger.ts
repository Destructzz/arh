export const orderIdExample = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
export const orderItemIdExample = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
export const paymentIdExample = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
export const orderUserIdExample = '550e8400-e29b-41d4-a716-446655440000';
export const orderProductIdExample = '22222222-2222-2222-2222-222222222222';

export const orderExample = {
  id: orderIdExample,
  userId: orderUserIdExample,
  status: 'paid',
  channel: 'online',
  totalPrice: 120,
  totalCost: 70,
  discountAmount: 10,
  createdAt: '2026-01-30T12:00:00.000Z',
  items: [
    {
      id: orderItemIdExample,
      qty: 2,
      price: 20,
      costPrice: 10,
      nameSnapshot: 'Red Rose',
      product: {
        id: orderProductIdExample,
        name: 'Red Roses Bouquet',
      },
    },
  ],
  payments: [
    {
      id: paymentIdExample,
      method: 'card',
      amount: 120,
      status: 'paid',
      paidAt: '2026-01-30T12:05:00.000Z',
    },
  ],
};

export const createOrderExample = {
  userId: orderUserIdExample,
  status: 'new',
  channel: 'online',
  totalPrice: 120,
  totalCost: 70,
  discountAmount: 10,
};

export const updateOrderExample = {
  status: 'paid',
  discountAmount: 5,
};

export const orderItemExample = {
  id: orderItemIdExample,
  order: { id: orderIdExample },
  product: { id: orderProductIdExample, name: 'Red Roses Bouquet' },
  qty: 2,
  price: 20,
  costPrice: 10,
  nameSnapshot: 'Red Rose',
};

export const createOrderItemExample = {
  orderId: orderIdExample,
  productId: orderProductIdExample,
  qty: 2,
  price: 20,
  costPrice: 10,
  nameSnapshot: 'Red Rose',
};

export const updateOrderItemExample = {
  qty: 3,
};

export const paymentExample = {
  id: paymentIdExample,
  order: { id: orderIdExample },
  method: 'card',
  amount: 120,
  status: 'paid',
  paidAt: '2026-01-30T12:05:00.000Z',
};

export const createPaymentExample = {
  orderId: orderIdExample,
  method: 'card',
  amount: 120,
  status: 'paid',
  paidAt: '2026-01-30T12:05:00.000Z',
};
