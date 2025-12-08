#!/bin/bash

# Script para verificar el estado del deploy en Railway
TOKEN="09f803fc-8522-4bff-bb40-b5a3682f1448"
PROJECT_NAME="striking-transformation"

echo "🔍 VERIFICANDO ESTADO DEL DEPLOY EN RAILWAY..."
echo "=================================================="

# Función para hacer llamadas a la API de Railway
railway_api_call() {
    local endpoint=$1
    curl -s -X GET "https://railway.app/api/v2${endpoint}" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -w "HTTP_CODE:%{http_code}\n"
}

echo "📋 1. Obteniendo información del proyecto..."
PROJECT_RESPONSE=$(railway_api_call "/projects/$PROJECT_NAME")
echo "Respuesta del proyecto:"
echo "$PROJECT_RESPONSE" | head -20

echo ""
echo "🔍 2. Verificando estado de deploy..."
DEPLOY_RESPONSE=$(railway_api_call "/projects/$PROJECT_NAME/deployments?limit=5")
echo "Estado de deploys recientes:"
echo "$DEPLOY_RESPONSE" | head -30

echo ""
echo "📊 3. Obteniendo logs del deploy más reciente..."
# Primero obtenemos el ID del deploy más reciente
DEPLOY_ID=$(echo "$DEPLOY_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ ! -z "$DEPLOY_ID" ]; then
    echo "Deploy ID encontrado: $DEPLOY_ID"
    LOGS_RESPONSE=$(railway_api_call "/projects/$PROJECT_NAME/deployments/$DEPLOY_ID/logs")
    echo "Logs del deploy:"
    echo "$LOGS_RESPONSE" | tail -50
else
    echo "❌ No se pudo obtener ID del deploy"
fi

echo ""
echo "🌐 4. Verificando servicios y variables de entorno..."
SERVICE_RESPONSE=$(railway_api_call "/projects/$PROJECT_NAME/services")
echo "Estado de servicios:"
echo "$SERVICE_RESPONSE" | head -20

echo ""
echo "✅ 5. Verificando estado del bot en Discord..."
# Verificar si el bot responde
curl -s "https://discord.com/api/v10/applications/@me" \
    -H "Authorization: Bot MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ" \
    -w "DISCORD_API_CODE:%{http_code}\n" | head -10

echo ""
echo "🎯 RESUMEN DEL ESTADO:"
echo "====================="
echo "✅ Variables de entorno: Configuradas por el usuario"
echo "🔍 API Railway: $(echo "$PROJECT_RESPONSE" | grep -q "200\|201" && echo "Accesible" || echo "Error de acceso")"
echo "📊 Deploy status: Verificando logs arriba"
echo "🤖 Bot Discord: Verificando arriba"
echo ""
echo "💡 Si todo está bien, el bot debería estar online en Discord"