#!/bin/bash

echo "🚀 Starting Form Builder servers in parallel..."

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "spring-boot" 2>/dev/null
pkill -f "react-scripts" 2>/dev/null  
pkill -f "npm start" 2>/dev/null
sleep 2

# Create log directory
mkdir -p logs

# Start backend in background
echo "🔧 Starting Spring Boot backend (port 8080)..."
cd backend
nohup ./mvnw spring-boot:run > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# Start frontend in background  
echo "⚛️ Starting React frontend (port 3000)..."
cd frontend
nohup npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

# Save PIDs for later reference
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

echo "📊 Monitoring server startup..."

# Monitor backend startup
echo "⏳ Waiting for backend..."
for i in {1..30}; do
    if curl -s http://localhost:8080/api/forms/ > /dev/null 2>&1; then
        echo "✅ Backend ready! (${i}s)"
        break
    fi
    echo "   Backend starting... (${i}s)"
    sleep 1
done

# Monitor frontend startup
echo "⏳ Waiting for frontend..."
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend ready! (${i}s)"
        break
    fi
    echo "   Frontend starting... (${i}s)"
    sleep 1
done

# Final status check
echo ""
echo "🎯 Server Status:"
if curl -s http://localhost:8080/api/forms/ > /dev/null 2>&1; then
    echo "✅ Backend: http://localhost:8080 (Ready)"
else
    echo "❌ Backend: Not responding"
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: http://localhost:3000 (Ready)"
else
    echo "❌ Frontend: Not responding"
fi

echo ""
echo "📄 Log files:"
echo "   Backend: logs/backend.log"
echo "   Frontend: logs/frontend.log"
echo ""
echo "🔧 To stop servers: ./stop-servers.sh"
echo "🧪 To run tests: npm run test:e2e" 