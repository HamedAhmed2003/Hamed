# Interno - Internship Management Platform

Interno is a full-stack internship platform that connects students with companies. It allows students to discover and apply for internships, companies to manage applicants, and admins to monitor the system.

![Interno Platform](https://drive.google.com/uc?export=view&id=1iHoik5AsI2u9nPdVoxS1pP7p8rENkx0y)

---

## Features

### Student Features

- Browse all internships (guest and logged-in users)
- View internship details
- Apply for internships
- Take internship exams
- Manage profile and applications
- Email verification using OTP system

### Company Features

- Create and manage internships
- View applicants
- Accept or reject candidates
- View internship analytics
- Company dashboard

### Admin Features

- Admin dashboard
- Manage users (students and companies)
- Monitor internships and applications
- System control and analytics

---

## Authentication System

- JWT-based authentication
- Role-based access (Student, Company, Admin)
- Email verification using OTP (expires in 10 minutes)
- Protected routes across frontend and backend
- Resend OTP functionality

---

## Tech Stack

### Frontend

- React with TypeScript and Vite
- Zustand for state management
- React Router
- Tailwind CSS with ShadCN UI
- Axios for API calls

### Backend

- Node.js with Express and TypeScript
- MongoDB with Mongoose
- JWT authentication
- OTP email system using Resend
- RESTful API architecture

---

## Project Structure

### Backend (TypeScript API)

```
backend/
├── src/
│ ├── index.ts
│ ├── controllers (admin, ai, application, auth, internship)
│ ├── routes (admin, ai, application, auth, internship)
│ ├── models (User, Internship, Application)
│ ├── middlewares (auth.ts)
│ ├── emails (emailTemplates.ts)
│ ├── utils (otp.ts, responseWrapper.ts)
│ ├── config
│ ├── services
│ ├── validations
├── uploads
├── package.json
├── tsconfig.json
└── .env

```

### Frontend (React + TypeScript)

```
frontend/
├── src/
│ ├── main.tsx
│ ├── App.tsx
│ ├── pages
│ │ ├── Landing
│ │ ├── Login
│ │ ├── Signup
│ │ ├── VerifyEmail
│ │ ├── InternshipBrowse
│ │ ├── InternshipDetails
│ │ ├── ExamPage
│ │ ├── admin
│ │ ├── company
│ │ └── student
│ ├── components
│ ├── components/ui
│ ├── services/api.ts
│ ├── store
│ ├── hooks
│ ├── lib
│ ├── types
│ ├── data/mock.ts
│ └── test
├── public
├── src/assets
├── package.json
└── vite.config.ts

```

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

---

## Backend Setup

```bash
cd backend
npm install
```

1. create a `.env` file in `INTERNO/.env` with the following:

```
PORT=8000
MONGODB_URI= # your mongodb URI
JWT_SECRET= # your JWT secret
JWT_EXPIRES_IN=30d
RESEND_API_KEY= # your RESEND API KEY
GEMINI_API_KEY=# your GEMINI API KEY

```

2. Make sure you are open INTERNO folder in your terminal

3. then run these command lines:

   ```sh
   npm run dev
   ```

## FRONTEND Setup

1. create new terminal and run this command

```bash
cd frontend
npm install
npm run dev
```

2. then open any browser like (chrome) and write this path http://localhost:8080
