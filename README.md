# 🎓 Campus Lost & Found Noticeboard (MERN Full-Stack)

A modern, responsive, full-stack MERN application built with clean architecture for university students, faculty, and campus security to report, browse, track, and resolve lost and found belongings across campus.

---

## 🌟 Key Features

- **Intuitive Notice Creation**: Report lost or found items with title, category (`Lost` or `Found`), location, and contact details with real-time client & server validation.
- **Dynamic Category Filtering**: Seamlessly toggle between `All`, `Lost`, and `Found` notice views with live count badges.
- **Instant Search**: Search notices on the fly by item title, location, or contact keywords.
- **Resolution Lifecycle**: One-click toggle between active notice and resolved/reclaimed status.
- **Notice Management**: Delete resolved or outdated notices with two-step confirmation.
- **Strict 4 UI States Handling**:
  1. ⏳ **Loading State**: Shimmering skeleton cards and animated spinner during data fetch.
  2. ⚠️ **Error State**: Informative error card with an interactive **"Retry Connection"** button.
  3. 📭 **Empty State**: Contextual empty illustrations and messaging for each category.
  4. ✨ **Success State**: Polished glassmorphic notice cards with category badges and time stamps.
- **Stunning Modern Aesthetic**: Glassmorphism, Google Fonts (`Outfit` & `Plus Jakarta Sans`), sleek dark theme, and micro-animations.

---

## 📐 Clean Architecture & Project Structure

```
Capstone/
├── .gitignore                    # Ignores node_modules, .env, dist
├── README.md                     # Comprehensive project documentation
│
├── server/                       # Node.js + Express + Mongoose Backend
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Server dependencies & scripts
│   └── src/
│       ├── config/
│       │   └── db.js             # MongoDB connection configuration
│       ├── controllers/
│       │   └── itemController.js # Business logic for CRUD & status toggle
│       ├── middleware/
│       │   └── errorHandler.js   # Centralized error handler returning status 500
│       ├── models/
│       │   └── Item.js           # Mongoose Schema with validation & timestamps
│       ├── routes/
│       │   └── itemRoutes.js     # Express routes prefixed under /api/items
│       └── server.js             # Main server entry point & middleware config
│
└── client/                       # React Frontend powered by Vite
    ├── .env.example              # Client environment variables template
    ├── index.html                # HTML5 entry with Google Fonts & SEO meta tags
    ├── package.json              # Client dependencies & scripts (start, dev, build)
    ├── vite.config.js            # Vite configuration
    └── src/
        ├── components/
        │   ├── FilterPills.jsx   # Filter buttons for All, Lost, Found & Search
        │   ├── ItemCard.jsx      # Notice card with badges, toggle, and delete
        │   ├── ItemForm.jsx      # Form to submit reports with validation
        │   ├── Navbar.jsx        # Top brand bar and live status indicator
        │   ├── StateViews.jsx    # Loading, Error with Retry, and Empty states
        │   ├── StatsBar.jsx      # Real-time metrics dashboard
        │   └── Toast.jsx         # Non-intrusive action feedback toasts
        ├── services/
        │   └── api.js            # Axios client with fallback to localhost:5000/api
        ├── App.jsx               # Root application component managing 4 UI states
        ├── index.css             # Vanilla CSS design system & micro-interactions
        └── main.jsx              # React DOM render entry
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **MongoDB** (Local instance or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

---

### 2. Environment Configuration

#### Backend Configuration (`server/`)
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Set your environment variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campus_lost_found
   CORS_ORIGIN=http://localhost:5173
   ```
   > **Note on MongoDB**: If using MongoDB Atlas, replace `MONGODB_URI` with your connection string:  
   > `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campus_lost_found?retryWrites=true&w=majority`

#### Frontend Configuration (`client/`)
1. Navigate to the `client/` directory:
   ```bash
   cd ../client
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Set your environment variables:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

### 3. Installation & Running

#### Starting the Backend Server
```bash
cd server
npm install
npm run dev
```
The backend will run on `http://localhost:5000` (or `PORT` specified in `.env`).

#### Starting the Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 REST API Specifications

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/items` | Fetch all items sorted by `createdAt` descending | `200 OK`, `500 Server Error` |
| `POST` | `/api/items` | Validate and create a new item | `201 Created`, `400 Bad Request`, `500 Server Error` |
| `PATCH` | `/api/items/:id` | Toggle `isResolved` status of an item | `200 OK`, `404 Not Found`, `500 Server Error` |
| `DELETE`| `/api/items/:id` | Delete an item by ID | `200 OK`, `404 Not Found`, `500 Server Error` |
| `GET` | `/api/health` | Health check endpoint | `200 OK` |

### Request & Response Examples

#### 1. Create a Notice (`POST /api/items`)
**Request Body:**
```json
{
  "title": "AirPods Pro with White Case",
  "category": "Found",
  "location": "Library 2nd Floor Study Room",
  "contactInfo": "student.help@campus.edu"
}
```
**Response (201 Created):**
```json
{
  "_id": "664fa83c21c7d31b402801e2",
  "title": "AirPods Pro with White Case",
  "category": "Found",
  "location": "Library 2nd Floor Study Room",
  "contactInfo": "student.help@campus.edu",
  "isResolved": false,
  "createdAt": "2026-10-23T16:30:00.000Z",
  "updatedAt": "2026-10-23T16:30:00.000Z"
}
```

#### 2. Toggle Status (`PATCH /api/items/:id`)
Toggles `isResolved` between `false` and `true`.  
**Response (200 OK):**
```json
{
  "_id": "664fa83c21c7d31b402801e2",
  "title": "AirPods Pro with White Case",
  "category": "Found",
  "location": "Library 2nd Floor Study Room",
  "contactInfo": "student.help@campus.edu",
  "isResolved": true,
  "createdAt": "2026-10-23T16:30:00.000Z",
  "updatedAt": "2026-10-23T16:35:00.000Z"
}
```

---

## 🗄️ Database Model Specification

File: `server/src/models/Item.js`

```javascript
const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Lost', 'Found'],
        message: 'Category must be either Lost or Found',
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    contactInfo: {
      type: String,
      required: [true, 'Contact information is required'],
      trim: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
```

---

## 🛡️ Error Handling

- **Validation Failures (400)**: Missing or invalid fields return `{ "message": "..." }` detailing the missing requirements.
- **Resource Not Found (404)**: Non-existent IDs return `{ "message": "Item not found" }`.
- **Centralized Middleware (500)**: Catches unhandled errors, logs the full stack trace to the server console, and returns `{ "message": "Internal Server Error" }`.

---

## 📜 Available NPM Scripts

### Backend (`server/package.json`)
- `npm run dev`: Starts Express with `nodemon` for auto-reloading on changes.
- `npm start`: Starts Express with production Node.js.

### Frontend (`client/package.json`)
- `npm run dev`: Starts Vite local development server on port 5173.
- `npm run build`: Compiles production assets into `client/dist/`.
- `npm run start` or `npm run preview`: Previews the compiled production build locally.
