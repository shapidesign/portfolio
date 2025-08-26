#!/bin/bash

echo "=== PROJECT MODAL FINAL IMPROVEMENTS ==="
echo "🎯 1. Fixed image border to fit content (width: fit-content)"
echo "🎯 2. Fixed mouse cursor visibility in project modal"
echo "🎯 3. Made escape X button match project color"
echo "🎯 4. Updated email form to send directly (with notifications)"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing project modal final improvements..."
git commit -m "Project modal improvements: fixed image borders, cursor, close button colors, direct email sending"

echo "Pushing to GitHub..."
git push origin main

echo "=== 🎉 PROJECT MODAL IMPROVEMENTS COMPLETE! ==="
echo "All visual and functional improvements applied!"
