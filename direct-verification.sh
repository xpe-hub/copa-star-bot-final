#!/bin/bash

# 🤖 Copa Star Bot - Verificación Directa y Configuración
# ======================================================

echo "🤖 Copa Star Bot - Verificación Directa"
echo "========================================"
echo ""

# Configurar token
export RAILWAY_TOKEN="09f803fc-8522-4bff-bb40-b5a3682f1448"
echo "🔑 Railway Token: ${RAILWAY_TOKEN:0:20}..."
echo ""

# Variables del bot
DISCORD_TOKEN="MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"

# Intentar obtener información del proyecto
echo "🔍 Verificando proyecto 'striking-transformation'..."
echo "   URL: https://railway.app/project/striking-transformation"
echo ""

# Verificar variables configuradas
echo "📋 Variables requeridas para el bot:"
echo "==================================="
echo ""
echo "🔹 DISCORD_TOKEN"
echo "   Key: DISCORD_TOKEN"
echo "   Value: $DISCORD_TOKEN"
echo ""
echo "🔹 NODE_ENV" 
echo "   Key: NODE_ENV"
echo "   Value: production"
echo ""
echo "🔹 PORT"
echo "   Key: PORT" 
echo "   Value: 3000"
echo ""

# Verificar estado del deploy
echo "🚀 Verificar Deploy:"
echo "===================="
echo ""
echo "1. Ve a: https://railway.app/project/striking-transformation/deploy"
echo "2. ¿Está el deploy completado? (✅ Deploy completed)"
echo "3. ¿Hay errores? Ve a: https://railway.app/project/striking-transformation/logs"
echo ""

# Verificar bot en Discord
echo "🤖 Verificar Bot Discord:"
echo "========================"
echo ""
echo "1. Ve a: https://discord.com/developers/applications"
echo "2. Busca 'Copa Star Bot'"
echo "3. Ve a sección 'Bot'"
echo "4. ¿Estado: 'Online'? ✅"
echo ""

# Crear checklist de errores comunes
echo "🚨 Checklist de Errores Comunes:"
echo "==============================="
echo ""
echo "❌ Si el deploy falla:"
echo "   → Verificar que las variables estén configuradas"
echo "   → Revisar logs en Railway Dashboard"
echo "   → Verificar que el repositorio GitHub esté conectado"
echo ""
echo "❌ Si el bot no responde:"
echo "   → Verificar que DISCORD_TOKEN sea correcto"
echo "   → Verificar que el bot tenga permisos en el servidor"
echo "   → Revisar logs por errores de conexión"
echo ""
echo "❌ Si Railway muestra errores:"
echo "   → Verificar que package.json tenga scripts correctos"
echo "   → Verificar que las dependencias estén instaladas"
echo "   → Revisar que PORT=3000 esté configurado"
echo ""

# Mostrar próximo paso
echo "🎯 ACCIÓN REQUERIDA:"
echo "==================="
echo ""
echo "⚠️ NECESITAS CONFIGURAR LAS VARIABLES AHORA:"
echo ""
echo "1. Abre: https://railway.app/project/striking-transformation/variables"
echo "2. Haz clic en 'Add Variable'"
echo "3. Agrega las 3 variables listadas arriba"
echo "4. Guarda y espera 2-3 minutos"
echo ""
echo "✅ Una vez configuradas las variables:"
echo "   • El bot se reiniciará automáticamente"
echo "   • Debería aparecer como 'Online' en Discord"
echo "   • Estará listo para la competencia"
echo ""

echo "🔗 Enlaces útiles:"
echo "================="
echo "Dashboard: https://railway.app/dashboard"
echo "Proyecto: https://railway.app/project/striking-transformation"
echo "Variables: https://railway.app/project/striking-transformation/variables"
echo "Logs: https://railway.app/project/striking-transformation/logs"
echo "Discord: https://discord.com/developers/applications"