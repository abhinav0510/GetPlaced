# Migration Complete: Supabase & Clerk to Spring Boot + PostgreSQL + Custom JWT

The **getPlaced** job portal has been successfully migrated from cloud-managed services (Supabase & Clerk) to a custom, self-hosted backend powered by **Spring Boot 3**, **PostgreSQL**, and **JWT Authentication**.

---

## 🛠 Architecture & Tech Stack

| Component | Previous | New Migration |
| :--- | :--- | :--- |
| **Backend Framework** | None (Supabase BaaS) | **Spring Boot 3.3.2** (Java 17/25, JPA/Hibernate, Maven) |
| **Database** | Supabase Managed Postgres | **Self-Hosted PostgreSQL** (`getplaced_db`) |
| **Authentication** | Clerk Auth SDK | **Spring Security + JWT (jjwt)** with Custom `AuthContext` |
| **File Storage** | Supabase Storage Buckets | **Spring Boot Static Resource Handler** (`/uploads/**`) |
| **Frontend API** | Supabase JS Client | **Centralized `apiClient.js`** using standard `fetch` with `Bearer` JWT tokens |

---

## 📁 Key File Map

### Backend Structure (`/backend`)
- `pom.xml` — Spring Boot dependencies (Data JPA, Security, JJWT, PostgreSQL, Validation, Lombok).
- `src/main/resources/schema.sql` — PostgreSQL DDL schema creating `users`, `companies`, `jobs`, `applications`, and `saved_jobs`.
- `src/main/resources/application.yml` — DB connections & JWT configuration settings.
- `src/main/java/com/getplaced/entity/` — JPA entities (`User`, `Company`, `Job`, `Application`, `SavedJob`).
- `src/main/java/com/getplaced/repository/` — Spring Data JPA repositories.
- `src/main/java/com/getplaced/security/` — `JwtTokenProvider`, `JwtAuthenticationFilter`, `CustomUserDetailsService`, `SecurityConfig`.
- `src/main/java/com/getplaced/controller/` — REST Endpoints:
  - `/api/auth/signup` & `/api/auth/login`
  - `/api/jobs` (CRUD, status toggle, search & filter)
  - `/api/companies` (Listing, creation & logo upload)
  - `/api/applications` (Submission, status updates & resume upload)
  - `/api/saved-jobs` (Bookmark management)

### Frontend Refactor (`/src`)
- `src/context/AuthContext.jsx` — React Context storing user token & session state in `localStorage`.
- `src/components/auth-modal.jsx` — Clean modal dialog replacing Clerk UI for Login & Registration.
- `src/components/header.jsx` — Header component with custom user dropdown menu.
- `src/api/apiClient.js` — Base fetch wrapper injecting `Authorization: Bearer <JWT_TOKEN>`.
- `src/api/apiJobs.js`, `apiCompanies.js`, `apiApplication.js` — Mapped to Spring Boot REST endpoints.

---

## 🚀 How to Run the Project Locally

### 1️⃣ Database Setup (PostgreSQL)
Make sure PostgreSQL is running on standard port `5432`:
```sql
CREATE DATABASE getplaced_db;
```
Execute the DDL schema in `backend/src/main/resources/schema.sql` inside your PostgreSQL client (pgAdmin, psql, or DBeaver).

### 2️⃣ Start Spring Boot Backend
From the root directory, navigate to `backend` and run:
```powershell
# Using Maven
mvn spring-boot:run -f backend/pom.xml
```
*The Spring Boot server will launch on `http://localhost:8080`.*

### 3️⃣ Start Vite Frontend
In the root directory, install dependencies and run dev server:
```powershell
npm install
npm run dev
```
*The frontend application will launch on `http://localhost:5173`.*

---

## ✅ Verification & Status
- **Backend Build**: Verified with `mvn compile` — `BUILD SUCCESS`.
- **Frontend Build**: Verified with `npm run build` — Clean Vite production build.
