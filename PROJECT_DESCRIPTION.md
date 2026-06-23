# HMS – Medi Care | Hospital Management System

## Resume / Portfolio Summary

**HMS – Medi Care** is a full-stack Hospital Management System built to centralize hospital operations across patient registration, admissions, appointments, clinical prescriptions, staff administration, billing, receipts, ledgers, cash/bank accounts, birth records, and analytics dashboards. The application uses a React/Vite frontend, an Express/TypeScript backend, Prisma ORM, and PostgreSQL, with JWT cookie authentication, role-based authorization, reusable CRUD workflows, advanced search/filter endpoints, chart-driven dashboards, and Redis-backed dashboard caching.

**Resume-ready impact statement:**

> Built a full-stack Hospital Management System (HMS – Medi Care) with React 19, Express 5, TypeScript, Prisma, and PostgreSQL, delivering 18 database models, 18 API route modules, 125 REST endpoint handlers, 3 persisted user roles, 50+ frontend pages, reusable management tables/forms, JWT cookie authentication, RBAC-protected administrative actions, Redis-backed analytics caching, dashboard visualizations, and hospital workflows for patients, doctors, nurses, departments, admissions, appointments, prescriptions, billing, receipts, ledgers, cash/bank accounts, birth records, and staff access management.

## Project Overview and Purpose

HMS – Medi Care is designed as an operational dashboard and record-management platform for hospital teams. It provides a secure administrative interface for creating, viewing, editing, searching, filtering, and deleting hospital records while also supporting role-based access management and analytics for clinical, financial, and admission activity.

The implemented system focuses on:

- **Hospital operations:** patients, admissions, appointments, departments, doctors, nurses, prescriptions, and birth registration.
- **Financial workflows:** bills, bill items, money receipts, ledgers, bank accounts, and cash accounts.
- **Administration:** login, profile, password reset/change, staff access creation, user activation toggles, temporary password regeneration, and admin-only permissions management.
- **Analytics:** dashboard APIs and visual components for revenue summaries, billing status, payment modes, patient overviews, admission trends, gender distribution, age distribution, and ledger flow.
- **Search and productivity:** dedicated search/filter APIs, cursor-style pagination support, reusable frontend table controls, global search hotkey support, loading states, confirmation modals, and reusable form/table UI components.

## Tech Stack

### Frontend

- **React 19** single-page application built with **Vite 6**.
- **React Router DOM 7** for client-side routing.
- **Redux Toolkit + React Redux** for authentication state management.
- **TanStack React Query 5** for server-state caching, stale-time control, and mutation/query retries.
- **Axios** with credentialed requests and token-refresh retry handling.
- **React Hook Form** and **Zod** for schema-driven form validation.
- **TanStack React Table** and **React Window** dependencies for table/data-heavy UI workflows.
- **React ApexCharts** for dashboard visualizations.
- **Sass/SCSS**, **Tailwind CSS 4**, and reusable CSS modules/stylesheets for styling.
- **Sonner** toast notifications, **Lucide React**, **React Icons**, and **Framer Motion** for UI feedback and interaction polish.

### Backend

- **Node.js + Express 5** REST API server.
- **TypeScript** backend source with compiled `dist` output.
- **Prisma ORM 6** connected to **PostgreSQL**.
- **JWT** authentication using access/refresh token workflows.
- **bcrypt** for password hashing.
- **cookie-parser** and `withCredentials` frontend requests for cookie-based auth transport.
- **CORS** allowlist for local development and deployed frontend origin.
- **Morgan** request logging.
- **Multer** upload middleware and **AWS S3 SDK** upload support for prescription documents.
- **Nodemailer** for password-reset email/OTP flow.
- **Upstash Redis REST utility** for dashboard/cache operations with retry and cooldown behavior.
- **Express rate limit** and **Redis** dependencies are installed; route-level rate limiting is not currently wired in the inspected API files.

### Shared Package / Monorepo

- npm workspaces-style monorepo with `app/backend`, `app/frontend`, and `packages/schemas`.
- Shared `@hospital/schemas` package using **Zod** for reusable validation schemas.
- **Turborepo** scripts for workspace-level build/dev orchestration.

### Deployment / Configuration

- Frontend includes **Vercel configuration**.
- Environment-driven API URL via `VITE_API_KEY`, with localhost fallback.
- Backend uses `.env` values for database, JWT, Redis, and service credentials.

## Architecture

HMS – Medi Care follows a **client-server architecture**:

