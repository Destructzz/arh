# AIS Flower Shop - Overview

## Purpose
This system is an MVP for a flower shop that covers the full sales cycle: catalog, orders, stock, procurement, and basic customer management. The focus is on reliable CRUD and clean data flow rather than advanced automation.

## Scope (MVP)
- Catalog: categories and products with pricing and cost
- Customers and loyalty accounts
- Orders, order items, payments, deliveries
- Inventory items and stock movement log
- Suppliers and purchase orders
- Discounts

## Out of Scope (for now)
- Payment gateways and fiscal devices
- Advanced analytics and reporting
- Multi-store or multi-warehouse support
- Automated replenishment

## Roles and Responsibilities
- Admin: manages catalog, discounts, users (future), and configuration
- Manager/Cashier: creates orders, payments, deliveries
- Florist: assembles orders, updates statuses
- Courier: receives delivery assignments (no auth yet)
- Customer: order target entity (no self-service yet)

## Key Concepts
- Product: sellable item with price and cost
- Inventory item: stock level for a product (one-to-one)
- Order item snapshot: name and price captured at the moment of sale
- Stock movement: audit log of inventory changes

## Success Metrics (MVP)
- Order creation < 1 min
- Inventory adjustments reflected immediately
- No data loss for products, orders, payments

## Non-Functional Notes
- JSON API, UUID identifiers
- PostgreSQL storage
- Swagger documentation at /docs
