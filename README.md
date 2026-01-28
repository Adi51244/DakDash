# 🚀 DakDash - Smart Parcel Tracking for India

![DakDash Banner](https://img.shields.io/badge/DakDash-India%20Post%20Tracker-C62828?style=for-the-badge&logo=postal-horn)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

A modern, intelligent web application for tracking parcels across **6 major Indian carriers** in real-time. Built with React, Material UI, FastAPI, and powered by the TrackingMore API.

🔗 **Live Demo:** [https://dak-dash.vercel.app/](https://dak-dash.vercel.app/)

📡 **Backend API:** [https://dakdash-api.onrender.com](https://dakdash-api.onrender.com)

---

## 💡 Problem Statement

Have you ever tried to track your India Post parcel on their official website and faced these issues?

- 🚫 **Website not loading** or experiencing downtime
- 🤖 **CAPTCHA not generating** or constantly failing
- 🐌 **Slow and outdated interface** making tracking frustrating
- ❌ **Multiple carrier tracking** requiring different websites

**DakDash solves all these problems!** With a modern, fast, and reliable interface, track your parcels from 6 major Indian carriers in one place—no CAPTCHA headaches, no website downtimes, just instant tracking updates.

---

## ✨ Features

### Core Features
- 🔍 **Real-Time Tracking** - Get instant updates on your parcels
- 📦 **Multi-Carrier Support** - Track from 6 major Indian carriers:
  - 🇮🇳 India Post
  - 📦 Delhivery
  - ✈️ Blue Dart
  - 🚚 DTDC
  - 🛒 Ecom Express
  - 🎯 Ekart Logistics
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Beautiful UI** - Clean, modern interface with Material UI components
- 🎬 **Smooth Animations** - Timeline animations powered by Framer Motion

### Phase 1 Features
- 🌙 **Dark Mode** - Toggle between light and dark themes with persistence
- 🔄 **Refresh Button** - Manually refresh tracking data with timestamps
- 📋 **Copy Tracking Number** - One-click copy to clipboard
- 🕐 **Recent Searches** - Quick access to your last 5 tracking numbers with localStorage

### Phase 2 Features (Intelligent Insights)
- ⚠️ **Delay Detection** - Automatically detects shipment delays (>48h, >72h thresholds)
- 🎯 **Delay Badges** - Color-coded status chips (On Track, Delayed, Critical)
- 💡 **Smart Summary** - AI-powered natural language insights about your shipment
  - "Your parcel is on track and progressing normally"
  - "Package hasn't been updated in 3 days. Consider contacting support"
  - Contextual advice based on shipment status
- 🏭 **Multi-Carrier Architecture** - Extensible factory pattern for easy carrier additions

### Technical Features
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development
- 🔐 **Secure** - Environment-based configuration for API keys
- 🌐 **Production Ready** - Optimized for Vercel and Render deployment
- 🔌 **RESTful API** - Clean FastAPI backend with automatic docs
- 📊 **Type Safety** - Pydantic models for data validation

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** (Vite)
- **Material UI v5.15**
- **Framer Motion 10.18** (animations)
- **Axios 1.6** (HTTP client)
- **React Router 6.21** (navigation)

### Backend
- **FastAPI 0.109** (Python)
- **Pydantic 2.5** (data validation)
- **httpx 0.26** (async HTTP)
- **Uvicorn 0.27** (ASGI server)

### API Integration
- **TrackingMore API v4** - 1000+ carriers worldwide support

---

## 📁 Project Structure

```
Dakdash/
├── backend/
│   ├── main.py              # FastAPI application with tracking endpoints
│   ├── models.py            # Pydantic models (TrackingResponse, TrackingEvent)
│   ├── config.py            # Configuration management & CORS
│   ├── delay_detection.py   # Phase 2: Delay detection & smart summary engine
│   ├── carriers.py          # Phase 2: Multi-carrier architecture (factory pattern)
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Example environment variables
│   ├── Procfile             # Deployment configuration
│   └── render.yaml          # Render deployment config
│
└── frontend/
    ├── src/
    │   ├── components/          # React components
    │   │   ├── TrackingTimeline.jsx    # Animated event timeline
    │   │   ├── TrackingResult.jsx      # Main results display
    │   │   ├── LoadingState.jsx        # Loading animation
    │   │   ├── ThemeToggle.jsx         # Phase 1: Dark mode toggle
    │   │   ├── SmartSummary.jsx        # Phase 2: Smart insights card
    │   │   └── DelayBadge.jsx          # Phase 2: Status badge
    │   ├── pages/              # Page components
    │   │   ├── LandingPage.jsx         # Hero with carrier selection
    │   │   └── TrackingPage.jsx        # Main tracking interface
    │   ├── services/           # API services
    │   │   └── api.js                  # Axios client with multi-carrier support
    │   ├── utils/              # Utility functions
    │   │   └── storage.js              # Phase 1: localStorage helpers
    │   ├── theme.js            # MUI light theme
    │   ├── themeDark.js        # Phase 1: MUI dark theme
    │   ├── ThemeContext.jsx    # Phase 1: Theme state management
    │   ├── App.jsx             # Root component with routing
    │   └── main.jsx            # Entry point
    ├── public/
    │   ├── logo.png            # App icon (browser tab)
    │   └── logo2.png           # Alternative logo
    ├── package.json
    ├── vite.config.js
    └── vercel.json             # Vercel deployment config
```

---

## 🎯 Demo Endpoint

Want to see all Phase 2 features in action? Use the tracking number **`DEMO`** on the landing page!

This will show:
- ⚠️ Delay badge with moderate severity (3 days no update)
- 💡 Smart summary: "Your parcel hasn't been updated in 3 days. There might be a slight delay in transit..."
- 📍 Complete tracking timeline with 4 events (Mumbai → Delhi)
- 🎨 All UI features in action

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **TrackingMore API Key** ([Get one free here](https://www.trackingmore.com/))

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your TrackingMore API key:
   ```env
   TRACKINGMORE_API_KEY=your_actual_api_key_here
   ```

5. **Run the backend server**
   ```bash
   python main.py
   ```
   
   Backend will be running at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   The default `.env` should work for local development:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Frontend will be running at `http://localhost:3000`

---

## 📦 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

#### Backend (Render) - FREE
1. Go to [Render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Environment Variable: `TRACKINGMORE_API_KEY` = `za7tfa5p-fw48-s56d-ejfl-r3yae544b09a`
5. Deploy 🚀

#### Frontend (Vercel) - FREE
1. Go to [Vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Settings:
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `dist`
4. Environment Variable: `VITE_API_URL` = `[Your Render backend URL]`
5. Deploy 🎉

---

## 🔑 API Endpoints

### Backend API

#### Health Check
```http
GET /
```
Returns API status and version.

#### Get Supported Carriers
```http
GET /api/carriers
```

**Response:**
```json
{
  "carriers": [
    {"code": "india-post", "name": "India Post", "icon": "🇮🇳"},
    {"code": "delhivery", "name": "Delhivery", "icon": "📦"},
    {"code": "bluedart", "name": "Blue Dart", "icon": "✈️"},
    {"code": "dtdc", "name": "DTDC", "icon": "🚚"},
    {"code": "ecom-express", "name": "Ecom Express", "icon": "🛒"},
    {"code": "ekart", "name": "Ekart Logistics", "icon": "🎯"}
  ]
}
```

#### Track Consignment
```http
GET /api/track/{tracking_number}?carrier={carrier_code}
```

**Parameters:**
- `tracking_number` (required) - The tracking/consignment number
- `carrier` (optional, default: india-post) - Carrier code from supported carriers

**Response (with Phase 2 features):**
```json
{
  "tracking_number": "RM123456789IN",
  "carrier": "India Post",
  "status": "In Transit",
  "origin": "Mumbai, Maharashtra",
  "destination": "Delhi, NCR",
  "last_updated": "2026-01-25T15:45:00Z",
  "events": [
    {
      "location": "New Delhi GPO",
      "status": "Out for delivery",
      "timestamp": "2026-01-28T08:00:00Z"
    }
  ],
  "delay_info": {
    "status": "delayed",
    "severity": "moderate",
    "message": "Package hasn't been updated in 3 days",
    "hours_since_update": 78
  },
  "smart_summary": "Your parcel hasn't been updated in 3 days. There might be a slight delay in transit. The package was last seen at Delhi Sorting Center."
}
```

#### Demo Endpoint
```http
GET /api/track/DEMO
```
Returns mock data with all Phase 2 features for testing.

---

## 🎨 Color Palette

| Purpose | Color | Hex Code |
|---------|-------|----------|
| Primary (India Post Red) | 🔴 | `#C62828` |
| Background | ⬜ | `#F5F5F5` |
| Text | ⬛ | `#1E1E1E` |
| Delivered Status | 🟢 | `#2E7D32` |
| In Transit Status | 🟡 | `#F9A825` |
| Exception Status | 🔴 | `#D32F2F` |

---

## 🧪 Testing

### Test the Backend API

```bash
# Test health check
curl http://localhost:8000/

# Test tracking endpoint
curl http://localhost:8000/api/track/RM123456789IN
```

### Test the Frontend
Health check
curl http://localhost:8000/

# Get supported carriers
curl http://localhost:8000/api/carriers

# Track with India Post (default)
curl http://localhost:8000/api/track/RM123456789IN

# Track with specific carrier
curl http://localhost:8000/api/track/TRACKINGNUM?carrier=delhivery

# Demo endpoint with Phase 2 features
curl http://localhost:8000/api/track/DEMO
```

### Test the Frontend

1. Open `http://localhost:5173` in your browser
2. Select a carrier from the dropdown
3. Enter tracking number or use **`DEMO`** to see all features
4. Test dark mode toggle, recent searches, and refresh functionality
DEBUG=False
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
## 🗺️ Roadmap

- [ ] Add more Indian carriers (Shadowfax, Professional Couriers)
- [ ] Implement notifications/alerts for tracking updates
- [ ] Add bulk tracking for multiple parcels
- [ ] Integrate SMS/Email notifications
- [ ] Create mobile apps (React Native)
- [ ] Add analytics dashboard
- [ ] Support international carriers

---

## 🙏 Acknowledgments

- **TrackingMore** for providing the comprehensive tracking API
- **India Post** and all supported carriers for their services
- **Material UI** for the beautiful component library
- **Framer Motion** for smooth animations
- The open-source community for amazing tools

---

## 📧 Contact

For questions, suggestions, or support:
- 📝 Open an issue on [GitHub](https://github.com/yourusername/dakdash/issues)
- 💬 Start a discussion in the repository

---

## ⭐ Show Your Support

If DakDash helped you track your parcels hassle-free, please give it a ⭐ on GitHub!

---

**Built with ❤️ to solve real tracking problems in India**

![Made with React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)
![Made with FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat&logo=fastapi)
![Made with Material UI](https://img.shields.io/badge/Material%20UI-5.15-007FFF?style=flat&logo=mui)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for seamless India Post tracking**

![Made with React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)
![Made with FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat&logo=fastapi)
![Made with Material UI](https://img.shields.io/badge/Material%20UI-5.15-007FFF?style=flat&logo=mui)
