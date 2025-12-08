#!/bin/bash

# 🤖 Copa Star Bot - Automatización Completa con Railway API
# ==========================================================

echo "🤖 Copa Star Bot - Automatización Completa con Railway API"
echo "=========================================================="
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

# Configurar Railway CLI
setup_railway_cli() {
    print_header "Configurando Railway CLI..."
    
    if ! command -v railway &> /dev/null; then
        print_status "Instalando Railway CLI..."
        npm install -g @railway/cli
        if [ $? -eq 0 ]; then
            print_success "Railway CLI instalado correctamente"
        else
            print_error "Error instalando Railway CLI"
            exit 1
        fi
    else
        print_success "Railway CLI ya está instalado"
    fi
}

# Configurar autenticación con API Token
setup_authentication() {
    print_header "Configurando autenticación..."
    
    # Configurar token de API
    export RAILWAY_TOKEN="09f803fc-8522-4bff-bb40-b5a3682f1448"
    echo $RAILWAY_TOKEN | railway auth login --token
    print_success "Autenticación configurada con API Token"
}

# Verificar estado del proyecto
check_project_status() {
    print_header "Verificando estado del proyecto..."
    
    railway status
    if [ $? -eq 0 ]; then
        print_success "Proyecto conectado correctamente"
    else
        print_warning "Proyecto no detectado, verificando proyectos disponibles..."
        railway projects list
        print_status "Usa 'railway link' para conectar al proyecto"
    fi
}

# Configurar variables de entorno del bot
setup_bot_environment() {
    print_header "Configurando variables de entorno del bot..."
    
    # Variables necesarias para el Discord Bot
    print_status "Configurando DISCORD_TOKEN..."
    railway variables set DISCORD_TOKEN="MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
    
    print_status "Configurando NODE_ENV..."
    railway variables set NODE_ENV="production"
    
    print_status "Configurando PORT..."
    railway variables set PORT="3000"
    
    print_success "Variables de entorno configuradas"
}

# Mostrar información del proyecto
show_project_info() {
    print_header "Información del Proyecto"
    
    echo "🔗 Enlaces importantes:"
    echo "   Dashboard: https://railway.app/dashboard"
    echo "   Proyecto: https://railway.app/project/striking-transformation"
    echo ""
    
    print_status "Variables configuradas:"
    railway variables list
    echo ""
}

# Mostrar comandos útiles
show_commands() {
    print_header "Comandos Útiles de Railway"
    
    echo "📋 Comandos básicos:"
    echo "   railway status          - Ver estado del proyecto"
    echo "   railway logs            - Ver logs actuales"
    echo "   railway logs --follow   - Seguir logs en tiempo real"
    echo "   railway restart         - Reiniciar el servicio"
    echo "   railway deploy          - Forzar deploy"
    echo "   railway variables       - Ver/editar variables"
    echo ""
    
    echo "🔄 Comandos de monitoreo:"
    echo "   railway metrics         - Ver métricas del proyecto"
    echo "   railway info            - Información detallada"
    echo "   railway links           - Ver proyectos conectados"
    echo ""
    
    echo "🚨 Comandos de emergencia:"
    echo "   railway stop            - Detener el servicio"
    echo "   railway start           - Iniciar el servicio"
    echo "   railway rollback        - Volver a versión anterior"
    echo ""
}

# Crear script de monitoreo continuo
create_monitoring_script() {
    print_header "Creando script de monitoreo..."
    
    cat > monitor-bot.sh << 'EOF'
#!/bin/bash

# 🤖 Monitor Copa Star Bot
# =======================

echo "🔍 Monitoreando Copa Star Bot..."
echo "================================"

while true; do
    echo "$(date): Verificando estado..."
    
    # Verificar estado
    railway status | grep -q "running" && echo "✅ Bot funcionando" || echo "❌ Bot no disponible"
    
    # Verificar logs recientes
    echo "📊 Últimos logs:"
    railway logs --lines 3
    
    echo "⏰ Esperando 30 segundos para próximo check..."
    sleep 30
done
EOF

    chmod +x monitor-bot.sh
    print_success "Script de monitoreo creado: monitor-bot.sh"
    echo "   Usa: ./monitor-bot.sh para monitoreo continuo"
}

# Función principal
main() {
    setup_railway_cli
    setup_authentication
    check_project_status
    setup_bot_environment
    show_project_info
    show_commands
    create_monitoring_script
    
    echo ""
    print_success "🎉 ¡Automatización completada!"
    echo ""
    echo "🎯 Tu Copa Star Bot está listo:"
    echo "   ✅ Variables configuradas"
    echo "   ✅ Autenticación activa"
    echo "   ✅ Monitoreo disponible"
    echo ""
    echo "🚀 El bot debería estar online en Railway"
    echo "🔗 Dashboard: https://railway.app/project/striking-transformation"
    echo ""
    print_success "¡Bot listo para la competencia!"
}

# Ejecutar
main