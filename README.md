# 🏥 Medi Care

A **scalable hospital management web application** built using a **modern full-stack architecture** with **TypeScript**, **Express.js**, **Prisma ORM**, and **PostgreSQL**, designed to handle **secure healthcare workflows** and large-scale data operations efficiently.

## 📌 Overview

Medi Care is a comprehensive hospital management platform that centralizes healthcare operations into a single secure system. The application enables hospitals to manage patients, admissions, appointments, departments, staff, and billing processes while maintaining strong security, scalability, and performance.

The platform leverages modern frontend and backend technologies, providing a responsive user experience, real-time data synchronization, advanced search capabilities, and role-based access control for healthcare professionals.

---

## ⚙️ Tech Stack

### Frontend
- React.js
- TypeScript
- React Query
- Redux Toolkit
- React Hook Form
- Zod
- Axios
- TanStack Table
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Infrastructure & Tools
- Redis
- Supabase
- Vercel
- Render

---

## ✨ Key Features

### 🏥 Hospital Management
- Manage patients, admissions, appointments, departments, billing, and staff operations through a centralized dashboard.
- Streamline healthcare workflows with secure and scalable architecture.

### 🔐 Authentication & Authorization
- JWT access and refresh token authentication.
- Role-Based Access Control (RBAC) for administrators, doctors, nurses, and staff.
- Dynamic user provisioning and permission management.

### ⚡ High-Performance Data Layer
- Multi-layer caching using Memory Cache and Redis.
- Cursor-based pagination for large datasets.
- Optimized PostgreSQL queries and indexing.

### 🔍 Advanced Search & Filtering
- Fast patient and admission lookup.
- Optimized search performance through PostgreSQL indexing.
- Dynamic filtering across healthcare records.

### 📊 Real-Time Data Synchronization
- React Query powered server-state management.
- Background refetching and cache invalidation.
- Consistent UI updates without manual refresh.

### 📝 Form Validation System
- React Hook Form integration.
- Shared Zod validation schemas.
- End-to-end type-safe form validation.

### 📈 Analytics Dashboard
- Interactive visualizations and reports.
- Patient trends analysis.
- Department performance insights.
- Appointment tracking metrics.

### 🧩 Scalable Architecture
- Feature-based frontend architecture.
- Shared validation schemas across frontend and backend.
- Reusable hooks, services, and API layers.

---

## 🚀 Performance Optimizations

- Multi-layer caching (Memory + Redis)
- Cursor-based pagination
- PostgreSQL query optimization
- Database indexing
- Lazy loading
- Code splitting
- Asset optimization
- React Query caching strategies

---

## 🏗️ Architecture Highlights

### Monorepo Architecture
Implemented a monorepo structure with shared validation schemas across frontend and backend, ensuring complete type safety and eliminating duplicated validation logic.

### Shared Validation Layer
Utilized Zod schemas across both client and server applications, maintaining consistent API contracts and validation rules.

### Centralized API Communication
Built a reusable Axios API layer with interceptors for:
- Authentication handling
- Error normalization
- Token management
- Consistent API requests

### Modular Frontend Design
- Reusable UI components
- Feature-based architecture
- Custom hooks
- Shared utilities
- Maintainable folder structure

---

## 📈 Impact

- Improved operational efficiency through centralized healthcare management.
- Enhanced data accuracy using shared validation schemas.
- Enabled real-time synchronization across multiple hospital modules.
- Reduced database load through caching and optimized queries.
- Improved user experience with responsive design and fast data retrieval.
- Increased developer productivity through shared type-safe architecture.
- Delivered a scalable foundation capable of supporting large healthcare organizations.

---

## ⚠️ Technical Challenges Solved

### Shared Type-Safe Validation
Designed a monorepo architecture with shared Zod schemas across frontend and backend while maintaining clean separation of concerns and consistent API contracts.

### RBAC Authentication System
Implemented a secure role-based permission system supporting dynamic user provisioning, access control, and permission revocation.

### High-Performance Data Retrieval
Built a multi-layer caching architecture with cursor-based pagination to efficiently handle large hospital datasets.

### Complex Server-State Management
Managed advanced React Query synchronization including cache invalidation, mutations, background updates, and optimistic UI handling.

### Deployment & Environment Management
Configured production deployment pipelines across Vercel and Render while ensuring secure environment isolation and API communication.

---

## 🌍 Live Demo

🔗 **Live Application**  
https://hospital-management-app-nine.vercel.app

---

## 📂 Repository

🔗 **Source Code**  
https://github.com/riteshgharti333/hospital_management_app

---

## 👨‍💻 Author

### Ritesh Gharti
**Full-Stack Developer**

- GitHub: https://github.com/riteshgharti333

---

## ⭐ Highlights

- Full-Stack TypeScript Application
- React + Express Architecture
- PostgreSQL + Prisma ORM
- JWT Authentication & RBAC
- Redis Caching
- React Query Data Management
- Shared Zod Validation
- Cursor-Based Pagination
- Production Deployment
- Scalable Healthcare Platform
