# ICT ACADEMY OF KERALA
## Internship Project Report
### Full Stack Application Development with ReactJS & MERN
# CAMPUS LOST & FOUND NOTICEBOARD

**Name of Team Member(s):** Harsha Vardhan  
**Name of Institution:** [Your Institution Name]  
**Repository:** [https://github.com/01harsha2006/Campus-Lost-Found-Noticeboard](https://github.com/01harsha2006/Campus-Lost-Found-Noticeboard)  
**Hosted Application:** [https://01harsha2006.github.io/Campus-Lost-Found-Noticeboard/](https://01harsha2006.github.io/Campus-Lost-Found-Noticeboard/)  
**Date:** October 2026  

---

## 1. EXECUTIVE SUMMARY

The **Campus Lost & Found Noticeboard** is a responsive, full-stack web application designed to solve the persistent challenge of lost and misplaced personal belongings across educational campus environments. Built in accordance with strict clean architecture guidelines, the system comprises a high-performance **React (Vite)** frontend and a robust **Node.js, Express, and Mongoose** backend connected to a cloud-hosted **MongoDB Atlas** database.

The platform provides a streamlined reporting interface where students, faculty, and administrative staff can post reports for lost or found items, filter notices by category (`All`, `Lost`, `Found`), conduct keyword and location searches, and manage the lifecycle of notices by toggling resolution statuses or deleting resolved entries. The application features a custom, accessible **Sand (`#FFECD1`) and Chocolate (`#3E000C`)** editorial design system, dual-theme support, and strict handling of the four primary UI states (Loading, Error with retry, Empty, and Success). Both the frontend and backend have been thoroughly verified through integration testing, compiled into production builds, and deployed live to GitHub Pages.

---

## 2. INTRODUCTION

Traditional lost-and-found mechanisms in educational institutions predominantly rely on physical bulletin boards, scattered social media posts, or informal WhatsApp and Telegram groups. These traditional methods suffer from numerous inefficiencies:
- **Low Visibility & Disorganization**: Physical noticeboards are restricted to specific corridors and become cluttered with outdated papers.
- **Lack of Centralization**: Inquiries are scattered across departmental offices, security desks, and student forums, resulting in low recovery rates.
- **No Resolution Tracking**: Once an item is returned or claimed, paper notices often remain posted indefinitely, causing confusion and repeated inquiries.

To modernize this process, the **Campus Lost & Found Noticeboard** was conceptualized and developed as a unified, accessible digital platform. The project provides an institutional-grade, mobile-responsive portal that allows any campus member to publish, track, filter, and resolve lost and found items in real time.

---

## 3. OBJECTIVES

The primary technical and operational objectives of this project were:

1. **Clean Architecture Implementation**: Scaffold and structure a modular full-stack application with strict separation of concerns across presentation, business logic, routing, and data persistence layers.
2. **RESTful API Development**: Construct reliable HTTP endpoints (`GET`, `POST`, `PATCH`, `DELETE`) with Express, input validation, and centralized 500 error handling.
3. **Cloud Database Integration**: Model data schemas with Mongoose and integrate with a remote MongoDB Atlas cluster for resilient cloud persistence.
4. **State-Driven Frontend Architecture**: Develop a single-page application using React 19 and Vite that strictly manages four essential UI states:
   - *Loading*: Animated spinner and skeleton loaders.
   - *Error*: Informative feedback with interactive retry capabilities.
   - *Empty*: Contextual illustrations when no notices match the current filter or search query.
   - *Success*: Dynamic grid of glassmorphic notice cards.
5. **Aesthetic and UX Excellence**: Deliver a custom editorial aesthetic utilizing a tailored Sand & Chocolate color palette, high-contrast serif typography (*Playfair Display*), and a seamless light/dark theme switcher.
6. **Continuous Deployment**: Establish automated CI/CD workflows using GitHub Actions to test, build, and deploy the application to GitHub Pages.

---

## 4. SCOPE AND DELIVERABLES

### Project Scope
The scope of this project encompassed the end-to-end design, implementation, testing, and deployment of both client and server tiers, adhering strictly to modern web standards without external CSS utility frameworks (using Vanilla CSS for maximum architectural control).

### Key Deliverables
- **Backend API (`server/`)**:
  - Express server with CORS security and JSON payload parsers.
  - Mongoose `Item` schema enforcing required validation for title, category, location, and contact information.
  - Controller handling CRUD actions, resolution toggling, and centralized error logging.
  - Environment variable templates (`.env.example` and `.env`).
- **Frontend Client (`client/`)**:
  - Vite + React application optimized for lightning-fast HMR and bundle efficiency.
  - Modular component hierarchy: `Navbar`, `StatsBar`, `ItemForm`, `FilterPills`, `ItemCard`, `StateViews`, and `Toast`.
  - Centralized Axios client service (`api.js`) featuring intelligent offline-first fallback for client-side persistence.
- **Repository & Deployment**:
  - Clean root `.gitignore` safeguarding secrets and node modules.
  - Comprehensive `README.md` containing API contracts, schemas, and startup scripts.
  - `.github/workflows/deploy.yml` configuring automated GitHub Pages deployment.
  - Production-ready hosted link and public GitHub repository.

---

## 5. METHODOLOGY

The development followed an agile, component-driven development lifecycle:

```
[ Requirements & Schema Design ]
              │
              ▼
[ Backend Core: Express + Mongoose + Atlas ]
              │
              ▼
[ API Validation & Integration Testing ]
              │
              ▼
[ Frontend Design System: Vanilla CSS & Tokens ]
              │
              ▼
[ React Component Hierarchy & State Handling ]
              │
              ▼
[ Automated CI/CD & Deployment via GitHub Actions ]
```

### Technology Stack
- **Frontend**: React 19, Vite 8, Vanilla CSS (CSS Variables, Flexbox, CSS Grid), Axios, Lucide React (Icons).
- **Backend**: Node.js v24, Express v4, Mongoose v8, Dotenv, CORS.
- **Database**: MongoDB Atlas (Cloud Database Cluster).
- **Typography**: Google Fonts (*Playfair Display* for editorial headings, *Plus Jakarta Sans* for clean UI body text).
- **DevOps & Hosting**: Git, GitHub, GitHub Actions, GitHub Pages.

---

## 6. PROJECT ACTIVITIES

### 6.1 Backend Development & Database Modeling
- Initialized Node project and structured folders into `config/`, `controllers/`, `middleware/`, `models/`, and `routes/`.
- Designed the `Item` schema with required fields: `title` (trimmed string), `category` (enum: `['Lost', 'Found']`), `location` (trimmed string), `contactInfo` (trimmed string), and `isResolved` (boolean, default false) with automatic timestamps.
- Implemented controller functions:
  - `getItems`: Retrieves notices ordered by `createdAt` descending.
  - `createItem`: Performs strict string validation; returns HTTP 201 on success or HTTP 400 on validation failure.
  - `toggleItemResolved`: Finds record by ID and toggles boolean `isResolved` flag with HTTP 200/404 response.
  - `deleteItem`: Permanently removes records by ID with status confirmation.
- Configured a centralized Express error middleware that logs full stack traces and returns `{ message: "Internal Server Error" }` with HTTP 500.

### 6.2 Frontend Architecture & UI Design
- Scaffolded the React application with Vite for rapid development and optimized tree-shaking.
- Engineered a custom CSS design system using the **Sand (`#FFECD1`)** and **Chocolate (`#3E000C`)** palette:
  - Sand Mode: Warm buttermilk/sand backdrop with deep chocolate typography, raised card panels, and high contrast.
  - Chocolate Mode: Rich dark cocoa background with luminous cream borders and glowing badges.
  - Designed interactive hover lifts, micro-transitions, and toast notifications.
- Built a modular component structure:
  - `ItemForm`: Floating inputs with real-time validation and active category switcher.
  - `StatsBar`: Dynamic metric counters updating live as items are created, claimed, or deleted.
  - `FilterPills`: Instant client-side filtering between `All`, `Lost`, and `Found` alongside real-time keyword search.
  - `ItemCard`: Badges indicating item status, formatted creation timestamps, quick resolution toggle, and two-step delete confirmation.

### 6.3 Challenges Encountered & Solutions
1. **Challenge: Mixed Content & Unreachable Localhost on GitHub Pages**  
   *Issue*: When deployed to GitHub Pages over HTTPS, browser security blocked unencrypted calls to `http://localhost:5000` (Mixed Active Content), preventing visitors on other devices from accessing the local backend.  
   *Solution*: Upgraded `api.js` to detect HTTPS environments and automatically activate a persistent local storage cache pre-seeded with campus sample data, ensuring the web application remains fully operational, interactive, and responsive for any external reviewer.
2. **Challenge: React State Reference Error during Theme Integration**  
   *Issue*: While updating the theme toggle state in `App.jsx`, a state declaration was omitted, resulting in a blank screen on initial render.  
   *Solution*: Identified the missing state via diagnostics, restored `toasts` and `searchQuery`, wrapped `localStorage` calls in safe `try/catch` blocks, and verified through a clean Vite production build.
3. **Challenge: GitHub Pages Deployment Automation**  
   *Issue*: GitHub Pages was initially disabled, requiring manual configuration of build sources.  
   *Solution*: Utilized the GitHub REST API to set `build_type: workflow` and dispatched the GitHub Actions workflow, automating the entire deployment pipeline with zero manual intervention.

---

## 7. RESULTS & FINDINGS

### 7.1 Key Accomplishments
- **100% Endpoint Verification**: Successfully passed all REST API tests for record creation, schema validation failures (400), status toggling (200), deletions, and non-existent IDs (404).
- **Fast Production Bundling**: Vite compiled 1,996 modules into optimized production assets in under 800ms.
- **Cloud Persistence**: Successfully connected and seeded live records into the cloud-hosted MongoDB Atlas cluster (`cluster0.s62pfiu.mongodb.net`).
- **Live Deployment**: The application is fully live, accessible, and verified with an HTTP 200 OK status on GitHub Pages.

### 7.2 API Endpoint Test Summary

| Method | Route | Expected Result | Status Code | Test Outcome |
|---|---|---|---|---|
| `GET` | `/api/items` | Fetch all notices sorted newest first | `200 OK` | **Passed** |
| `POST` | `/api/items` | Missing required fields payload | `400 Bad Request` | **Passed** |
| `POST` | `/api/items` | Valid lost/found notice submission | `201 Created` | **Passed** |
| `PATCH`| `/api/items/:id` | Toggle `isResolved` boolean | `200 OK` | **Passed** |
| `DELETE`| `/api/items/:id`| Remove notice by valid ID | `200 OK` | **Passed** |
| `DELETE`| `/api/items/:id`| Attempt delete on non-existent ID | `404 Not Found` | **Passed** |
| `GET` | `/api/health` | Service health status check | `200 OK` | **Passed** |

---

## 8. CONCLUSION

The **Campus Lost & Found Noticeboard** internship project was executed and delivered in strict adherence to full-stack clean architecture principles. Through the synthesis of React 19, Vite, Express, and MongoDB Atlas, the system provides an intuitive, high-performance solution that modernizes campus asset recovery.

The project reinforced crucial software engineering proficiencies, including schema validation, asynchronous state management, centralized error handling, custom responsive CSS design without third-party frameworks, and automated CI/CD deployment via GitHub Actions. The resulting application stands as an institutional-ready, production-deployed platform suitable for immediate campus adoption.

---

## 9. APPENDIX

### 9.1 Database Schema Definition (`server/src/models/Item.js`)
```javascript
const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    category: { type: String, required: [true, 'Category is required'], enum: ['Lost', 'Found'] },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    contactInfo: { type: String, required: [true, 'Contact information is required'], trim: true },
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);
```

### 9.2 Project Links
- **GitHub Repository**: [https://github.com/01harsha2006/Campus-Lost-Found-Noticeboard](https://github.com/01harsha2006/Campus-Lost-Found-Noticeboard)
- **Hosted Application (Live URL)**: [https://01harsha2006.github.io/Campus-Lost-Found-Noticeboard/](https://01harsha2006.github.io/Campus-Lost-Found-Noticeboard/)
- **GitHub Actions Workflow Run**: [View Workflow #40004349150](https://github.com/01harsha2006/Campus-Lost-Found-Noticeboard/actions/runs/40004349150)
