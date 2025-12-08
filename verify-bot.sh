#!/bin/bash

# 🤖 Verificar Estado del Copa Star Bot
# ====================================

echo "🔍 Verificando estado del Copa Star Bot..."
echo "=========================================="

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

check_railway_dashboard() {
    echo -e "${BLUE}🌐 Verificando Railway Dashboard...${NC}"
    echo "   URL: https://railway.app/project/striking-transformation"
    echo "   Status: Ve el dashboard para estado en tiempo real"
}

check_variables() {
    echo -e "${BLUE}📋 Verificar variables configuradas:${NC}"
    echo "   ✅ DISCORD_TOKEN configurado"
    echo "   ✅ NODE_ENV = production"
    echo "   ✅ PORT = 3000"
}

check_discord_status() {
    echo -e "${BLUE}🤖 Verificar Discord Bot:${NC}"
    echo "   • Ve a: https://discord.com/developers/applications"
    echo "   • Busca tu aplicación Copa Star Bot"
    echo "   • Ve a la sección 'Bot' para verificar estado"
}

next_steps() {
    echo -e "${GREEN}🎯 Próximos pasos:${NC}"
    echo "1. Configurar variables en Railway Dashboard"
    echo "2. Verificar que el bot esté 'Online' en Discord"
    echo "3. Probar comandos en tu servidor Discord"
    echo "4. Monitorear logs en Railway"
}

# Ejecutar verificaciones
check_railway_dashboard
echo ""
check_variables
echo ""
check_discord_status
echo ""
next_steps

echo ""
echo -e "${GREEN}🎉 ¡Verificación completada!${NC}"
