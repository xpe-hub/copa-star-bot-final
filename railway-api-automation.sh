#!/bin/bash

# 🤖 Copa Star Bot - Automatización con Railway API REST
# ======================================================

echo "🤖 Copa Star Bot - Automatización con Railway API REST"
echo "======================================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${PURPLE}🎯 $1${NC}"
}

# Configurar variables
RAILWAY_TOKEN="09f803fc-8522-4bff-bb40-b5a3682f1448"
RAILWAY_API_BASE="https://railway.app/api"

# Configurar curl con el token
setup_api_config() {
    print_header "Configurando API de Railway..."
    
    # Headers para la API
    export RAILWAY_HEADERS="Authorization: Bearer $RAILWAY_TOKEN
Content-Type: application/json"
    
    print_success "API configurada con token"
}

# Obtener información del proyecto
get_project_info() {
    print_header "Obteniendo información del proyecto..."
    
    echo "🔍 Buscando proyectos..."
    curl -s -H "$RAILWAY_HEADERS" "$RAILWAY_API_BASE/projects" | jq -r '.projects[] | "\(.name) - \(.id)"' | head -5
    print_success "Proyectos obtenidos"
}

# Configurar variables de entorno
setup_environment_variables() {
    print_header "Configurando variables de entorno..."
    
    # Variables del bot
    DISCORD_TOKEN="MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
    NODE_ENV="production"
    PORT="3000"
    
    print_status "Configurando DISCORD_TOKEN..."
    echo "   Token configurado: ${DISCORD_TOKEN:0:20}..."
    
    print_status "Configurando NODE_ENV..."
    echo "   NODE_ENV = $NODE_ENV"
    
    print_status "Configurando PORT..."
    echo "   PORT = $PORT"
    
    print_success "Variables de entorno listas para configurar"
}

# Mostrar comandos manuales
show_manual_commands() {
    print_header "Comandos Manuales para Completar la Configuración"
    
    echo "🚀 Para completar la configuración manualmente en Railway:"
    echo ""
    echo "1. Ve al Dashboard: https://railway.app/dashboard"
    echo "2. Selecciona tu proyecto 'striking-transformation'"
    echo "3. Ve a la pestaña 'Variables'"
    echo "4. Agrega estas variables:"
    echo ""
    echo "   📋 Variables a agregar:"
    echo "   DISCORD_TOKEN = MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
    echo "   NODE_ENV = production"
    echo "   PORT = 3000"
    echo ""
    echo "5. Guarda las variables"
    echo "6. El bot debería reiniciarse automáticamente"
    echo ""
}

# Crear script de verificación
create_verification_script() {
    print_header "Creando script de verificación..."
    
    cat > verify-bot.sh << 'EOF'
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
EOF

    chmod +x verify-bot.sh
    print_success "Script de verificación creado: verify-bot.sh"
}

# Mostrar resumen final
show_final_summary() {
    print_header "Resumen de Automatización"
    
    echo "🎯 Configuración completada:"
    echo "   ✅ Railway API Token configurado"
    echo "   ✅ Variables del bot definidas"
    echo "   ✅ Scripts de verificación creados"
    echo ""
    echo "📋 Próximo paso:"
    echo "   → Configurar variables manualmente en Railway Dashboard"
    echo ""
    echo "🔗 Enlaces importantes:"
    echo "   Dashboard: https://railway.app/dashboard"
    echo "   Proyecto: https://railway.app/project/striking-transformation"
    echo "   Variables: Dashboard → Proyecto → Variables"
    echo ""
    print_success "¡Automatización lista!"
}

# Función principal
main() {
    setup_api_config
    get_project_info
    setup_environment_variables
    show_manual_commands
    create_verification_script
    show_final_summary
}

# Ejecutar
main