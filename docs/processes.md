# AIS Flower Shop - Business Processes

## Order Flow
1) Order intake (online/offline/phone)
2) Create order items (snapshot name and price)
3) Optional: attach customer
4) Payment (cash/card/online)
5) Delivery or pickup
6) Completion or cancellation

### Order Statuses
- new -> paid -> in_assembly -> out_for_delivery -> done
- cancelled can occur from any state

## Payment Flow
- Create payment with method and amount
- Update status: pending -> paid -> refunded

## Delivery Flow
- Create delivery record for courier orders
- Update status: pending -> in_transit -> delivered

## Inventory Flow
- Inventory item holds quantity_on_hand and reserved
- Stock movement logs any change (sale, purchase, writeoff, adjust)

## Procurement Flow
1) Create supplier
2) Create purchase order
3) Add purchase items
4) Receive and update inventory (manual for MVP)

## Discount and Loyalty
- Discounts: percent or fixed, active period
- Loyalty: points and level per customer

## Write-Off Flow
- Create stock movement with reason=writeoff
- Update inventory item quantity_on_hand accordingly
