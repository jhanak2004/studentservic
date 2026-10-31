#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    🎓 StudyServe - Quick Start${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# MongoDB path
MONGO_PATH="/Users/jhanak/mongodb-macos-aarch64--8.2.3/bin/mongod"

# Create data directory if it doesn't exist
mkdir -p ~/data/db

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    if [ ! -f "$MONGO_PATH" ]; then
        echo -e "${RED}❌ MongoDB not found!${NC}"
        echo -e "${YELLOW}Install MongoDB:${NC}"
        echo "   brew install mongodb-community"
        echo "   OR download from: https://www.mongodb.com/try/download/community"
        exit 1
    fi
    
    echo -e "${YELLOW}📦 Starting MongoDB...${NC}"
    $MONGO_PATH --dbpath ~/data/db > ~/data/db/mongod.log 2>&1 &
    sleep 2
    
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✅ MongoDB started${NC}"
    else
        echo -e "${RED}❌ Failed to start MongoDB${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ MongoDB already running${NC}"
fi

echo ""
echo -e "${YELLOW}🚀 Starting StudyServe servers...${NC}"
echo ""

# Start the servers using npm
npm start

# If npm start is interrupted, cleanup
echo ""
echo -e "${YELLOW}Stopping servers...${NC}"
