#!/bin/bash
# Script to push Gantt Chart App to GitHub

echo "🚀 Pushing Gantt Chart App to GitHub..."
echo ""
echo "Please provide your GitHub username:"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required!"
    exit 1
fi

echo ""
echo "Repository name (default: gantt-chart-app):"
read REPO_NAME
REPO_NAME=${REPO_NAME:-gantt-chart-app}

echo ""
echo "📝 Step 1: Create the repository on GitHub first!"
echo "   Go to: https://github.com/new"
echo "   Repository name: $REPO_NAME"
echo "   Description: Modern interactive Gantt chart application"
echo "   Choose Private or Public"
echo "   DO NOT initialize with README, .gitignore, or license"
echo ""
echo "Press Enter after you've created the repository on GitHub..."
read

echo ""
echo "🔗 Adding remote origin..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git 2>/dev/null || git remote set-url origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 View your repo at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   1. Repository exists on GitHub"
    echo "   2. You have access to push"
    echo "   3. Your GitHub credentials are set up"
fi
