# AIS Flower Shop - ER Model

## Entities and Relations
- Customer (1) -> Orders (many)
- Order (1) -> OrderItems (many) -> Product (1)
- Product (many) -> Category (1)
- Product (1) -> InventoryItem (1)
- InventoryItem (1) -> StockMovements (many)
- Supplier (1) -> PurchaseOrders (many) -> PurchaseItems (many) -> Product (1)
- Order (1) -> Payments (many)
- Order (1) -> Delivery (0..1)
- Customer (1) -> LoyaltyAccount (1)

## Enums
- OrderStatus: new, paid, in_assembly, out_for_delivery, done, cancelled
- OrderChannel: online, offline, phone
- DeliveryType: courier, pickup
- PaymentMethod: cash, card, online
- PaymentStatus: pending, paid, refunded
- DeliveryStatus: pending, in_transit, delivered
- StockMovementType: in, out, adjust
- StockMovementReason: sale, purchase, writeoff, adjust
- PurchaseOrderStatus: draft, ordered, received, cancelled
- DiscountType: percent, fixed

## Tables (Key Fields)

### customers
- id (uuid, PK)
- name (varchar)
- phone (varchar, nullable)
- email (varchar, nullable)
- birthday (date, nullable)
- notes (text, nullable)
- created_at (timestamp)

### categories
- id (uuid, PK)
- name (varchar)
- parent_id (FK -> categories.id, nullable)

### products
- id (uuid, PK)
- name (varchar)
- description (text, nullable)
- category_id (FK -> categories.id, nullable)
- price (float)
- cost_price (float)
- is_active (bool)
- image_url (varchar, nullable)

### inventory_items
- id (uuid, PK)
- product_id (FK -> products.id, unique)
- quantity_on_hand (int)
- reserved (int)
- updated_at (timestamp)

### stock_movements
- id (uuid, PK)
- product_id (FK -> products.id)
- type (enum)
- quantity (int)
- reason (enum)
- reference_type (varchar, nullable)
- reference_id (varchar, nullable)
- created_at (timestamp)

### suppliers
- id (uuid, PK)
- name (varchar)
- phone (varchar, nullable)
- email (varchar, nullable)
- address (text, nullable)

### purchase_orders
- id (uuid, PK)
- supplier_id (FK -> suppliers.id, nullable)
- status (enum)
- total_cost (float)
- created_at (timestamp)

### purchase_items
- id (uuid, PK)
- purchase_order_id (FK -> purchase_orders.id)
- product_id (FK -> products.id, nullable)
- qty (int)
- unit_cost (float)

### orders
- id (uuid, PK)
- customer_id (FK -> customers.id, nullable)
- status (enum)
- channel (enum)
- delivery_type (enum)
- total_price (float)
- total_cost (float)
- discount_amount (float)
- created_at (timestamp)

### order_items
- id (uuid, PK)
- order_id (FK -> orders.id)
- product_id (FK -> products.id, nullable)
- qty (int)
- price (float)
- cost_price (float)
- name_snapshot (varchar)

### payments
- id (uuid, PK)
- order_id (FK -> orders.id)
- method (enum)
- amount (float)
- status (enum)
- paid_at (timestamp, nullable)

### deliveries
- id (uuid, PK)
- order_id (FK -> orders.id)
- address (text)
- delivery_time_from (timestamp, nullable)
- delivery_time_to (timestamp, nullable)
- courier_id (varchar, nullable)
- status (enum)

### loyalty_accounts
- id (uuid, PK)
- customer_id (FK -> customers.id, unique)
- points (int)
- level (varchar)

### discounts
- id (uuid, PK)
- code (varchar)
- type (enum)
- value (float)
- starts_at (timestamp, nullable)
- ends_at (timestamp, nullable)
- is_active (bool)

## Relationship Notes
- Category parent is optional (tree)
- Product delete sets related order items to NULL (snapshot stays)
- Inventory item is removed when product is deleted
- Order delete cascades to items, payments, delivery

## Suggested Indexes (later)
- customers: phone, email
- products: name
- orders: status, created_at
- discounts: code
