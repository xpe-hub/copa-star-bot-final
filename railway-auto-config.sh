#!/bin/bash

# 🤖 Copa Star Bot - Configuración Automática Railway
# ===================================================

echo "🤖 Copa Star Bot - Configuración Automática Railway"
echo "==================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Instalar Railway CLI si no está instalado
install_railway_cli() {
    print_status "Verificando Railway CLI..."
    
    if ! command -v railway &> /dev/null; then
        print_status "Instalando Railway CLI..."
        npm install -g @railway/cli
        print_success "Railway CLI instalado"
    else
        print_success "Railway CLI ya está instalado"
    fi
}

# Configurar variables de entorno
setup_environment() {
    print_status "Configurando variables de entorno en Railway..."
    
    # Variables necesarias para el bot
    railway variables set DISCORD_TOKEN="MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
    railway variables set NODE_ENV="production"
    railway variables set PORT="3000"
    
    print_success "Variables de entorno configuradas"
}

# Verificar estado del proyecto
check_project_status() {
    print_status "Verificando estado del proyecto..."
    
    # Verificar si el proyecto está conectado
    if railway status > /dev/null 2>&1; then
        print_success "Proyecto conectado y funcionando"
        railway status
    else
        print_warning "Proyecto no detectado, puede necesitar configuración manual"
        echo "   Visita: https://railway.app/dashboard"
        echo "   Configura el proyecto manualmente con:"
        echo "   railway login"
        echo "   railway link"
    fi
}

# Mostrar comandos útiles
show_commands() {
    echo ""
    echo "📋 Comandos útiles de Railway:"
    echo "=============================="
    echo "railway status          - Ver estado del proyecto"
    echo "railway logs            - Ver logs en tiempo real"
    echo "railway logs --follow   - Seguir logs"
    echo "railway restart         - Reiniciar el servicio"
    echo "railway variables       - Ver variables de entorno"
    echo "railway deploy          - Forzar deploy"
    echo ""
    echo "🔗 Enlaces importantes:"
    echo "======================"
    echo "Dashboard: https://railway.app/dashboard"
    echo "API Token: https://railway.app/settings/account"
    echo "Proyecto: https://railway.app/project/striking-transformation"
    echo ""
    print_success "Configuración completada!"
}

# Función principal
main() {
    install_railway_cli
    setup_environment
    check_project_status
    show_commands
}

# Ejecutar
main