#!/bin/bash

echo "=== EMAIL FORM MODAL CREATED ==="
echo "🎯 1. Created professional contact form modal"
echo "🎯 2. Added form fields: Full Name, Email, Company, Message"
echo "🎯 3. Styled with monokai theme and responsive design"
echo "🎯 4. Form submission opens email client with pre-filled data"
echo "🎯 5. Added success animation and form reset"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing email form modal..."
git commit -m "Add professional email form modal: clean contact form with pre-filled email submission"

echo "Pushing to GitHub..."
git push origin main

echo "=== 🎉 EMAIL FORM MODAL READY! ==="
echo "Users can now send messages through a clean form interface!"
