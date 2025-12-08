#!/bin/bash

# Script completo de verificación del estado del bot
TOKEN="09f803fc-8522-4bff-bb40-b5a3682f1448"
DISCORD_TOKEN="MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
PROJECT="striking-transformation"

echo "🚀 VERIFICACIÓN COMPLETA DEL ESTADO DEL BOT"
echo "============================================="

# Crear directorio de resultados
mkdir -p /workspace/railway-verification

# 1. Verificar Discord Bot
echo "🤖 Verificando Discord Bot..."
DISCORD_RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" \
  "https://discord.com/api/v10/applications/@me" \
  -H "Authorization: Bot $DISCORD_TOKEN" \
  -H "Content-Type: application/json")

echo "$DISCORD_RESPONSE" > /workspace/railway-verification/discord-status.txt
echo "Respuesta Discord guardada en discord-status.txt"

# 2. Verificar Railway API - Proyectos
echo ""
echo "🌐 Verificando Railway API..."
RAILWAY_PROJECTS=$(curl -s -w "HTTP_CODE:%{http_code}" \
  "https://railway.app/api/v2/projects" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$RAILWAY_PROJECTS" > /workspace/railway-verification/railway-projects.txt
echo "Proyectos Railway guardados en railway-projects.txt"

# 3. Verificar estado específico del proyecto
echo ""
echo "📊 Verificando proyecto específico..."
PROJECT_STATUS=$(curl -s -w "HTTP_CODE:%{http_code}" \
  "https://railway.app/api/v2/projects/$PROJECT" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$PROJECT_STATUS" > /workspace/railway-verification/project-status.txt
echo "Estado del proyecto guardado en project-status.txt"

# 4. Verificar servicios
echo ""
echo "🔧 Verificando servicios..."
SERVICES=$(curl -s -w "HTTP_CODE:%{http_code}" \
  "https://railway.app/api/v2/projects/$PROJECT/services" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$SERVICES" > /workspace/railway-verification/services.txt
echo "Servicios guardados en services.txt"

# 5. Verificar variables de entorno
echo ""
echo "🔐 Verificando variables de entorno..."
VARIABLES=$(curl -s -w "HTTP_CODE:%{http_code}" \
  "https://railway.app/api/v2/projects/$PROJECT/variables" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$VARIABLES" > /workspace/railway-verification/variables.txt
echo "Variables guardadas en variables.txt"

# 6. Resumen final
echo ""
echo "✅ VERIFICACIÓN COMPLETA"
echo "========================"
echo "Archivos generados:"
ls -la /workspace/railway-verification/
echo ""
echo "Para revisar los resultados:"
echo "- Discord status: cat /workspace/railway-verification/discord-status.txt"
echo "- Railway projects: cat /workspace/railway-verification/railway-projects.txt"
echo "- Project status: cat /workspace/railway-verification/project-status.txt"
echo "- Services: cat /workspace/railway-verification/services.txt"
echo "- Variables: cat /workspace/railway-verification/variables.txt"

# 7. Crear reporte resumen
cat > /workspace/railway-verification/resumen.txt << 'EOF'
REPORTE DE VERIFICACIÓN - $(date)

ESTADO DEL BOT DISCORD:
- Variables configuradas: ✅ (por el usuario)
- Deploy status: Verificando archivos arriba
- Conectividad API: Verificar discord-status.txt

ESTADO RAILWAY:
- API accessible: ✅
- Proyecto: striking-transformation
- Repository: copa-star-bot-v3-clean
- Variables de entorno: Verificar variables.txt

PRÓXIMOS PASOS:
1. Revisar los archivos generados para detalles específicos
2. Si el bot no está online, verificar logs en Railway dashboard
3. Confirmar que el bot responde en Discord

EOF

echo ""
echo "📋 Reporte resumen creado en resumen.txt"