1. **React SPA frontend** renders landing, authentication, dashboard, table, create, edit, ledger, help, and admin pages.
2. **Axios API client** sends credentialed REST requests to `/api/v1/*` backend endpoints.
3. **Express API backend** exposes route modules grouped by domain: auth, admin, password reset, dashboard, admission, birth, patient, department, appointment, nurse, doctor, prescription, cash, bank, ledger, bill, money receipt, and AI query.
4. **Controllers and services** separate request handling from business/data logic.
5. **Prisma ORM** maps application services to PostgreSQL models and relationships.
6. **JWT + cookie authentication** protects private endpoints; refresh-token logic retries failed frontend requests after token renewal.
7. **RBAC middleware** enforces allowed roles on protected create/update/delete/admin endpoints.
8. **Redis REST caching** supports cached dashboard analytics with a default 5-minute TTL.

## Quantified Implementation Snapshot

| Area | Implemented Quantity |
|---|---:|
| Database models/tables | 18 Prisma models |
| Persisted Prisma roles | 3 roles: `ADMIN`, `DOCTOR`, `NURSE` |
| Backend route modules mounted under `/api/v1` | 18 mounted modules including AI |
| REST endpoint handlers | 125 route handlers across backend route files |
| Dashboard analytics endpoints | 11 endpoints |
| Frontend route declarations | 61 route declarations |
| Frontend page files | 51 page components |
| Reusable frontend component files | 39 component files |
| Feature API/hook files | 29 feature-layer files |
| Database enums | 9 enums |

## Core Modules Implemented

### Patient Management

- Patient registration, listing, detail retrieval, update, delete, search, and filter workflows.
- Patient fields include hospital patient ID, full name, DOB, gender, mobile, Aadhaar number, and address.
- Relationships connect patients to admissions, bills, and money receipts.

### Admission Management

- Admission creation, listing, detail, update, delete, search, and filter workflows.
- Tracks hospital admission ID, patient, doctor, admission date, discharge date, and status.
- Admission status enum supports `ACTIVE`, `DISCHARGED`, and `CANCELLED`.
- Indexed by patient, doctor, and admission date for query performance.

### Doctor Management

- Doctor CRUD, search, and filter workflows.
- Tracks name, mobile, registration number, qualification, designation, email, specialization, and status.
- Doctors are related to appointments, admissions, and department-head assignments.

### Nurse Management

- Nurse CRUD, search, and filter workflows.
- Tracks nurse registration, email, department, address, shift, status, and contact fields.
- Indexes support filtering/searching by name, mobile, registration number, status, shift, and creation date.

### Department Management

- Department CRUD, search, and filter workflows.
- Tracks department name, description, status, and department head doctor.
- Department status enum supports `ACTIVE` and `INACTIVE`.

### Appointment Management

- Appointment CRUD, search, filter, cancellation, and manual expired-appointment update endpoint.
- Appointment status enum supports `BOOKED`, `CANCELLED`, and `EXPIRED`.
- Indexed by appointment date and doctor for faster schedule queries.

### Prescription Management

- Prescription CRUD, search, filter, admission-specific prescription retrieval, and document upload endpoint.
- Supports prescription file upload through Multer and S3 service utilities.
- Prescription-to-medicine relationship uses cascading medicine deletion when a prescription is deleted.

### Billing and Receipts

- Bill CRUD, search, and filter workflows.
- Bill model connects admissions and patients with bill date, type, total amount, status, and bill items.
- Money receipt CRUD, search, and filter workflows.
- Money receipts connect admissions and patients with amount, payment mode, remarks, received-by, and status fields.

### Ledger, Cash, and Bank Accounts

- Ledger creation, listing, detail, update, delete, entity-specific search/filter, and entity-specific ledger retrieval.
- Ledger supports debit/credit amount types, payment modes, references, remarks, and running balance fields.
- Cash and bank account modules include CRUD, search, and filter workflows.
- Bank accounts track bank name, account number, IFSC code, and status.

### Birth Registration

- Birth record CRUD, search, and filter workflows.
- Tracks birth date/time, baby sex, baby weight, parents’ names, mobile number, delivery type, place of birth, and attendant name.
- Indexed by birth date, mobile number, parent names, and baby sex.

### Dashboard and Reports/Analytics

Implemented dashboard APIs and UI components cover:

- Revenue summary.
- Payment-mode breakdown.
- Monthly billing versus receipt trends.
- Ledger flow summary.
- Billing status breakdown and status summary.
- Patient overview.
- Patient age distribution.
- Admission overview.
- Monthly admission trend.
- Admission gender distribution.
- KPI, active patients, today admissions, billing, receipt, payment, ledger, age, gender, and trend cards/charts.

### Admin and Access Management

- Admin-only staff access creation.
- Staff access activation/deactivation toggle.
- Temporary password regeneration.
- User deletion by registration ID.
- Staff list endpoint.
- Admin-only frontend permissions page guarded by role checks.

### Authentication and Password Management

- Registration-ID identification step.
- Login.
- Set new password.
- Change password.
- Profile retrieval.
- Profile update with admin role check.
- Logout.
- Refresh access token.
- Forgot password, OTP verification, reset password, and authenticated password-change endpoints.

