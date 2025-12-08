#!/bin/bash

# 🤖 Copa Star Bot - Setup Automático Railway
# ===========================================

echo "🤖 Copa Star Bot - Setup Automático Railway"
echo "============================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para print con color
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

# Verificar dependencias
check_dependencies() {
    print_status "Verificando dependencias..."
    
    # Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js no encontrado. Instala Node.js primero."
        exit 1
    fi
    print_success "Node.js $(node --version) encontrado"
    
    # npm
    if ! command -v npm &> /dev/null; then
        print_error "npm no encontrado."
        exit 1
    fi
    print_success "npm $(npm --version) encontrado"
    
    # Git
    if ! command -v git &> /dev/null; then
        print_error "Git no encontrado. Instala Git primero."
        exit 1
    fi
    print_success "Git encontrado"
}

# Instalar Railway CLI
install_railway_cli() {
    print_status "Instalando Railway CLI..."
    
    if ! command -v railway &> /dev/null; then
        npm install -g @railway/cli
        print_success "Railway CLI instalado"
    else
        print_success "Railway CLI ya está instalado"
    fi
}

# Setup del proyecto
setup_project() {
    print_status "Configurando proyecto..."
    
    # Crear directorio del proyecto
    mkdir -p copa-star-bot
    cd copa-star-bot
    
    # Descargar archivos del repositorio
    print_status "Descargando código del bot..."
    git clone https://github.com/xpe-hub/copa-star-bot-v3-clean .
    
    # Crear package.json optimizado para Railway
    print_status "Configurando package.json..."
    cp ../package-railway.json package.json
    
    # Instalar dependencias
    print_status "Instalando dependencias..."
    npm install
    
    print_success "Proyecto configurado"
}

# Configurar Railway
configure_railway() {
    print_status "Configurando Railway..."
    
    # Login
    print_warning "Se abrirá tu navegador para autenticación..."
    railway login
    
    # Crear/ligar proyecto
    print_status "Iniciando proyecto Railway..."
    railway init || railway link
    
    # Configurar variables de entorno
    print_status "Configurando variables de entorno..."
    railway variables set DISCORD_TOKEN="MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
    railway variables set NODE_ENV="production"
    railway variables set PORT="3000"
    
    # Conectar GitHub
    print_status "Conectando repositorio GitHub..."
    railway github link "https://github.com/xpe-hub/copa-star-bot-v3-clean" --create || print_warning "GitHub ya conectado"
    
    print_success "Railway configurado"
}

# Deploy
deploy() {
    print_status "Ejecutando deploy..."
    
    railway up
    
    print_success "Deploy iniciado!"
    echo ""
    echo "🎉 ¡Copa Star Bot deployado en Railway!"
    echo ""
    echo "📊 Monitoreo:"
    echo "   Dashboard: https://railway.app/dashboard"
    echo "   Status: railway status"
    echo "   Logs: railway logs"
    echo ""
    echo "⏱️ El bot estará online en 2-3 minutos"
    echo "🔄 Cada cambio en GitHub = Deploy automático"
    echo ""
    print_success "¡Bot listo para la competencia!"
}

# Función principal
main() {
    echo "Este script configurará automáticamente:"
    echo "• Railway CLI"
    echo "• Proyecto Node.js"
    echo "• Variables de entorno"
    echo "• GitHub integration"
    echo "• Deploy automático"
    echo ""
    
    read -p "¿Continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Setup cancelado"
        exit 1
    fi
    
    check_dependencies
    install_railway_cli
    setup_project
    configure_railway
    deploy
}

# Ejecutar
main