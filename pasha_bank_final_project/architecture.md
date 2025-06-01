# Pasha Bank Community Investment Platform - System Architecture

This document outlines the proposed system architecture for the rewritten Pasha Bank Community Investment Platform.

## 1. Overview

The platform will be rebuilt as a modern web application with a distinct frontend and backend, communicating via a RESTful API. The technology stack is chosen based on user requirements:

- **Frontend:** React (with TypeScript) styled using Tailwind CSS and incorporating PashaBank brand colors.
- **Backend:** Python (using the Flask framework).
- **Database:** MySQL.

## 2. Frontend Architecture (React)

- **Framework/Library:** React v18+ with TypeScript.
- **Build Tool:** Vite (for faster development and optimized builds).
- **Styling:** Tailwind CSS, configured with PashaBank brand colors (`primary-red: #E21937`, `primary-green: #008165`) and appropriate secondary/neutral colors for a clean, professional, and visually appealing UI.
- **State Management:** Zustand or Redux Toolkit for managing global state like user authentication, project data, and potentially user dashboard information. React Context API might be used for more localized state sharing.
- **Routing:** React Router v6 for handling client-side navigation.
- **API Communication:** Axios or the built-in `fetch` API for making requests to the backend API.
- **Component Structure:** Organize components logically into directories like `components/common`, `components/layout`, `features/projects`, `features/auth`, `features/dashboard`, etc., promoting reusability and maintainability.
- **Key Pages/Views:**
    - Home Page: Browse available investment projects.
    - Project Detail Page: View detailed information about a specific project, funding progress, updates, and investment options.
    - User Dashboard: View personal investment history, manage profile, potentially track project updates for invested projects.
    - Authentication Pages: Login, Registration.
    - Project Creation/Management Page (Potential new feature): Allow verified users to submit new community projects for funding.
    - Admin Dashboard (Potential new feature): For platform administration.
- **UI/UX Focus:** Emphasis on a clean, intuitive, responsive design that is comfortable to use and reflects PashaBank's brand identity. Interactive elements, clear visual hierarchy, and informative feedback will be prioritized.

## 3. Backend Architecture (Python/Flask)

- **Framework:** Flask, a lightweight and flexible Python web framework.
- **Database Interaction:** SQLAlchemy ORM for mapping Python objects to database tables and managing database operations. Alembic will be used for database schema migrations.
- **API Design:** RESTful API principles will be followed. Endpoints will be organized using Flask Blueprints (e.g., `auth`, `projects`, `users`, `investments`).
- **Authentication:** JWT (JSON Web Tokens) for stateless session management. Secure password hashing (e.g., using Werkzeug security helpers or passlib).
- **Key API Endpoints:**
    - `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`
    - `/projects` (GET - list, POST - create)
    - `/projects/<project_id>` (GET - details, PUT - update, DELETE - delete)
    - `/projects/<project_id>/invest` (POST - make investment)
    - `/users/me/investments` (GET - list user's investments)
    - `/users/me/profile` (GET - view profile, PUT - update profile)
    - (Potential) `/admin/...` endpoints for administrative tasks.
- **Business Logic:** Encapsulated within service layers or directly in API route handlers for simpler cases. Logic will cover investment processing, funding status updates, user roles/permissions, etc.
- **Security:** Input validation (e.g., using Marshmallow or Pydantic), proper authentication and authorization checks for all relevant endpoints, CORS configuration, protection against common web vulnerabilities (OWASP Top 10).
- **Asynchronous Tasks (Optional):** Celery could be integrated if long-running tasks are needed (e.g., sending bulk email notifications, complex report generation).

## 4. Database Schema (MySQL)

- **Engine:** MySQL.
- **Key Tables:**
    - `users`:
        - `id` (PK, INT, AUTO_INCREMENT)
        - `username` (VARCHAR, UNIQUE, NOT NULL)
        - `email` (VARCHAR, UNIQUE, NOT NULL)
        - `password_hash` (VARCHAR, NOT NULL)
        - `full_name` (VARCHAR)
        - `role` (ENUM('investor', 'project_owner', 'admin'), DEFAULT 'investor')
        - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
        - `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
    - `projects`:
        - `id` (PK, INT, AUTO_INCREMENT)
        - `title` (VARCHAR, NOT NULL)
        - `description` (TEXT, NOT NULL)
        - `category` (VARCHAR)
        - `image_url` (VARCHAR)
        - `goal_amount` (DECIMAL(10, 2), NOT NULL)
        - `current_amount` (DECIMAL(10, 2), DEFAULT 0.00)
        - `status` (ENUM('draft', 'funding', 'successful', 'failed', 'cancelled'), DEFAULT 'draft')
        - `start_date` (DATE)
        - `end_date` (DATE)
        - `owner_id` (FK, INT, references `users.id`)
        - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
        - `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
    - `investments`:
        - `id` (PK, INT, AUTO_INCREMENT)
        - `user_id` (FK, INT, references `users.id`)
        - `project_id` (FK, INT, references `projects.id`)
        - `amount` (DECIMAL(10, 2), NOT NULL)
        - `status` (ENUM('pending', 'confirmed', 'failed'), DEFAULT 'pending')
        - `invested_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
    - `project_updates` (Optional):
        - `id` (PK, INT, AUTO_INCREMENT)
        - `project_id` (FK, INT, references `projects.id`)
        - `update_text` (TEXT, NOT NULL)
        - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- **Indexing:** Appropriate indexes will be added to foreign keys and frequently queried columns (e.g., `projects.status`, `projects.owner_id`, `investments.user_id`, `investments.project_id`).

## 5. Deployment Strategy

- **Containerization:** Docker will be used to containerize the React frontend (served via a static server like Nginx) and the Flask backend (using Gunicorn/uWSGI).
- **Orchestration (Local):** Docker Compose for setting up the multi-container environment (frontend, backend, database) locally.
- **Production Deployment:** Target a cloud platform (e.g., AWS, Azure, GCP) or PaaS (Render, Heroku). Deployment could involve managed container services (like AWS ECS/EKS, Google Cloud Run) or managed database services (like AWS RDS).
- **CI/CD:** A pipeline (e.g., using GitHub Actions, GitLab CI) should be set up for automated testing, building, and deployment.

This architecture provides a solid foundation for rebuilding the platform with the specified technologies, enhancing its features, and ensuring scalability and maintainability.
