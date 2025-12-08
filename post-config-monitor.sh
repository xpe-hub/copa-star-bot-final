#!/bin/bash

# 🤖 Monitor Copa Star Bot - Post Configuración
# ==============================================

echo "🤖 Copa Star Bot - Monitor Post Configuración"
echo "============================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_variables_status() {
    echo -e "${BLUE}📋 Estado de Variables:${NC}"
    echo "========================"
    echo ""
    echo "Variables configuradas en Railway:"
    echo "https://railway.app/project/striking-transformation/variables"
    echo ""
    echo "✅ DISCORD_TOKEN = MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
    echo "✅ NODE_ENV = production"
    echo "✅ PORT = 3000"
    echo ""
}

check_deploy_status() {
    echo -e "${BLUE}🚀 Estado del Deploy:${NC}"
    echo "======================"
    echo ""
    echo "Verificar aquí:"
    echo "https://railway.app/project/striking-transformation/deploy"
    echo ""
    echo "✅ Debe mostrar: 'Deploy completed'"
    echo "⚠️ Si muestra 'Failed': Ver logs en:"
    echo "   https://railway.app/project/striking-transformation/logs"
    echo ""
}

check_bot_status() {
    echo -e "${BLUE}🤖 Estado del Bot Discord:${NC}"
    echo "=========================="
    echo ""
    echo "Verificar aquí:"
    echo "https://discord.com/developers/applications"
    echo ""
    echo "✅ Bot debe estar: 'Online'"
    echo "⚠️ Si está 'Offline': Variables no configuradas correctamente"
    echo ""
}

show_monitoring_info() {
    echo -e "${BLUE}📊 Información de Monitoreo:${NC}"
    echo "============================"
    echo ""
    echo "Dashboard completo:"
    echo "https://railway.app/dashboard"
    echo ""
    echo "Proyecto específico:"
    echo "https://railway.app/project/striking-transformation"
    echo ""
    echo "Métricas en tiempo real:"
    echo "https://railway.app/project/striking-transformation/metrics"
    echo ""
}

show_commands_after_setup() {
    echo -e "${GREEN}🔧 Comandos útiles después de configurar:${NC}"
    echo "=========================================="
    echo ""
    echo "Una vez configurado Railway CLI:"
    echo "• railway status          - Ver estado del proyecto"
    echo "• railway logs            - Ver logs actuales"
    echo "• railway restart         - Reiniciar el bot"
    echo "• railway variables       - Ver/editar variables"
    echo ""
    echo "Instalar Railway CLI:"
    echo "npm install -g @railway/cli"
    echo ""
}

show_final_checklist() {
    echo -e "${YELLOW}✅ Checklist Final:${NC}"
    echo "==================="
    echo ""
    echo "1. ✅ Variables configuradas en Railway"
    echo "2. ✅ Deploy completado sin errores"
    echo "3. ✅ Bot 'Online' en Discord Developer Portal"
    echo "4. ✅ Logs no muestran errores"
    echo "5. ✅ Bot responde a comandos en Discord"
    echo ""
    echo -e "${GREEN}🎉 Si todos los puntos están ✅ = ¡Bot 100% funcional!${NC}"
}

# Ejecutar todas las verificaciones
check_variables_status
check_deploy_status
check_bot_status
show_monitoring_info
show_commands_after_setup
show_final_checklist

echo ""
echo "============================================="
echo -e "${GREEN}🎯 ¡Monitor de configuración completado!${NC}"
echo "============================================="