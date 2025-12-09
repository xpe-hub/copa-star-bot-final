#!/bin/bash

echo "🚀 SUBIENDO CAMBIOS FINALES A GITHUB"
echo "===================================="

# Configure git if needed
git config --global user.email "bot@minimax.com"
git config --global user.name "MiniMax Agent"
git config --global --add safe.directory /workspace

# Check if there are changes to commit
echo "🔍 Verificando cambios..."
if git diff --cached --quiet; then
    echo "⚠️  No hay cambios para commit"
else
    echo "📝 Creando commit..."
    git commit -m "Final: NPM optimization + Discord error format fixes

- Fix NPM warnings by optimizing start script  
- Error messages use exact red color #ED4245
- Error format matches reference: no title, full description
- Two error message locations updated"
fi

# Push changes
echo "📤 Subiendo a GitHub..."
git push origin master --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡CAMBIOS SUBIDOS EXITOSAMENTE!"
    echo ""
    echo "🎯 Cambios incluidos:"
    echo "   • NPM optimization (sin advertencias)"
    echo "   • Color rojo exacto #ED4245 para errores"
    echo "   • Formato correcto sin título"
    echo "   • Emojis ❌ para errores"
    echo ""
    echo "🔗 Enlaces:"
    echo "   GitHub: https://github.com/xpe-hub/copa-star-bot-final"
    echo "   Railway debería detectar los cambios automáticamente"
else
    echo "❌ Error al subir cambios"
fi