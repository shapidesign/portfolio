#!/bin/bash

echo "=== Fixing Mobile Camera Reset Issue ==="
echo "1. Enhanced closeProjectModal with multiple reset attempts"
echo "2. Removed camera reset from openProjectModal (wrong timing)"
echo "3. Added 3-stage reset: immediate, 100ms, 300ms, 600ms delays"
echo "4. Each reset includes: controls.reset() + manual positioning"
echo "5. Ensures camera ALWAYS returns to wide solar system view"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing enhanced mobile camera reset..."
git commit -m "Fix mobile camera reset: enhanced closeProjectModal with multiple reset attempts"

echo "Pushing to GitHub..."
git push origin main

echo "=== Mobile camera reset fix pushed successfully! ==="
echo "Camera now consistently resets to wide solar system view after leaving project modals."
