# Job Portal — Multi-Tenant Hiring & Applicant System

> **Status:** Production Ready  
> **Architecture:** Next.js App Router, Prisma ORM, PostgreSQL, NextAuth / Custom Auth, Tailwind CSS

---

## Executive Overview

A modern job matching platform connecting candidates, employers, and recruiters through an intuitive workflow. It simplifies job posting, applicant tracking, candidate filtering, and interview scheduling within a unified web interface.

---

## System Architecture

```
+-------------------------------------------------------------------------+
|                        JOB PORTAL WORKFLOW                              |
+-------------------------------------------------------------------------+
| [ Candidate Portal ] ----> [ Application Engine ] ----> [ Employer CRM ]|
|          |                         |                          |         |
|  (Resume Uploads)           (Prisma Postgres)          (Review / Stage) |
+-------------------------------------------------------------------------+
```

---

## Core Features & Engineering Highlights

1. **Role-Based Access Control (RBAC):** Distinct UX views and API authorizations for Candidates vs. Hiring Managers vs. System Admins.
2. **Instant Search & Filter:** Dynamic filtering by location, remote availability, salary range, experience level, and tech stack tags.
3. **Applicant Kanban Pipeline:** Drag-and-drop status stages (Applied, Screening, Interviewing, Offer, Rejected).
4. **Relational Database Schema:** Normalized relational model designed with Prisma ORM for relational queries without N+1 bottlenecks.

---

## Technical Outcomes

- **Zero N+1 Queries:** Optimized Prisma queries using selective inclusions (`include` & `select`).
- **Responsive Dashboard UI:** Glassmorphic modern controls designed for seamless desktop and tablet operations.
