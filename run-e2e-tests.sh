#!/bin/bash

echo "🧪 Form Builder E2E Test Runner"
echo "================================"

# Check if servers are running
BACKEND_READY=false
FRONTEND_READY=false

if curl -s http://localhost:8080/api/forms/ > /dev/null 2>&1; then
    echo "✅ Backend detected on port 8080"
    BACKEND_READY=true
else
    echo "❌ Backend not detected on port 8080"
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend detected on port 3000"
    FRONTEND_READY=true
else
    echo "❌ Frontend not detected on port 3000"
fi

# Start servers if needed
if [ "$BACKEND_READY" = false ] || [ "$FRONTEND_READY" = false ]; then
    echo ""
    echo "🚀 Starting servers..."
    ./start-servers.sh
    echo ""
fi

echo "🎯 Running E2E Tests..."
echo ""

# Run API tests first (they're fast and always work)
echo "1️⃣ API E2E Tests (Backend):"
cd frontend
npx cypress run --spec "cypress/e2e/api.cy.js" --config baseUrl=http://localhost:8080

API_EXIT_CODE=$?
if [ $API_EXIT_CODE -eq 0 ]; then
    echo "✅ API tests passed!"
else
    echo "❌ API tests failed!"
fi

echo ""
echo "2️⃣ Dual Add Buttons Tests (Frontend):"
npx cypress run --spec "cypress/e2e/dual-add-buttons.cy.js" --config baseUrl=http://localhost:3000

DUAL_EXIT_CODE=$?
if [ $DUAL_EXIT_CODE -eq 0 ]; then
    echo "✅ Dual add buttons tests passed!"
else
    echo "❌ Dual add buttons tests failed!"
fi

echo ""
echo "3️⃣ Full UI E2E Tests (Frontend):"
npx cypress run --spec "cypress/e2e/form-builder.cy.js" --config baseUrl=http://localhost:3000

UI_EXIT_CODE=$?
if [ $UI_EXIT_CODE -eq 0 ]; then
    echo "✅ UI tests passed!"
else
    echo "❌ UI tests failed!"
fi

cd ..

echo ""
echo "📊 Test Results Summary:"
echo "========================"
[ $API_EXIT_CODE -eq 0 ] && echo "✅ API Tests: PASSED (31/31)" || echo "❌ API Tests: FAILED"
[ $DUAL_EXIT_CODE -eq 0 ] && echo "✅ Dual Buttons: PASSED (14/14)" || echo "❌ Dual Buttons: FAILED"  
[ $UI_EXIT_CODE -eq 0 ] && echo "✅ UI Tests: PASSED (79+/79+)" || echo "❌ UI Tests: FAILED"

# Calculate overall score
TOTAL_PASSED=0
[ $API_EXIT_CODE -eq 0 ] && TOTAL_PASSED=$((TOTAL_PASSED + 31))
[ $DUAL_EXIT_CODE -eq 0 ] && TOTAL_PASSED=$((TOTAL_PASSED + 14))
[ $UI_EXIT_CODE -eq 0 ] && TOTAL_PASSED=$((TOTAL_PASSED + 79))

echo ""
echo "🎯 Overall Score: ${TOTAL_PASSED}/124+ tests passing"

if [ $API_EXIT_CODE -eq 0 ] && [ $DUAL_EXIT_CODE -eq 0 ] && [ $UI_EXIT_CODE -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED! Project is ready for deployment!"
    exit 0
else
    echo "⚠️  Some tests failed. Check the output above for details."
    exit 1
fi 