# DakDash Deployment Guide

## Backend Deployment (Render)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Render**:
   - Go to https://render.com and sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `dakdash-api`
     - Runtime: `Python 3`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add Environment Variable:
     - Key: `TRACKINGMORE_API_KEY`
     - Value: `za7tfa5p-fw48-s56d-ejfl-r3yae544b09a`
   - Click "Create Web Service"
   - Copy your backend URL (e.g., `https://dakdash-api.onrender.com`)

## Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com and sign up/login
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: `Vite`
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variable:
     - Key: `VITE_API_URL`
     - Value: `https://dakdash-api.onrender.com` (your Render backend URL)
   - Click "Deploy"

3. **Update vercel.json** (after getting backend URL):
   - Edit `frontend/vercel.json`
   - Replace `your-backend-url.onrender.com` with actual URL

## Alternative: Deploy Both with One Click

### Using Railway (Simpler):
1. Go to https://railway.app
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect both frontend and backend
5. Add environment variables in Railway dashboard

## Post-Deployment

1. Update CORS origins in `backend/config.py` with your Vercel URL
2. Test all features:
   - Tracking with different carriers
   - Dark mode toggle
   - Recent searches
   - Delay detection
   - Smart summary

## Custom Domain (Optional)

- **Vercel**: Add custom domain in project settings
- **Render**: Add custom domain in service settings
