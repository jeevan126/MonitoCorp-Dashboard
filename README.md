# 🛠️ MonitoCorp Service Dashboard

A modern service monitoring dashboard built with **Next.js**, **React Query**, and **Tailwind CSS**, designed to provide live status updates, rich filtering, and historical event tracking for all registered services.

---

## 📦 Features

- **Service List View** with filtering, pagination, and search
- **Live Status Updates** on the current page without refreshing
- **Create/Edit/Delete Services** using custom modals with confirmation prompts
- **Service Details View** with full historical event tracking and infinite scroll
- **Toast notifications** for user feedback
- **Clean, responsive, and accessible UI** using utility-first styling

---

## 🧱 Tech Stack & Architectural Decisions

| Layer        | Library / Tool              | Why it was chosen                                                                 |
|--------------|-----------------------------|------------------------------------------------------------------------------------|
| **Framework**| [Next.js](https://nextjs.org) | For file-based routing, API flexibility, SSR/SSG, and scalability                  |
| **Styling**  | [Tailwind CSS](https://tailwindcss.com) | Utility-first, responsive design system with high performance                    |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/v5) | Declarative, cache-aware, and optimized API data handling                         |
| **Mocking**  | [MSW (Mock Service Worker)](https://mswjs.io/) | Intercepts fetch/XHR for seamless development/testing without real backend        |
| **State**    | `useState`, `useEffect`, and `React Query` cache | Lightweight, no unnecessary global state manager like Redux                      |
| **Notifications** | [sonner](https://ui.shadcn.dev/docs/components/sonner) or similar toast system | Non-blocking, elegant notifications                                               |
| **UI Elements** | Headless UI / Custom Modals | Accessible UI primitives and fine-grained control                                 |

---

## 🗂️ Folder Structure

├── components/ # UI components (ServiceList, ServiceDetail, EventList, Modals)
├── hooks/ # React Query hooks (CRUD and infinite queries)
├── mocks/ # MSW mock handlers & data
├── pages/ # Next.js pages (index.tsx, [id].tsx)
├── public/ # Static assets
├── styles/ # Global styles (if needed)
└── utils/ # Helper functions

## 🧠 Architectural Decisions

### 💡 Modular Components
- All logic is separated into small, composable components. ServiceList handles list view, ServiceDetail handles individual detail view, and EventList manages infinite scrolling events.

### 💡 State Management
- React Query v5 is used instead of a global state manager like Redux. This allows us to cache, invalidate, and refetch data without writing boilerplate reducers or actions.

### 💡 Polling
- Polling is enabled only for the currently visible page using a custom `useStatusPolling` hook, minimizing network load while keeping data fresh.

### 💡 Smooth Navigation
- Navigation to the detail view is animated using `router.push()` and hover transitions, with fast route transitions and loading indicators.

### 💡 Infinite Scroll for Events
- Service events are paginated with an infinite scroll observer, improving UX and avoiding long DOM lists.

### 💡 UX & Feedback
- All key actions (Create, Update, Delete) display toast messages for success/failure.
- Loading spinners and skeletons enhance user feedback.


---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/monitocorp-dashboard.git
cd monitocorp-dashboard

npm install
# or
yarn install


# Automatically starts with dev mode
npm run dev

Open http://localhost:3000 in your browser.
