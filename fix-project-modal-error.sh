#!/bin/bash

echo "=== FIXING PROJECT MODAL ERROR ==="
echo "🎯 Fixed: Removed galleryCounter references that were causing null errors"
echo "🎯 Fixed: Cleaned up openProjectModal and closeProjectModal functions"
echo "🎯 Result: Project modals should now open without errors"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing project modal error fix..."
git commit -m "Fix project modal error: remove galleryCounter references causing null errors"

echo "Pushing to GitHub..."
git push origin main

echo "=== 🎉 PROJECT MODAL ERROR FIXED! ==="
echo "Project modals should now work properly!"
