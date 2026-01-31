# AIS Flower Shop - Architecture

## Logical Architecture
- Backend: NestJS (controllers + services + TypeORM)
- Database: PostgreSQL 18
- Storage: image URLs stored in DB; actual file storage is external
- Documentation: Swagger UI at /docs

## Module Layout
- catalog (categories, products)
- customers (customers, loyalty accounts)
- orders (orders, order items, payments, deliveries)
- inventory (inventory items, stock movements)
- procurement (suppliers, purchase orders, purchase items)
- discounts

## Data Flow
- HTTP -> Controller -> Service -> Repository (TypeORM) -> PostgreSQL
- Auto entity loading via glob: modules/**/*.entity.ts

## Runtime and Configuration
- Backend runs on PORT (default 3000)
- Database connection from environment variables
- The backend reads .env from the project root

## Deployment (Docker)
- postgres container exposes 5432
- backend container exposes 3000
- Shared .env for both services

## Environment Variables
- POSTGRES_HOST
- POSTGRES_PORT
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- PORT

## Operational Notes
- synchronize=true in TypeORM config is for MVP only
- For production: use migrations and disable synchronize
