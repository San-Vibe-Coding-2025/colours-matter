#!/bin/bash
# Script to push Cividis Theme Engine to GitHub

echo "🎨 Pushing Cividis Theme Engine to GitHub..."
echo "Repository: https://github.com/San-Vibe-Coding-2025/colours-matter"
echo ""

# Check if we're in the right directory
if [ ! -f "viridis-theme.js" ]; then
    echo "❌ Error: Please run this script from the Viridis theme directory"
    exit 1
fi

echo "📋 Current files to be pushed:"
ls -la

echo ""
echo "🔧 Git status:"
git status

echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 View your repository: https://github.com/San-Vibe-Coding-2025/colours-matter"
else
    echo "❌ Push failed. Please check your GitHub authentication."
    echo ""
    echo "💡 To authenticate with GitHub:"
    echo "1. Generate a Personal Access Token: https://github.com/settings/tokens"
    echo "2. Use: git remote set-url origin https://YOUR_TOKEN@github.com/San-Vibe-Coding-2025/colours-matter.git"
    echo "3. Then run: git push -u origin main"
fi