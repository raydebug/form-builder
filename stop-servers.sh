#!/bin/bash

echo "🛑 Stopping Form Builder servers..."

# Stop by PID if available
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    echo "🔧 Stopping backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null
    rm logs/backend.pid
fi

if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    echo "⚛️ Stopping frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null
    rm logs/frontend.pid
fi

# Force kill any remaining processes
echo "🧹 Cleaning up any remaining processes..."
pkill -f "spring-boot" 2>/dev/null
pkill -f "react-scripts" 2>/dev/null
pkill -f "npm start" 2>/dev/null

# Kill processes on ports
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

echo "✅ All servers stopped!" 