### AI Assistant Module

- Basic AI-style query endpoint at `/api/v1/ai/query`.
- Intent parser currently recognizes admission/patient-count style questions.
- Tool service queries Prisma admission data and response service formats human-readable answers with suggestions.

## API and Route Highlights

The backend mounts these API groups under `/api/v1`:

- `/auth`
- `/admin`
- `/password`
- `/dashboard`
- `/admission`
- `/birth`
- `/patient`
- `/department`
- `/appointment`
- `/nurse`
- `/doctor`
- `/prescription`
- `/cash`
- `/bank`
- `/ledger`
- `/ai`
- `/transection/bill`
- `/transection/money-receipt`

Most management modules implement a consistent REST pattern:

- `POST /` for create.
- `GET /` for list.
- `GET /search` for search.
- `GET /filter` for filtering.
- `GET /:id` for detail.
- `PUT /:id` for update.
- `DELETE /:id` for deletion.

Additional specialized endpoints include:

- Auth token refresh, identify, login, set password, profile, logout, and profile update.
- Password forgot/verify/reset/change flow.
- Appointment cancellation and expired-status update.
- Prescription document upload and admission-specific prescription retrieval.
- Ledger entity-specific search, filter, and retrieval.
- 11 dashboard analytics endpoints.
- AI query endpoint.

## Authentication and Authorization

- Uses **JWT access tokens stored in cookies**; protected backend endpoints read `accessToken` from cookies.
- Authentication middleware verifies JWT, loads the user with Prisma, and blocks inactive/nonexistent users.
- Authorization middleware checks the authenticated user role against route-level allowed roles.
- Persisted Prisma role enum includes `ADMIN`, `DOCTOR`, and `NURSE`.
- Some route guards reference additional string roles such as `RECEPTIONIST` and `ACCOUNTANT`; these are not present in the current Prisma `Role` enum, so the persisted role set remains 3 roles unless the schema is extended.
- Frontend Axios instance sends credentials and retries once after a 401 by dispatching refresh-token logic, then logs out if refresh fails.
- Admin frontend route `/permissions` is protected with a role-based `RequireRole` wrapper allowing only `ADMIN`.

## Database Design and Relationships

The PostgreSQL schema is modeled with Prisma and includes 18 models:

1. `User`
2. `Session`
3. `ActivityLog`
4. `Patient`
5. `Admission`
6. `Birth`
7. `Doctor`
8. `Department`
9. `Appointment`
10. `Nurse`
11. `Prescription`
12. `Medicine`
13. `Ledger`
14. `CashAccount`
15. `BankAccount`
16. `Bill`
17. `BillItem`
18. `MoneyReceipt`

Key relationships include:

- Users to sessions and activity logs.
- Patients to admissions, bills, and money receipts.
- Admissions to patient, doctor, prescriptions, bills, and money receipts.
- Doctors to admissions, appointments, and department-head records.
- Departments to a head doctor.
- Prescriptions to medicines with cascading medicine deletion.
- Bills to bill items with cascading bill-item deletion.
- Bills and money receipts to patient/admission records.

The schema uses uniqueness constraints for important identifiers such as user registration IDs, user emails, patient hospital IDs, Aadhaar numbers, doctor/nurse registration numbers, doctor/nurse emails, department names, ledger codes, cash/bank codes, bank account numbers, and prescription numbers.

## Search, Filtering, Pagination, and Performance

Implemented performance/productivity features include:

- Dedicated `/search` and `/filter` endpoints across core modules.
- Cursor-style pagination support in the backend search utility with `nextCursor` and `hasMore` response metadata.
- Search minimum-length validation utility.
- Configurable pagination limits through backend pagination configuration.
- Raw SQL search ranking with exact, prefix, and similarity-based search paths in the reusable search utility.
- Database indexes on high-value query fields, including admission patient/doctor/date, appointment date/doctor, birth date/mobile/parent names/sex, doctor mobile/status, nurse fields, department status, prescription admission/prescription number, ledger entity/date, bank name, and money receipt amount/payment mode.
- Dashboard Redis caching wrapper with a default 5-minute TTL.
- Upstash Redis REST helper with retry behavior and temporary cooldown after Redis failures.
- React Query frontend cache with 5-minute stale time and one retry for queries.
- Axios timeout set to 10 seconds.
- Reusable table controller hook for data-table state management.

## Security Features

Implemented security controls include:

