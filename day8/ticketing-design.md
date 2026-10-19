# TicketHub - System Design

TicketHub sells tickets for concerts and events.

## 1. Requirements
Functional:
- Browse events with search/filter by date, city, category
- View event page with seat map (available, held, sold)
- Hold a seat for 10 minutes before paying
- Pay for held seats and receive ticket with QR code
- View purchased tickets and cancel for refund
- Admins can create events, upload seat maps, set prices, view reports

Non-Functional:
- Speed: Browse <1s p95, seat map update <2s
- Correctness: No seat sold twice, payment matches total exactly
- Fairness: Queue for big sales, no bots, first-come first-served
- Availability: 99.9% normal, 99.5% peak
- Scalability: Handle 10x traffic
- Security: bcrypt passwords, PCI-compliant payments
- Durability: Orders never lost after payment

## 2. Estimates
Normal:
- Users: 2,000,000, Daily visitors: 50,000
- Views: 50,000 x 10 = 500,000 per day = ~5.8 rps, peak ~20 rps
- Sales: 5,000/day = ~0.06/s, peak 1/s
- Reads heavy, writes light

Big Sale Peak:
- 200,000 people for 20,000 seats in 10 minutes
- 20,000 users/min = 333 users/sec
- Views: 200,000 x 5 = 1,000,000 in 10 min = ~1,667 rps
- Holds: 200,000 in 10 min = 333 holds/sec for 20,000 seats
- Contention: 10 people per seat

Comparison: Normal 20 rps vs Big Sale 1,667 rps + 333 writes/sec on same 20k rows = 80x traffic, 300x contention. Need waiting room, queue, DB locks.

## 3. API Design
Base: /api, Auth: Bearer token
1. GET /api/events?city=Nairobi&date=2026-12-01&category=music&page=1&limit=20 - Browse events
2. GET /api/events/:id - Event details
3. GET /api/events/:id/seats - Seat map with status
4. POST /api/holds - Body: {event_id, seat_id} - 201 with expires_at, 409 if taken
5. POST /api/orders - Body: {hold_id, payment_token} - 201 with order_id, ticket_code
6. GET /api/orders/me - View my tickets

## 4. Data Model
PostgreSQL tables: users, events, seats, holds, orders

users: id UUID PK, email UNIQUE, password_hash, full_name, created_at
events: id UUID PK, name, venue, city, event_date, total_seats, status, created_at, INDEX on (event_date, city)
seats: id UUID PK, event_id FK, section, row_label, seat_number, price_cents, status, UNIQUE(event_id, section, row_label, seat_number), INDEX on (event_id, status)
holds: id UUID PK, user_id FK, seat_id FK, event_id FK, created_at, expires_at, status, UNIQUE(seat_id) WHERE status='active', INDEX on expires_at
orders: id UUID PK, user_id FK, event_id FK, seat_id FK, hold_id FK, total_cents, status, ticket_code UNIQUE, created_at, UNIQUE(seat_id) WHERE status='paid', INDEX on (user_id, created_at)

Relationships: users 1-M holds, users 1-M orders, events 1-M seats/holds/orders, seats 1-M holds/orders, holds 1-1 order

## 5. Architecture
[Users] -> [Cloudflare CDN + WAF] -> [Load Balancer] -> [Web/API Servers autoscaled] -> [Auth Svc, Event/Seat Svc, Order Svc] -> [Redis Cache + Lock] -> [Waiting Room Queue] -> [PostgreSQL Primary + Read Replicas] -> [Stripe Payment] -> [Background Worker for expiry/emails]

Survives Big Sale: 1. CDN absorbs 70% traffic 2. Waiting room limits to ~500 concurrent holds 3. Seat reads from Redis 4. Writes via queue 5. Autoscaling 6. Read replicas for browsing

## 6. Trade-Offs
1. Fairness with Waiting Room vs Instant Access: Choose queue for fairness, protects DB, trade-off is perceived delay
2. Strong Consistency vs Performance: Use SELECT FOR UPDATE + unique partial indexes, slower but prevents double-booking. Alternative oversell then refund is fast but breaks correctness
3. Synchronous vs Async Payment: Choose sync for correctness with 10s timeout and idempotency key, trade-off is user waits 2-3s

## 7. Double-Booking Prevention
1. Unique partial indexes: CREATE UNIQUE INDEX idx_holds_seat_active ON holds (seat_id) WHERE status='active'; CREATE UNIQUE INDEX idx_orders_seat_paid ON orders (seat_id) WHERE status='paid';
2. Transaction with row lock: BEGIN; SELECT status FROM seats WHERE id=$1 FOR UPDATE; UPDATE seats SET status='held' WHERE id=$1; INSERT INTO holds...; COMMIT;
3. Atomic fallback: UPDATE seats SET status='held' WHERE id=$1 AND status='available'; if 0 rows, seat gone
4. Expiry worker: releases holds where expires_at < now() back to available
