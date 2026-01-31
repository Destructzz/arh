export const supplierIdExample = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
export const purchaseOrderIdExample = '12121212-1212-1212-1212-121212121212';
export const purchaseItemIdExample = '13131313-1313-1313-1313-131313131313';
export const procurementProductIdExample = '22222222-2222-2222-2222-222222222222';

export const supplierExample = {
  id: supplierIdExample,
  name: 'Flora LLC',
  phone: '+10000000000',
  email: 'supplier@example.com',
  address: 'City, Street 1',
};

export const createSupplierExample = {
  name: 'Flora LLC',
  phone: '+10000000000',
  email: 'supplier@example.com',
  address: 'City, Street 1',
};

export const updateSupplierExample = {
  phone: '+10000000001',
};

export const purchaseOrderExample = {
  id: purchaseOrderIdExample,
  supplier: supplierExample,
  status: 'ordered',
  totalCost: 200,
  createdAt: '2026-01-30T12:00:00.000Z',
  items: [
    {
      id: purchaseItemIdExample,
      qty: 10,
      unitCost: 5,
      product: {
        id: procurementProductIdExample,
        name: 'Red Roses Bouquet',
      },
    },
  ],
};

export const createPurchaseOrderExample = {
  supplierId: supplierIdExample,
  status: 'ordered',
  totalCost: 200,
};

export const updatePurchaseOrderExample = {
  status: 'received',
};

export const purchaseItemExample = {
  id: purchaseItemIdExample,
  purchaseOrder: { id: purchaseOrderIdExample },
  product: { id: procurementProductIdExample, name: 'Red Roses Bouquet' },
  qty: 10,
  unitCost: 5,
};

export const createPurchaseItemExample = {
  purchaseOrderId: purchaseOrderIdExample,
  productId: procurementProductIdExample,
  qty: 10,
  unitCost: 5,
};

export const updatePurchaseItemExample = {
  qty: 12,
};
