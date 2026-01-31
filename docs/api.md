# AIS Flower Shop - API

## Base
- Base URL: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Auth: JWT access token (Bearer) + refresh cookie
- Content-Type: application/json

## Conventions
- All IDs are UUID strings
- DELETE responses: { "deleted": true }
- Date-time fields use ISO 8601 strings

## Catalog

### Categories
- GET /categories
- GET /categories/:id
- POST /categories
- PATCH /categories/:id
- DELETE /categories/:id

Body (POST/PATCH):
```
{
  "name": "Roses",
  "parentId": null
}
```

### Products
- GET /products
- GET /products/:id
- POST /products
- PATCH /products/:id
- DELETE /products/:id

Body (POST/PATCH):
```
{
  "name": "Red Roses Bouquet",
  "description": "12 red roses",
  "categoryId": "uuid",
  "price": 59.99,
  "costPrice": 32.0,
  "isActive": true,
  "imageUrl": "https://..."
}
```

## Customers

### Customers
- GET /customers
- GET /customers/:id
- POST /customers
- PATCH /customers/:id
- DELETE /customers/:id

Body (POST/PATCH):
```
{
  "name": "Anna",
  "phone": "+100000000",
  "email": "anna@example.com",
  "birthday": "1995-06-15",
  "notes": "VIP"
}
```

### Loyalty Accounts
- GET /loyalty-accounts
- GET /loyalty-accounts/:id
- POST /loyalty-accounts
- PATCH /loyalty-accounts/:id
- DELETE /loyalty-accounts/:id

Body (POST/PATCH):
```
{
  "customerId": "uuid",
  "points": 100,
  "level": "silver"
}
```

## Orders

### Orders
- GET /orders
- GET /orders/:id
- POST /orders
- PATCH /orders/:id
- DELETE /orders/:id

Body (POST/PATCH):
```
{
  "customerId": "uuid",
  "status": "new",
  "channel": "online",
  "deliveryType": "courier",
  "totalPrice": 120.0,
  "totalCost": 70.0,
  "discountAmount": 10.0
}
```

### Order Items
- GET /order-items
- GET /order-items/:id
- POST /order-items
- PATCH /order-items/:id
- DELETE /order-items/:id

Body (POST/PATCH):
```
{
  "orderId": "uuid",
  "productId": "uuid",
  "qty": 2,
  "price": 20.0,
  "costPrice": 10.0,
  "nameSnapshot": "Rose"
}
```

### Payments
- GET /payments
- GET /payments/:id
- POST /payments
- PATCH /payments/:id
- DELETE /payments/:id

Body (POST/PATCH):
```
{
  "orderId": "uuid",
  "method": "card",
  "amount": 120.0,
  "status": "paid",
  "paidAt": "2026-01-30T12:00:00Z"
}
```

### Deliveries
- GET /deliveries
- GET /deliveries/:id
- POST /deliveries
- PATCH /deliveries/:id
- DELETE /deliveries/:id

Body (POST/PATCH):
```
{
  "orderId": "uuid",
  "address": "Main st 1",
  "deliveryTimeFrom": "2026-01-30T14:00:00Z",
  "deliveryTimeTo": "2026-01-30T15:00:00Z",
  "courierId": "uuid",
  "status": "pending"
}
```

## Inventory

### Inventory Items
- GET /inventory-items
- GET /inventory-items/:id
- POST /inventory-items
- PATCH /inventory-items/:id
- DELETE /inventory-items/:id

Body (POST/PATCH):
```
{
  "productId": "uuid",
  "quantityOnHand": 20,
  "reserved": 2
}
```

### Stock Movements
- GET /stock-movements
- GET /stock-movements/:id
- POST /stock-movements
- PATCH /stock-movements/:id
- DELETE /stock-movements/:id

Body (POST/PATCH):
```
{
  "productId": "uuid",
  "type": "out",
  "quantity": 3,
  "reason": "sale",
  "referenceType": "order",
  "referenceId": "uuid"
}
```

## Procurement

### Suppliers
- GET /suppliers
- GET /suppliers/:id
- POST /suppliers
- PATCH /suppliers/:id
- DELETE /suppliers/:id

Body (POST/PATCH):
```
{
  "name": "Flora LLC",
  "phone": "+100000000",
  "email": "supplier@example.com",
  "address": "City, Street 1"
}
```

### Purchase Orders
- GET /purchase-orders
- GET /purchase-orders/:id
- POST /purchase-orders
- PATCH /purchase-orders/:id
- DELETE /purchase-orders/:id

Body (POST/PATCH):
```
{
  "supplierId": "uuid",
  "status": "ordered",
  "totalCost": 200.0
}
```

### Purchase Items
- GET /purchase-items
- GET /purchase-items/:id
- POST /purchase-items
- PATCH /purchase-items/:id
- DELETE /purchase-items/:id

Body (POST/PATCH):
```
{
  "purchaseOrderId": "uuid",
  "productId": "uuid",
  "qty": 10,
  "unitCost": 5.0
}
```

## Discounts
- GET /discounts
- GET /discounts/:id
- POST /discounts
- PATCH /discounts/:id
- DELETE /discounts/:id

Body (POST/PATCH):
```
{
  "code": "SALE10",
  "type": "percent",
  "value": 10,
  "startsAt": "2026-02-01T00:00:00Z",
  "endsAt": "2026-02-28T23:59:59Z",
  "isActive": true
}
```

## Error Examples
- 400 Bad Request
- 404 Not Found
- 401 Unauthorized (reserved for future auth)
