#!/bin/bash

echo "=== PROJECT MODAL FINAL FIX ==="
echo "🎯 1. Removed page counter from project modal (no longer needed)"
echo "🎯 2. Fixed image border to be relative to image size"
echo "🎯 3. Fixed phone icon disappearing after visiting planets"
echo "🎯 4. Ensured project modal always opens on top (z-index: 10000)"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing project modal final fixes..."
git commit -m "Project modal final fixes: removed counter, fixed borders, phone visibility, z-index"

echo "Pushing to GitHub..."
git push origin main

echo "=== 🎉 PROJECT MODAL FINAL FIXES COMPLETE! ==="
echo "All project modal issues resolved!"
