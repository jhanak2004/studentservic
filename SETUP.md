# 🚀 StudyServe Setup Guide

## Prerequisites

### 1. **Node.js** (Required)
- **Check if installed:** `node --version`
- **Download:** https://nodejs.org (v16 or higher)

### 2. **MongoDB** (Required)

#### Option A: Already Installed ✅
You have MongoDB installed at: `/Users/jhanak/mongodb-macos-aarch64--8.2.3/`

#### Option B: Install via Homebrew (Recommended)
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### Option C: Manual Download
1. Visit: https://www.mongodb.com/try/download/community
2. Select: macOS / ARM64 (M1/M2) or x64 (Intel)
3. Download and extract to your preferred location
4. Update `start.sh` with the correct path

## Quick Start

### First Time Setup (One-time only)
```bash
cd /Users/jhanak/Downloads/studyserve

# Install all dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Running the App

#### Simple Way (Recommended):
```bash
./start.sh
```

#### Alternative (Root package.json):
```bash
npm run dev
```

#### Manual Way:
```bash
# Terminal 1: MongoDB
mongod --dbpath ~/data/db

# Terminal 2: Backend
cd backend && npm start

# Terminal 3: Frontend
cd frontend && npm run dev
```

## Access the App

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001
- **MongoDB:** localhost:27017

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Error
- Make sure MongoDB is running: `ps aux | grep mongod`
- Check data directory exists: `mkdir -p ~/data/db`
- Verify connection string in `backend/.env`

### Dependencies Not Found
```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# Reinstall
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```
