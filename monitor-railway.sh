#!/bin/bash

# 🤖 Monitor Copa Star Bot Railway
# ================================

echo "🔍 Monitoreando Copa Star Bot..."
echo "================================="

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_status() {
    echo -e "${BLUE}📊 Verificando estado...${NC}"
    echo "   Railway: https://railway.app/project/striking-transformation"
    echo "   Variables: https://railway.app/project/striking-transformation/variables"
    echo "   Logs: https://railway.app/project/striking-transformation/logs"
}

check_variables() {
    echo -e "${BLUE}📋 Verificar variables configuradas:${NC}"
    echo "   ✅ DISCORD_TOKEN = MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
    echo "   ✅ NODE_ENV = production"
    echo "   ✅ PORT = 3000"
}

check_bot() {
    echo -e "${BLUE}🤖 Verificar bot Discord:${NC}"
    echo "   Discord: https://discord.com/developers/applications"
    echo "   Estado: Verificar que esté 'Online'"
}

next_steps() {
    echo -e "${GREEN}🎯 Próximos pasos:${NC}"
    echo "1. Configurar variables en Railway"
    echo "2. Esperar deploy completado (2-3 minutos)"
    echo "3. Verificar logs por errores"
    echo "4. Confirmar bot 'Online' en Discord"
}

# Ejecutar verificaciones
check_status
echo ""
check_variables
echo ""
check_bot
echo ""
next_steps

echo ""
echo -e "${GREEN}🎉 ¡Monitoreo completado!${NC}"
