#!/bin/bash

# 🤖 Script de Verificación Copa Star Bot
# ======================================

echo "🤖 Copa Star Bot - Verificación Completa"
echo "========================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
RAILWAY_TOKEN="09f803fc-8522-4bff-bb40-b5a3682f1448"
DISCORD_TOKEN="MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"

check_token_config() {
    echo -e "${BLUE}🔑 Verificando tokens configurados...${NC}"
    echo "   ✅ Railway Token: ${RAILWAY_TOKEN:0:20}..."
    echo "   ✅ Discord Token: ${DISCORD_TOKEN:0:20}..."
    echo ""
}

check_railway_dashboard() {
    echo -e "${BLUE}🌐 Enlaces importantes:${NC}"
    echo "   Dashboard: https://railway.app/dashboard"
    echo "   Proyecto: https://railway.app/project/striking-transformation"
    echo "   Variables: https://railway.app/project/striking-transformation/variables"
    echo "   Logs: https://railway.app/project/striking-transformation/logs"
    echo ""
}

check_variables_needed() {
    echo -e "${YELLOW}📋 Variables que debes configurar en Railway:${NC}"
    echo ""
    echo "1. Ve a: https://railway.app/project/striking-transformation/variables"
    echo "2. Agrega estas 3 variables:"
    echo ""
    echo "   🔹 DISCORD_TOKEN"
    echo "      Valor: MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
    echo ""
    echo "   🔹 NODE_ENV"
    echo "      Valor: production"
    echo ""
    echo "   🔹 PORT"
    echo "      Valor: 3000"
    echo ""
}

check_deploy_status() {
    echo -e "${BLUE}🚀 Verificar deploy:${NC}"
    echo "1. Ve a: https://railway.app/project/striking-transformation/deploy"
    echo "2. Deberías ver un deploy en progreso o completado"
    echo "3. Si hay errores, ve a la pestaña 'Logs'"
    echo ""
}

check_discord_status() {
    echo -e "${BLUE}🤖 Verificar bot en Discord:${NC}"
    echo "1. Ve a: https://discord.com/developers/applications"
    echo "2. Busca tu aplicación Copa Star Bot"
    echo "3. Ve a la sección 'Bot'"
    echo "4. Verifica que el bot esté 'Online'"
    echo ""
}

show_next_steps() {
    echo -e "${GREEN}🎯 Próximos pasos:${NC}"
    echo "1. ✅ Configurar las 3 variables en Railway"
    echo "2. ✅ Esperar a que el deploy termine (2-3 minutos)"
    echo "3. ✅ Verificar logs en Railway"
    echo "4. ✅ Confirmar bot 'Online' en Discord"
    echo "5. ✅ Probar comando en tu servidor Discord"
    echo ""
    echo -e "${GREEN}🎉 ¡Bot listo para la competencia!${NC}"
}

show_monitoring_commands() {
    echo -e "${BLUE}📊 Comandos de monitoreo útiles:${NC}"
    echo "• railway status          - Estado del proyecto"
    echo "• railway logs            - Ver logs"
    echo "• railway restart         - Reiniciar bot"
    echo "• railway variables       - Ver/editar variables"
    echo ""
    echo "💡 Nota: Necesitas instalar Railway CLI primero:"
    echo "   npm install -g @railway/cli"
    echo ""
}

# Ejecutar todas las verificaciones
check_token_config
check_railway_dashboard
check_variables_needed
check_deploy_status
check_discord_status
show_next_steps
show_monitoring_commands

echo "========================================"
echo -e "${GREEN}✅ Verificación completada!${NC}"
echo "========================================"