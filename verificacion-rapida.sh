#!/bin/bash

# Script simple de verificación rápida
echo "🔍 VERIFICACIÓN RÁPIDA DEL BOT"
echo "=============================="

# Verificar Discord bot
echo "🤖 Probando Discord Bot..."
DISCORD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://discord.com/api/v10/applications/@me" \
  -H "Authorization: Bot MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ")

if [ "$DISCORD_STATUS" = "200" ]; then
    echo "✅ Discord Bot: Accesible (Código: $DISCORD_STATUS)"
else
    echo "❌ Discord Bot: Error (Código: $DISCORD_STATUS)"
fi

# Verificar Railway API
echo ""
echo "🌐 Probando Railway API..."
RAILWAY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://railway.app/api/v2/projects/striking-transformation" \
  -H "Authorization: Bearer 09f803fc-8522-4bff-bb40-b5a3682f1448")

if [ "$RAILWAY_STATUS" = "200" ]; then
    echo "✅ Railway API: Accesible (Código: $RAILWAY_STATUS)"
else
    echo "❌ Railway API: Error (Código: $RAILWAY_STATUS)"
fi

echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Revisar deploy: https://railway.app/project/striking-transformation/deploy"
echo "2. Revisar logs: https://railway.app/project/striking-transformation/logs" 
echo "3. Verificar bot online: https://discord.com/developers/applications"
echo ""
echo "🎯 El bot debería estar online en 2-3 minutos después de configurar las variables"