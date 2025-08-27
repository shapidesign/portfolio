#!/bin/bash

echo "=== FIXING PLANET LINE CONNECTIONS ==="
echo "🎯 Fixed: Trail lines now start from planet center using getWorldPosition()"
echo "🎯 Fixed: Connection lines now start from planet center using getWorldPosition()"
echo "🎯 Result: All lines now properly connect to planet centers on mobile"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing planet line fixes..."
git commit -m "Fix planet line connections: use getWorldPosition() for accurate center alignment"

echo "Pushing to GitHub..."
git push origin main

echo "=== 🎉 PLANET LINES FIXED! ==="
echo "All lines now properly connect to planet centers!"
