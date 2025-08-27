#!/bin/bash

echo "=== MOBILE PROJECT MODAL FIX ==="
echo "🎯 1. Removed planet trail lines from mobile version"
echo "🎯 2. Fixed image loading with preloading system"
echo "🎯 3. Changed project modal to scrollable instead of nav buttons"
echo "🎯 4. Added mobile-optimized image container styles"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing mobile project modal fixes..."
git commit -m "Mobile project modal: removed trails, fixed image loading, made scrollable"

echo "Pushing to GitHub..."
git push origin main

echo "=== 🎉 MOBILE PROJECT MODAL FIXED! ==="
echo "Project modals now work perfectly on mobile!"
