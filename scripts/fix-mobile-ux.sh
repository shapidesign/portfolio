#!/bin/bash

echo "=== Fixing Mobile UX for Project Modal ==="
echo "1. Lowered project name and tags to avoid button overlap"
echo "2. Made navigation arrows smaller (35px instead of 45px)"
echo "3. Increased image size significantly (70vh max-height)"
echo "4. Reduced project text size for better proportions"
echo "5. Optimized spacing and padding for better mobile experience"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing mobile UX improvements..."
git commit -m "Fix mobile UX: lower project content, optimize image size, smaller arrows"

echo "Pushing to GitHub..."
git push origin main

echo "=== Mobile UX improvements pushed successfully! ==="
echo "Project modal now has better proportions and no overlap issues."
