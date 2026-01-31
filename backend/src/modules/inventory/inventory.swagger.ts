export const inventoryItemIdExample = '77777777-7777-7777-7777-777777777777';
export const stockMovementIdExample = '88888888-8888-8888-8888-888888888888';
export const inventoryProductIdExample = '22222222-2222-2222-2222-222222222222';

export const inventoryItemExample = {
  id: inventoryItemIdExample,
  product: {
    id: inventoryProductIdExample,
    name: 'Red Roses Bouquet',
  },
  quantityOnHand: 20,
  reserved: 2,
  updatedAt: '2026-01-30T12:00:00.000Z',
};

export const createInventoryItemExample = {
  productId: inventoryProductIdExample,
  quantityOnHand: 20,
  reserved: 2,
};

export const updateInventoryItemExample = {
  quantityOnHand: 18,
  reserved: 1,
};

export const stockMovementExample = {
  id: stockMovementIdExample,
  product: {
    id: inventoryProductIdExample,
    name: 'Red Roses Bouquet',
  },
  type: 'out',
  quantity: 3,
  reason: 'sale',
  referenceType: 'order',
  referenceId: '99999999-9999-9999-9999-999999999999',
  createdAt: '2026-01-30T12:00:00.000Z',
};

export const createStockMovementExample = {
  productId: inventoryProductIdExample,
  type: 'out',
  quantity: 3,
  reason: 'sale',
  referenceType: 'order',
  referenceId: '99999999-9999-9999-9999-999999999999',
};

export const updateStockMovementExample = {
  quantity: 4,
  reason: 'adjust',
};
