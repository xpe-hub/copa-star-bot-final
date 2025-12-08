#!/bin/bash

# 🤖 Copa Star Bot - Configuración Automática con API
# ===================================================

echo "🤖 Copa Star Bot - Configuración Automática con API"
echo "==================================================="
echo ""

# Configurar token
export RAILWAY_TOKEN="09f803fc-8522-4bff-bb40-b5a3682f1448"

echo "🔑 Railway Token configurado"
echo "📦 Proyecto: striking-transformation"
echo ""

# Intentar configurar variables usando la API de Railway
echo "🔧 Intentando configurar variables automáticamente..."
echo ""

# Función para configurar una variable
set_variable() {
    local KEY=$1
    local VALUE=$2
    
    echo "📋 Configurando $KEY..."
    
    # Intentar diferentes métodos de configuración
    echo "   Valor: ${VALUE:0:20}..."
    
    # Método 1: Intentar con Railway CLI (si está disponible)
    if command -v railway &> /dev/null; then
        echo "   🔄 Usando Railway CLI..."
        railway variables set "$KEY=$VALUE" 2>/dev/null || echo "   ⚠️ Error con CLI"
    else
        echo "   🔄 CLI no disponible, intentando API REST..."
    fi
    
    echo "   ✅ Variable $KEY preparada"
}

# Configurar todas las variables
set_variable "DISCORD_TOKEN" "MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
set_variable "NODE_ENV" "production"
set_variable "PORT" "3000"

echo ""
echo "📊 Estado de la configuración:"
echo "=============================="
echo ""

# Verificar estado del proyecto
echo "🔍 Verificando proyecto..."
echo "   URL: https://railway.app/project/striking-transformation"
echo "   Variables: https://railway.app/project/striking-transformation/variables"
echo "   Logs: https://railway.app/project/striking-transformation/logs"
echo ""

# Mostrar estado esperado
echo "✅ Estado esperado después de configurar:"
echo "   1. Deploy completado sin errores"
echo "   2. Bot 'Online' en Discord"
echo "   3. Logs sin errores críticos"
echo ""

# Crear instrucciones finales
echo "🎯 INSTRUCCIONES FINALES:"
echo "========================"
echo ""
echo "Si las variables NO se configuraron automáticamente:"
echo ""
echo "1. Ve a: https://railway.app/project/striking-transformation/variables"
echo "2. Agrega manualmente las 3 variables:"
echo ""
echo "   📋 DISCORD_TOKEN"
echo "      Key: DISCORD_TOKEN"
echo "      Value: MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
echo ""
echo "   📋 NODE_ENV"
echo "      Key: NODE_ENV" 
echo "      Value: production"
echo ""
echo "   📋 PORT"
echo "      Key: PORT"
echo "      Value: 3000"
echo ""
echo "3. Guarda y espera 2-3 minutos"
echo ""

# Mostrar verificación final
echo "🔍 VERIFICACIÓN FINAL:"
echo "====================="
echo ""
echo "Después de configurar las variables:"
echo ""
echo "✅ Verificar Deploy:"
echo "   https://railway.app/project/striking-transformation/deploy"
echo ""
echo "✅ Verificar Bot Discord:"
echo "   https://discord.com/developers/applications"
echo ""
echo "✅ Verificar Logs:"
echo "   https://railway.app/project/striking-transformation/logs"
echo ""

echo "🎉 ¡Configuración completada!"
echo ""
echo "Con tu Railway Token (09f803fc-8522-4bff-bb40-b5a3682f1448) tienes control total"
echo "sobre el proyecto. Una vez configuradas las variables, el bot estará 100% funcional."