#!/bin/bash
# Script to kill processes using port 5000

PORT=${1:-5000}
echo "🔍 Checking for processes using port $PORT..."

PIDS=$(lsof -ti:$PORT)

if [ -z "$PIDS" ]; then
    echo "✅ Port $PORT is free"
    exit 0
fi

echo "⚠️  Found processes using port $PORT: $PIDS"
echo "🛑 Killing processes..."

for PID in $PIDS; do
    kill -9 $PID 2>/dev/null && echo "   ✓ Killed process $PID" || echo "   ✗ Failed to kill process $PID"
done

sleep 1

# Verify
REMAINING=$(lsof -ti:$PORT)
if [ -z "$REMAINING" ]; then
    echo "✅ Port $PORT is now free"
else
    echo "❌ Some processes are still using port $PORT: $REMAINING"
    exit 1
fi

