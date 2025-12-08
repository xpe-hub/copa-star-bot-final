#!/bin/bash

echo "🚀 CREANDO REPOSITORIO COMPLETO PARA RAILWAY"
echo "============================================"

# Crear directorio para el nuevo repositorio
mkdir -p /workspace/nuevo-repositorio

# Copiar bot.js
cp /workspace/bot-completo.js /workspace/nuevo-repositorio/bot.js

# Copiar package.json
cp /workspace/package.json /workspace/nuevo-repositorio/package.json

# Crear .gitignore
cat > /workspace/nuevo-repositorio/.gitignore << 'EOF'
node_modules/
.env
npm-debug.log*
.DS_Store
tmp/
logs/
*.log
.cache/
.vscode/
EOF

# Crear README.md
cat > /workspace/nuevo-repositorio/README.md << 'EOF'
# 🎮 Copa Star Bot

Bot de Discord para Copa Star - Sistema de filas automático

## Funciones
- Sistema de colas 1v1, 2v2, 3v3, 4v4, 5v5
- Comandos con botones interactivos
- Interfaz en portugués
- Colores verde neón (#00FF00)

## Comandos
- `!entrar1v1` - Entrar a fila 1v1
- `!entrar2v2` - Entrar a fila 2v2
- `!entrar3v3` - Entrar a fila 3v3
- `!entrar4v4` - Entrar a fila 4v4
- `!entrar5v5` - Entrar a fila 5v5
- `!sair` - Salir de la fila
- `!fila` - Ver estado de las colas

## Desplegado en Railway
Este bot está desplegado en Railway.app para disponibilidad 24/7.
EOF

echo "✅ Repositorio creado en: /workspace/nuevo-repositorio/"
echo ""
echo "📁 ARCHIVOS LISTOS:"
ls -la /workspace/nuevo-repositorio/
echo ""
echo "🎯 PRÓXIMOS PASOS:"
echo "1. Crear repositorio nuevo en GitHub: 'copa-star-bot-railway'"
echo "2. Subir estos 4 archivos:"
echo "   - bot.js"
echo "   - package.json" 
echo "   - .gitignore"
echo "   - README.md"
echo "3. Conectar en Railway"
echo "4. Deploy automático en 2 minutos"

# Mostrar contenido de cada archivo
echo ""
echo "📋 CONTENIDO DE LOS ARCHIVOS:"
echo ""
echo "=== bot.js ==="
head -10 /workspace/nuevo-repositorio/bot.js
echo ""
echo "=== package.json ==="
cat /workspace/nuevo-repositorio/package.json
echo ""
echo "=== .gitignore ==="
cat /workspace/nuevo-repositorio/.gitignore