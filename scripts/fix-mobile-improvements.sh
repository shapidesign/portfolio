#!/bin/bash

echo "=== Mobile Improvements Applied ==="
echo "1. Added chaos mode instruction to creative universe section"
echo "2. Removed spaceship mouse cursor on mobile (touch gestures only)"
echo "3. Fixed camera reset after exploring projects on mobile"
echo "4. Decreased project description text size (0.7rem)"
echo "5. Decreased about modal size and added proper padding"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing mobile improvements..."
git commit -m "Mobile improvements: chaos mode instruction, remove cursor, fix camera reset, optimize modals"

echo "Pushing to GitHub..."
git push origin main

echo "=== Mobile improvements pushed successfully! ==="
echo "Mobile experience now optimized with touch-only gestures and better modals."
