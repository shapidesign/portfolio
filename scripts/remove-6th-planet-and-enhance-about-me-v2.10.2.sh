#!/bin/bash

echo "=== Remove 6th Planet & Enhance About Me v2.10.2 ==="
echo "Removing 6th planet and adding professional skills section..."
echo ""

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Current directory: $(pwd)"

# Check git status
echo "Checking git status..."
git status

# Add all changes
echo "Adding all changes..."
git add .

# Commit changes with detailed message
echo "Committing 6th planet removal and about me enhancement..."
git commit -m "Remove 6th Planet & Enhance About Me v2.10.2

- REMOVED: 6th planet (Motion Graphics Exploration) from mission control
- ENHANCED: About Me section with professional skills and tools
- ADDED: 'What I Can Do For You' skills section
- ADDED: 'How I Do It (If It Matters)' tools section
- UPDATED: Version tag to v2.10.2

Planet Structure (Now 5 Planets):
1. Pink Planet - AFL Israel Designs
2. Blue Planet - The Bible: Remastered
3. Green Planet - Pixel Portrait Challenge
4. Orange Planet - Design as Social Commentary
5. Purple Planet - Vibe Coding!

About Me Enhancement:
- Added professional skills showcase
- Added tools and technologies section
- Enhanced visual presentation with styled tags
- Improved professional credibility

Skills Section - 'What I Can Do For You':
- Brand Identity Design
- Social Media Graphics
- Print Design
- Web Development
- UI/UX Design
- Motion Graphics
- Creative Direction
- Content Creation
- Interactive Design
- Typography

Tools Section - 'How I Do It (If It Matters)':
- Figma
- Adobe Creative Suite
- HTML5/CSS3/JavaScript
- Three.js
- Canvas API
- TouchDesigner
- Cavalry
- Git/GitHub
- Responsive Design
- Creative Coding

Visual Enhancements:
- Styled skill and tool tags
- Hover effects and animations
- Responsive design for mobile
- Professional color scheme
- Clean typography

Professional Benefits:
- Clear skills presentation
- Professional tools showcase
- Enhanced portfolio credibility
- Better client communication
- Industry-standard presentation

Ready for professional portfolio showcase!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== 6th Planet Removed & About Me Enhanced v2.10.2! ==="
echo "Changes include:"
echo "✅ Removed 6th planet from mission control"
echo "✅ Enhanced About Me with professional skills"
echo "✅ Added tools and technologies section"
echo "✅ Updated version to v2.10.2"
echo ""
echo "🌍 Planet Structure (5 Planets):"
echo "   - Pink: AFL Israel Designs"
echo "   - Blue: The Bible: Remastered"
echo "   - Green: Pixel Portrait Challenge"
echo "   - Orange: Design as Social Commentary"
echo "   - Purple: Vibe Coding!"
echo ""
echo "🎨 About Me Enhancements:"
echo "   - Professional skills showcase"
echo "   - Tools and technologies section"
echo "   - Styled interactive tags"
echo "   - Enhanced visual presentation"
echo ""
echo "🚀 Clean, professional portfolio ready!"
