#!/bin/bash

echo "🚀 Starting StudyServe..."

# MongoDB path
MONGO_PATH="/Users/jhanak/mongodb-macos-aarch64--8.2.3/bin/mongod"

# Check if MongoDB exists
if [ ! -f "$MONGO_PATH" ]; then
    echo "❌ MongoDB not found!"
    echo ""
    echo "Please install MongoDB:"
    echo "1. Visit: https://www.mongodb.com/try/download/community"
    echo "2. Download MongoDB Community Server for macOS"
    echo "3. Or use Homebrew: brew install mongodb-community"
    echo ""
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p ~/data/db

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "📦 Starting MongoDB..."
    $MONGO_PATH --dbpath ~/data/db > /dev/null 2>&1 &
    sleep 2
    echo "✅ MongoDB started"
else
    echo "✅ MongoDB already running"
fi

# Start backend
echo "🔧 Starting backend..."
cd backend
npm start > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..

sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ StudyServe is running!"
echo "📱 Frontend: http://localhost:5173"
echo "⚙️  Backend:  http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
