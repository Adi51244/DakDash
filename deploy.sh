#!/bin/bash

# DakDash Deployment Script
# This script helps you deploy both backend and frontend

echo "🚀 DakDash Deployment Helper"
echo "=============================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - DakDash v1.0"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Deployment Steps:"
echo ""
echo "1️⃣  BACKEND DEPLOYMENT (Render)"
echo "   • Go to: https://render.com"
echo "   • Click: New + → Web Service"
echo "   • Connect your GitHub repo"
echo "   • Settings:"
echo "     - Name: dakdash-api"
echo "     - Runtime: Python 3"
echo "     - Root Directory: backend"
echo "     - Build: pip install -r requirements.txt"
echo "     - Start: uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo "   • Add Environment Variable:"
echo "     - TRACKINGMORE_API_KEY = za7tfa5p-fw48-s56d-ejfl-r3yae544b09a"
echo ""
echo "2️⃣  FRONTEND DEPLOYMENT (Vercel)"
echo "   • Go to: https://vercel.com"
echo "   • Click: Add New... → Project"
echo "   • Import your GitHub repo"
echo "   • Settings:"
echo "     - Framework: Vite"
echo "     - Root Directory: frontend"
echo "     - Build: npm run build"
echo "     - Output: dist"
echo "   • Add Environment Variable:"
echo "     - VITE_API_URL = [YOUR_RENDER_BACKEND_URL]"
echo ""
echo "3️⃣  POST-DEPLOYMENT"
echo "   • Update frontend/vercel.json with backend URL"
echo "   • Update backend/config.py CORS_ORIGINS with Vercel URL"
echo "   • Test all features!"
echo ""
echo "📚 Full guide: See DEPLOYMENT.md"
echo ""
