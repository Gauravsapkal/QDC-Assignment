## 1.

An in-memory `OrdersService` is useful for a small NestJS assignment, but it does not scale for production because state is lost on restart, cannot be shared across multiple server instances, and becomes difficult to query efficiently as order volume grows. A production system should move orders and garments into a durable database such as PostgreSQL or MySQL, with indexes on fields like order ID, customer ID, status, store location, and timestamps. The NestJS service should depend on a repository or data-access layer so business logic remains separate from persistence details.

For high-traffic systems, scalability also requires pagination, filtering, and carefully shaped REST API responses rather than returning all records. Frequently requested summaries can be cached with Redis or application-level caching, while write paths should invalidate or update those cached values. Testing should cover repository behavior, service aggregation logic, and controller contracts so changes in storage or caching do not break API behavior.

## 2.

Returning either `Order` or `{ error: string }` from `GET /api/orders/:id` makes the response type harder for TypeScript clients to consume because every successful-looking HTTP response may still contain an error object. It also weakens normal REST API semantics: a missing order should be represented by an HTTP `404 Not Found`, not a `200 OK` response with an error payload. This ambiguity can lead to frontend bugs, inconsistent error handling, and weaker observability.

A better NestJS design is to return `Order` for success and throw `NotFoundException` when the order does not exist. That produces a proper HTTP status code and a consistent error shape from NestJS. For larger APIs, teams often standardize error responses with fields like `code`, `message`, and `details`, while keeping controller return types focused on successful DTOs.

## 3.

For a larger React dashboard, the frontend should be organized around reusable API clients, domain types, feature-level components, and focused UI components. Order fetching, status summary fetching, filters, pagination, loading states, and error handling should not all live in one component. A structure such as `features/orders`, `api`, `components`, and `hooks` keeps data access and presentation easier to evolve.

As the dashboard grows, filters and pagination should be represented explicitly in state and reflected in API query parameters so the backend can perform efficient database queries. Multiple API calls can be coordinated with custom hooks or a data-fetching library such as TanStack Query, which provides caching, request deduplication, retries, background refresh, and clearer loading/error states. TypeScript DTOs should be shared or generated from API contracts where possible to reduce drift between NestJS and React.

## 4.

Laundry operations need more domain fields than a simple order ID, customer name, timestamp, and garment status. Real systems usually track customer contact details, store or branch, promised pickup date, service type, pricing, payment status, barcode or tag IDs, garment photos, brand/color/material, stains, damage notes, special instructions, delivery details, and staff actions. Garments may also need item-level history because one order can contain pieces moving through different workflow steps at different times.

Important edge cases include orders with no garments, duplicate garment tags, cancelled orders, partially delivered orders, lost or damaged garments, re-cleaning, refunds, express orders, and status transitions that should not be allowed. The domain model should separate order lifecycle, garment lifecycle, billing, delivery, and audit history instead of treating status as one flat field. Database constraints, validation DTOs, and service-level transition rules help keep the model reliable.

## 5.

AI-generated code can introduce subtle bugs, incorrect assumptions about framework behavior, insecure patterns, missing edge cases, or code that compiles but does not match the product domain. In a TypeScript/NestJS/React stack, common risks include weak typing, incorrect REST semantics, stale library APIs, unhandled async failures, and frontend state that works only for the sample data. AI output should be treated as a draft from a fast assistant, not as production-ready truth.

Before production, engineers should review the code for correctness, maintainability, security, and consistency with existing patterns. That includes running TypeScript checks and builds, adding unit and integration tests, manually testing important flows, checking API responses, reviewing logs, and debugging edge cases with realistic data. Code review should specifically challenge generated assumptions and verify that database access, caching, authentication, and error handling are appropriate for the system.

## 6.

Real-time garment status updates can be implemented with WebSockets in NestJS and a React client that subscribes to order or store-level events. When a garment status changes, the backend persists the update through the repository, then publishes an event to connected clients so dashboards update without polling. This works well for operational views where staff need immediate visibility into received, cleaning, ready, and delivered counts.

The tradeoff is additional infrastructure and state management complexity. WebSockets require connection handling, authorization, reconnection logic, event ordering, and horizontal scaling through a shared pub/sub layer such as Redis when multiple backend instances are running. Simpler systems may use polling or Server-Sent Events first, while higher-scale dashboards can combine WebSockets for live updates with REST APIs for initial loading, pagination, cache recovery, and historical data.
