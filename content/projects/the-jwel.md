# THE JWEL — Luxury E-Commerce Platform

> **Status:** Live & Active In Production  
> **Architecture:** App Router, Server-Driven Catalog, Edge Caching, Meta CAPI, Razorpay Integration

---

## Executive Overview

**THE JWEL** is a high-performance, full-stack e-commerce platform custom engineered for a modern jewelry business. Built to scale seamlessly without the overhead of monolithic commerce platforms like Shopify or Magento, THE JWEL delivers ultra-fast page transitions, instant search, dynamic product customization, and reliable payment processing.

```
+-----------------------------------------------------------------------+
|                             THE JWEL SYSTEM                           |
+-----------------------------------------------------------------------+
|  [ Storefront UI ] ---> [ Cloudflare Edge ] ---> [ Next.js App Router ]|
|                                                          |            |
|  [ Meta CAPI Ads ] <--- [ Webhooks & Jobs ] <--- [ Supabase Postgres ]|
+-----------------------------------------------------------------------+
```

---

## The Core Challenge

The retail client faced several critical operational bottlenecks with standard e-commerce setups:

1. **Heavy Catalog Payload & Slow Filtering:** Multi-variant inventory (metal purity, gem carat, band sizing) caused severe rendering lags on traditional platforms.
2. **Attribution Loss:** iOS 14.5+ privacy changes resulted in over **35% unassigned ad conversions** using basic pixel tracking.
3. **Complex Payment Handling:** Intermittent payment drop-offs during peak flash sales without automated retry mechanisms.

---

## Technical Solution & Implementation

### 1. Hybrid App Router Architecture
We structured the catalog using server components with static generation for high-volume collection pages, paired with streaming server responses for inventory queries.

- **Dynamic Search Indexing:** Built-in PostgreSQL full-text search with trigram indexes for instant sub-30ms search.
- **Edge Assets:** Cloudflare R2 and Image Resizing for optimized WebP/AVIF delivery.

### 2. Meta Conversions API (CAPI) Integration
To recover lost ad attribution, we built a server-to-server event pipeline alongside browser pixel triggers.

```typescript
// Server-side event dispatching to Meta Conversions API
export async function trackPurchaseEvent(orderData: OrderRecord) {
  const eventPayload = {
    data: [{
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      user_data: {
        em: [hashSha256(orderData.customerEmail)],
        ph: [hashSha256(orderData.customerPhone)],
      },
      custom_data: {
        currency: "INR",
        value: orderData.totalAmount,
        content_ids: orderData.items.map(item => item.sku),
      },
    }],
  };
  await sendToMetaCAPI(eventPayload);
}
```

### 3. Resilient Payments with Razorpay
Handled multi-step payment states with server-validated webhooks, ensuring zero ghost orders or unfulfilled payments.

---

## Key Performance Metrics & Outcomes

- **+42% Conversion Rate Improvement:** Sub-second page loads directly reduced mobile drop-off.
- **99.8% Ads Attribution Accuracy:** Server-side CAPI matching restored accurate ROAS reporting in Meta Ads Manager.
- **Sub-100ms API Latency:** DB connection pooling via Supabase Supavisor.

---

## Technical Highlights & Features

- **Granular Admin Dashboard:** Live order processing, catalog pricing bulk updates, and customer analytics.
- **Automated Invoice & Inventory Sync:** Seamless webhooks for stock count reduction upon payment confirmation.
- **Modern Glassmorphic Visual Theme:** Built with CSS tokens, dark/light contrast support, and accessible ARIA attributes.
