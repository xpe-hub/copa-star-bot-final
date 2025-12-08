#!/bin/bash

# 🚀 Copa Star Bot - Deploy Automático en Railway
# Ejecuta este script para deploy automático completo

set -e

echo "🚀 Copa Star Bot - Deploy Railway.app"
echo "=================================="

# Verificar si Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no encontrado. Instalando..."
    npm install -g @railway/cli
fi

# Configurar variables
REPO_URL="https://github.com/xpe-hub/copa-star-bot-v3-clean"
DISCORD_TOKEN="MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"

echo "🔧 Configurando proyecto..."

# 1. Crear proyecto nuevo
echo "1️⃣ Creando proyecto Railway..."
railway login
railway link || railway init

# 2. Configurar variables de entorno
echo "2️⃣ Configurando variables de entorno..."
railway variables set DISCORD_TOKEN="$DISCORD_TOKEN"
railway variables set NODE_ENV=production
railway variables set PORT=3000

# 3. Conectar GitHub (si no está conectado)
echo "3️⃣ Conectando repositorio GitHub..."
railway github link "$REPO_URL" --create || echo "Repositorio ya conectado"

# 4. Configurar build command
echo "4️⃣ Configurando build..."
railway build cmd="npm install && npm start" || echo "Build ya configurado"

# 5. Deploy
echo "5️⃣ Ejecutando deploy..."
railway up

echo "✅ Deploy completado!"
echo "🎯 Bot estará online en unos minutos"
echo "📊 Monitoreo: railway.app/dashboard"