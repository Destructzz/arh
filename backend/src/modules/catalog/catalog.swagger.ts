export const categoryIdExample = '11111111-1111-1111-1111-111111111111';
export const productIdExample = '22222222-2222-2222-2222-222222222222';
export const inventoryItemIdExample = '33333333-3333-3333-3333-333333333333';

export const categoryExample = {
  id: categoryIdExample,
  name: 'Roses',
  parent: null,
  children: [],
  createdAt: '2026-01-30T12:00:00.000Z',
  updatedAt: '2026-01-30T12:00:00.000Z',
};

export const createCategoryExample = {
  name: 'Roses',
  parentId: null,
};

export const updateCategoryExample = {
  name: 'Premium Roses',
  parentId: null,
};

export const productExample = {
  id: productIdExample,
  name: 'Red Roses Bouquet',
  description: '12 red roses',
  category: {
    id: categoryIdExample,
    name: 'Roses',
  },
  price: 59.99,
  costPrice: 32,
  isActive: true,
  imageUrl: 'https://cdn.example.com/images/roses.jpg',
  inventoryItem: {
    id: inventoryItemIdExample,
    quantityOnHand: 20,
    reserved: 2,
    updatedAt: '2026-01-30T12:00:00.000Z',
  },
  createdAt: '2026-01-30T12:00:00.000Z',
  updatedAt: '2026-01-30T12:00:00.000Z',
};

export const createProductExample = {
  name: 'Red Roses Bouquet',
  description: '12 red roses',
  categoryId: categoryIdExample,
  price: 59.99,
  costPrice: 32,
  isActive: true,
  imageUrl: 'https://cdn.example.com/images/roses.jpg',
};

export const updateProductExample = {
  name: 'Red Roses Bouquet XL',
  price: 79.99,
  isActive: true,
};
