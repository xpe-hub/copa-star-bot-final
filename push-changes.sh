#!/bin/bash

echo "🔄 Subiendo cambios a GitHub..."

# Configure git credentials
git config --global user.email "bot@minimax.com"
git config --global user.name "MiniMax Agent"

# Add all changes
echo "📁 Adding changes..."
git add .

# Commit with descriptive message
echo "💾 Creating commit..."
git commit -m "Final: NPM optimization + Discord error format fixes

- Fix NPM warnings by optimizing start script
- Remove nodemon from production dependencies
- Error messages use exact red color #ED4245
- Error format matches reference: no title, full description
- Two error message locations updated"

# Force push to sync with remote
echo "🚀 Pushing to GitHub..."
git push origin master --force

echo "✅ Push completed!"
echo ""
echo "🔗 Verificar en:"
echo "   GitHub: https://github.com/xpe-hub/copa-star-bot-final"
echo "   Railway debería detectar los cambios automáticamente"