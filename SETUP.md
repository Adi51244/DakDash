# 🚀 Quick Start Guide - DakDash

## Step-by-Step Setup Instructions

### 1️⃣ Get Your TrackingMore API Key

1. Visit [TrackingMore.com](https://www.trackingmore.com/)
2. Sign up for a free account
3. Navigate to API section
4. Copy your API key

---

### 2️⃣ Backend Setup (5 minutes)

```bash
# Navigate to backend folder
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env

# Edit .env file and add your API key
# TRACKINGMORE_API_KEY=your_actual_key_here

# Run the server
python main.py
```

✅ Backend should be running at `http://localhost:8000`

Test it:
```bash
curl http://localhost:8000/
```

---

### 3️⃣ Frontend Setup (5 minutes)

Open a **NEW terminal** (keep backend running):

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (this may take a few minutes)
npm install

# Setup environment variables
cp .env.example .env

# Run the development server
npm run dev
```

✅ Frontend should be running at `http://localhost:3000`

Open your browser and visit: `http://localhost:3000`

---

### 4️⃣ Test the Application

1. Open `http://localhost:3000` in your browser
2. Click "Track Consignment"
3. Enter a tracking number (try: `RM123456789IN` or any India Post number)
4. View the beautiful tracking timeline! 🎉

---

## 🐛 Troubleshooting

### Backend Issues

**"Module not found"**
```bash
pip install -r requirements.txt
```

**"Port 8000 already in use"**
```bash
# Edit main.py and change port to 8001
uvicorn.run("main:app", host="0.0.0.0", port=8001)
```

### Frontend Issues

**"Command not found: npm"**
- Install Node.js from [nodejs.org](https://nodejs.org/)

**"Port 3000 already in use"**
- Vite will automatically use port 3001

**"Cannot connect to API"**
- Make sure backend is running on port 8000
- Check `.env` file has correct API URL

---

## 📁 Project Structure

```
Dakdash/
├── backend/          ← FastAPI backend
│   ├── main.py       ← API endpoints
│   └── .env          ← Your API key goes here
│
└── frontend/         ← React frontend
    ├── src/
    │   ├── pages/    ← Landing and Tracking pages
    │   └── components/ ← Reusable components
    └── .env          ← Backend URL
```

---

## 🔑 Important Files to Configure

1. **backend/.env**
   ```env
   TRACKINGMORE_API_KEY=your_key_here
   ```

2. **frontend/.env**
   ```env
   VITE_API_URL=http://localhost:8000
   ```

---

## ✅ Ready to Deploy?

See the main [README.md](README.md) for deployment instructions to:
- **Backend**: Render
- **Frontend**: Vercel

---

## 🆘 Need Help?

- Check API status: `http://localhost:8000/`
- Check frontend: `http://localhost:3000/`
- Review error messages in terminal
- Make sure both servers are running simultaneously

---

**Happy Tracking! 📦✨**
