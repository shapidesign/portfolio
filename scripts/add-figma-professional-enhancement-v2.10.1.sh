#!/bin/bash

echo "=== Add Figma Professional Enhancement v2.10.1 ==="
echo "Adding Figma prototyping and design to all project descriptions..."
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
echo "Committing Figma professional enhancement..."
git commit -m "Add Figma Professional Enhancement v2.10.1

- ENHANCED: All project descriptions with Figma prototyping
- ADDED: Professional design workflow references
- IMPROVED: Portfolio credibility and expertise
- UPDATED: Version tag to v2.10.1

Project 1: AFL Israel Designs (Pink Planet)
- Added: 'All designs were prototyped and refined in Figma before final production'
- Added: 'Figma Prototyping' tag
- Enhanced: Professional quality and brand consistency emphasis

Project 2: The Bible: Remastered (Blue Planet)
- Added: 'Each design was carefully prototyped in Figma, exploring different visual approaches'
- Added: 'Figma Design' tag
- Enhanced: Detail and craftsmanship emphasis

Project 3: Pixel Portrait Challenge (Green Planet)
- Added: 'The pixel art style was developed through iterative prototyping in Figma'
- Added: 'Figma Prototyping' tag
- Enhanced: Consistent visual quality emphasis

Project 4: Design as Social Commentary (Orange Planet)
- Added: 'All concepts were developed and refined through Figma prototyping'
- Added: 'Figma Design' tag
- Enhanced: Precise control over visual elements and typography

Project 5: Vibe Coding! (Purple Planet)
- Added: 'User interfaces and interactions were prototyped in Figma before development'
- Added: 'Figma Prototyping' tag
- Enhanced: Intuitive user experiences and polished final products

Professional Benefits:
- Demonstrates industry-standard design workflow
- Shows attention to detail and quality control
- Highlights professional design methodology
- Enhances portfolio credibility
- Positions as design-conscious developer

Technical Skills Showcased:
- Figma prototyping and design
- Iterative design process
- User experience design
- Visual design refinement
- Professional design workflow

Ready for professional portfolio presentation!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Figma Professional Enhancement Complete v2.10.1! ==="
echo "Changes include:"
echo "✅ Added Figma prototyping to all project descriptions"
echo "✅ Enhanced professional credibility"
echo "✅ Improved portfolio expertise positioning"
echo "✅ Updated version to v2.10.1"
echo ""
echo "🎨 Professional Enhancements:"
echo "   - Industry-standard design workflow"
echo "   - Attention to detail and quality control"
echo "   - Professional design methodology"
echo "   - Enhanced portfolio credibility"
echo ""
echo "📋 Updated Projects:"
echo "   - Project 1: AFL Israel Designs + Figma Prototyping"
echo "   - Project 2: The Bible: Remastered + Figma Design"
echo "   - Project 3: Pixel Portrait Challenge + Figma Prototyping"
echo "   - Project 4: Social Commentary + Figma Design"
echo "   - Project 5: Vibe Coding! + Figma Prototyping"
echo ""
echo "🚀 Professional portfolio now ready!"