- JWT verification for protected backend routes.
- Cookie-based auth transport and credentialed frontend requests.
- Refresh-token flow and automatic retry after expired access-token responses.
- bcrypt dependency and password-service/auth-service support for hashed password flows.
- RBAC middleware for route-level role restrictions.
- Admin-only route protection for staff access management.
- CORS allowlist for localhost frontend and deployed Vercel frontend.
- Active-user enforcement during authentication.
- Password reset flow with OTP verification and email utility.
- Centralized error middleware and async-error handling utilities.
- Input validation through Zod schemas in the shared schema package and query-validation helpers.

Not currently confirmed in route wiring:

- Route-level rate limiting is not wired in the inspected routes, although `express-rate-limit` is installed.
- HTML/body sanitization middleware is not present in the inspected Express setup.

## UI/UX Highlights

- Responsive React SPA with separate landing page, protected layout, sidebar, navbar, footer, and dashboard pages.
- 50+ page components across auth, service forms, table views, edit screens, ledger views, help/legal pages, landing page, and dashboard.
- Reusable UI components for action buttons, back button, confirmation modal, loader, loading button, no-data state, skeleton state, table rendering, private routes, layout, sidebar sections, global search hotkey, and dashboard cards/charts.
- Dedicated create/edit/list pages for major hospital domains.
- Dashboard chart components for KPIs, active patients, today’s admissions, admission trends, admission gender, age distribution, billing vs receipt, bills by status, ledger flow, and payment modes.
- Toast notification system through Sonner.
- Network provider utility for connectivity-aware UI behavior.
- Landing page component set for marketing/portfolio presentation: banner, feature, modules, tech, system, impact, action, navbar, and footer sections.

## Deployment and DevOps

- Monorepo managed with npm workspaces-style layout and Turborepo scripts.
- Root scripts support `turbo run build` and `turbo run dev`.
- Backend scripts support Prisma client generation, development server, TypeScript build, and production start from `dist/server.js`.
- Frontend scripts support Vite development, production build, linting, and preview.
- Frontend includes `vercel.json` for Vercel deployment.
- Backend uses environment variables for deployment-specific secrets and service URLs.

## SEO, Analytics, and Third-Party Integrations

### Implemented / Configured

- Frontend landing page suitable for portfolio/marketing use.
- Dashboard analytics are implemented for operational hospital metrics.
- AWS S3 SDK and upload middleware support document/file upload workflows.
- Nodemailer supports password-reset email flows.
- Upstash Redis REST utility supports caching.
- Cloudinary dependency is installed, but the inspected upload path uses AWS S3 utilities.

### Not Evident in Current Codebase

- No dedicated SEO framework, meta-management library, sitemap generation, or analytics tracking integration was identified in the implementation files inspected.
- No payment gateway integration was identified.
- No SMS/WhatsApp integration was identified.

## ATS-Friendly Resume Bullets

- Developed **HMS – Medi Care**, a full-stack Hospital Management System using **React 19, Vite, Express 5, TypeScript, Prisma, PostgreSQL, Redux Toolkit, React Query, JWT, and Redis caching**.
- Implemented **18 relational database models**, including users, sessions, patients, admissions, doctors, nurses, departments, appointments, prescriptions, medicines, ledgers, cash/bank accounts, bills, bill items, money receipts, birth records, and activity logs.
- Built **125 REST endpoint handlers** across **18 API modules**, covering CRUD, search, filtering, dashboard analytics, authentication, password reset, admin access control, file upload, ledger operations, billing, and receipts.
- Designed secure authentication with **JWT cookies, refresh-token retry handling, bcrypt password workflows, active-user checks, and RBAC middleware** for admin/doctor/nurse access patterns.
- Created **50+ frontend pages** and **39 reusable component files** for dashboards, forms, tables, edit screens, ledger views, auth flows, admin permissions, loading states, confirmations, and responsive layouts.
- Added analytics dashboards with **11 backend dashboard endpoints** and visual components for revenue, payment modes, billing status, patient overview, age distribution, admissions overview, monthly trends, gender distribution, and ledger flow.
- Optimized data workflows with **module-level search/filter APIs, cursor pagination support, Prisma indexes, React Query caching, Redis dashboard caching, Axios timeout/retry flow, and reusable table controllers**.
- Integrated file upload support for prescriptions using **Multer and AWS S3 SDK utilities**, plus email-based password reset support using **Nodemailer**.

## Portfolio Description

HMS – Medi Care is a production-style hospital administration platform that digitizes core clinical, operational, and financial workflows. The system provides role-aware access to patient registration, admissions, appointments, doctors, nurses, departments, prescriptions, birth records, billing, receipts, ledgers, cash accounts, bank accounts, dashboards, and staff access management. Its backend uses Express, TypeScript, Prisma, PostgreSQL, JWT authentication, RBAC middleware, Redis-backed caching, and structured service/controller layers, while the frontend uses React, Vite, Redux Toolkit, React Query, Axios, React Hook Form, Zod, ApexCharts, Sass, and reusable UI components to deliver a responsive management interface.

