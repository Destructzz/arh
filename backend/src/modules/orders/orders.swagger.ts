export const orderIdExample = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
export const orderItemIdExample = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
export const paymentIdExample = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
export const deliveryIdExample = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
export const orderCustomerIdExample = '44444444-4444-4444-4444-444444444444';
export const orderProductIdExample = '22222222-2222-2222-2222-222222222222';

export const orderExample = {
  id: orderIdExample,
  customer: {
    id: orderCustomerIdExample,
    name: 'Anna Petrova',
  },
  status: 'paid',
  channel: 'online',
  deliveryType: 'courier',
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
  delivery: {
    id: deliveryIdExample,
    address: 'Main st 1',
    deliveryTimeFrom: '2026-01-30T14:00:00.000Z',
    deliveryTimeTo: '2026-01-30T15:00:00.000Z',
    courierId: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    status: 'pending',
  },
};

export const createOrderExample = {
  customerId: orderCustomerIdExample,
  status: 'new',
  channel: 'online',
  deliveryType: 'courier',
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

export const updatePaymentExample = {
  status: 'refunded',
};

export const deliveryExample = {
  id: deliveryIdExample,
  order: { id: orderIdExample },
  address: 'Main st 1',
  deliveryTimeFrom: '2026-01-30T14:00:00.000Z',
  deliveryTimeTo: '2026-01-30T15:00:00.000Z',
  courierId: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  status: 'pending',
};

export const createDeliveryExample = {
  orderId: orderIdExample,
  address: 'Main st 1',
  deliveryTimeFrom: '2026-01-30T14:00:00.000Z',
  deliveryTimeTo: '2026-01-30T15:00:00.000Z',
  courierId: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  status: 'pending',
};

export const updateDeliveryExample = {
  status: 'in_transit',
};
