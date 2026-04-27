# Healthcare - B2B Healthcare SaaS Platform

A production-grade B2B Healthcare SaaS UI application demonstrating frontend development skills, modern architecture, and real-world scenario handling. Built as part of the frontend engineering assignment.

## 🚀 Live Demo Features
- **Real Authentication**: Secure email/password login integrated with Firebase Authentication.
- **Advanced State Management**: Global state handled cleanly using **Redux Toolkit** (slices for auth, patients, notifications, and UI).
- **Patient Management**: Robust patient directory with filtering, searching, pagination, and a seamless toggle between **Grid** and **List** views.
- **Analytics Dashboard**: Interactive charts built with **Recharts**, displaying live trends, department utilization, and revenue metrics.
- **Push Notifications**: Native OS-level and in-app notifications (triggered via Service Worker and native Notification APIs).
- **Modern UI/UX**: Premium dark-themed design system, fully responsive, and highly polished with micro-animations.

## 🛠 Tech Stack
- **Framework**: React 18 with TypeScript (Bootstrapped via Vite)
- **State Management**: Redux Toolkit & React-Redux
- **Backend/Auth**: Firebase Authentication
- **Routing**: React Router DOM v6 (with `React.lazy` code splitting)
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Modular & Scalable)

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akhil11avs/healthcare.git
   cd healthcare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Demo Credentials
To test the application, use the following credentials (or create a new user via Firebase console):
- **Email:** `avsakhil11@gmail.com`
- **Password:** `Akhil@1997`

## 📁 Project Structure

```
healthcare/
├── public/                 # Static assets and Service Worker
├── src/
│   ├── app/                # Redux store and router configuration
│   ├── components/         # Reusable UI components (Avatars, Badges, Layout)
│   ├── data/               # Mock datasets for patients and analytics
│   ├── features/           # Feature-sliced modules (auth, dashboard, patients, analytics)
│   ├── hooks/              # Custom React hooks (e.g., useAuth)
│   ├── services/           # External service integrations (Firebase, Notifications)
│   ├── styles/             # Global CSS and CSS variables
│   ├── types/              # TypeScript interfaces and definitions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Application entry point
```

## 🎯 Assignment Requirements Met
- ✅ Firebase Authentication (Login flow, validation, session handling)
- ✅ Dashboard, Analytics, and Patient Details pages
- ✅ Grid & List view toggle for the Patient Directory
- ✅ Service Worker enabled for Push/Local Notifications
- ✅ State management using Redux Toolkit
- ✅ Responsive UI/UX and clean folder structure
- ✅ *Bonus*: Performance optimizations via Code Splitting (`React.lazy`)
- ✅ *Bonus*: Reusable component design
