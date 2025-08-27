#!/bin/bash

echo "=== Fixing Camera Reset Issue ==="
echo "1. Added camera reset to openProjectModal function"
echo "2. Camera now resets after opening ANY project (mission control or clicking)"
echo "3. Added 200ms delay for reliable reset timing"
echo "4. Enhanced logging for debugging"
echo "5. Ensures consistent camera behavior on mobile"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing camera reset fix..."
git commit -m "Fix camera reset: ensure camera resets after opening any project modal"

echo "Pushing to GitHub..."
git push origin main

echo "=== Camera reset fix pushed successfully! ==="
echo "Camera now consistently resets after visiting any project planet."
