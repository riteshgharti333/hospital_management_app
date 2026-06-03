# 🏥 Medi Care

A **scalable hospital management web application** built using a **modern full-stack architecture** with **TypeScript**, **React.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**, designed to streamline healthcare operations through secure role-based access control, high-performance data management, cloud storage integration, and real-time synchronization.

---

## 📌 Overview

Medi Care is a comprehensive hospital management platform that centralizes healthcare workflows into a single secure system. The application enables hospitals to efficiently manage patients, admissions, appointments, departments, billing operations, healthcare records, and staff administration while maintaining strong security, scalability, and performance.

Built using modern full-stack technologies, the platform provides healthcare organizations with a reliable, maintainable, and production-ready solution capable of handling large-scale hospital operations.

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

### Infrastructure & Cloud
- AWS S3
- Redis
- Supabase
- Vercel
- Render

### Development Tools
- Git
- GitHub
- Postman
- ESLint
- Prettier

---

## ✨ Key Features

### 🏥 Hospital Management System
- Manage patients, admissions, appointments, departments, doctors, nurses, staff, and billing operations through a centralized platform.
- Streamline healthcare workflows with secure and scalable architecture.

### 🔐 Authentication & Authorization
- Secure JWT access and refresh token authentication.
- Role-Based Access Control (RBAC) for administrators, doctors, nurses, and hospital staff.
- Dynamic user provisioning and permission management.

### ☁️ AWS S3 File Storage
- Secure cloud-based file storage using AWS S3.
- Store and manage patient documents, medical reports, prescriptions, and media assets.
- Scalable and reliable file management architecture.

### ⚡ High-Performance Data Layer
- Multi-layer caching using Memory Cache and Redis.
- Cursor-based pagination for large datasets.
- Optimized PostgreSQL queries and indexing strategies.

### 🔍 Advanced Search & Filtering
- Fast patient and admission lookup.
- Optimized search performance through PostgreSQL indexing.
- Dynamic filtering across healthcare records and departments.

### 📊 Real-Time Data Synchronization
- React Query powered server-state management.
- Background refetching and cache invalidation.
- Automatic UI updates without manual refresh.

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
- Optimized API communication
- Cloud-based file storage using AWS S3

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

### Cloud Infrastructure
Integrated AWS S3 for scalable file storage and media management while leveraging PostgreSQL for structured healthcare data and Redis for high-performance caching.

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
- Simplified medical document management through AWS S3 cloud storage.

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

### Cloud File Storage Integration
Implemented secure AWS S3 file uploads and storage workflows while ensuring efficient file retrieval and scalable storage management.

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
- AWS S3 Cloud Storage
- Redis Caching
- React Query Data Management
- Shared Zod Validation
- Cursor-Based Pagination
- Production Deployment
- Scalable Healthcare Platform
- Enterprise-Ready Architecture
