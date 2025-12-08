#!/bin/bash

# Script completo de configuración para Railway
echo "🔧 CONFIGURACIÓN DEFINITIVA PARA RAILWAY - BOT DISCORD"
echo "======================================================"

# Crear directorio de configuración
mkdir -p /workspace/railway-config

# 1. Verificar estructura del proyecto
cat > /workspace/railway-config/verificar-proyecto.sh << 'EOF'
#!/bin/bash
echo "🔍 VERIFICANDO ESTRUCTURA DEL PROYECTO..."
echo "========================================"

# Verificar si es Node.js
if [ -f "package.json" ]; then
    echo "✅ package.json encontrado"
    echo "📋 Contenido de package.json:"
    cat package.json | head -20
    
    echo ""
    echo "📁 Scripts disponibles:"
    grep -A 10 '"scripts"' package.json || echo "No se encontraron scripts"
    
    echo ""
    echo "🎯 Archivos principales:"
    ls -la *.js | head -10
else
    echo "❌ package.json no encontrado"
fi
EOF

chmod +x /workspace/railway-config/verificar-proyecto.sh

# 2. Comandos de configuración para Railway
cat > /workspace/railway-config/comandos-railway.md << 'EOF'
# 🚀 COMANDOS EXACTOS PARA RAILWAY

## PROBLEMA IDENTIFICADO
Railway no está instalando Node.js automáticamente.

## SOLUCIÓN COMPLETA

### OPCIÓN 1: Build Command + Start Command

**Build Command:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs && npm install
```

**Start Command:**
```bash
node bot.js
```

### OPCIÓN 2: Solo Start Command con instalación inline

**Start Command:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs && node bot.js
```

### OPCIÓN 3: Verificar Runtime

En Settings → Deploy:
- **Runtime:** Node.js (18.x)
- **Build Command:** (vacío)
- **Start Command:** `node bot.js`

## VERIFICACIÓN DESPUÉS DEL CONFIG
1. Deploy debe completar sin errores
2. Logs deben mostrar "Bot is ready!"
3. Bot debe estar online en Discord
EOF

# 3. Script de verificación post-configuración
cat > /workspace/railway-config/verificar-bot.sh << 'EOF'
#!/bin/bash

echo "🤖 VERIFICACIÓN DEL BOT DESPUÉS DEL DEPLOY"
echo "=========================================="

# Verificar Discord bot
echo "1. Verificando Discord Bot..."
DISCORD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://discord.com/api/v10/applications/@me" \
  -H "Authorization: Bot MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ")

if [ "$DISCORD_STATUS" = "200" ]; then
    echo "   ✅ Discord API: Accesible (Código: $DISCORD_STATUS)"
else
    echo "   ❌ Discord API: Error (Código: $DISCORD_STATUS)"
fi

echo ""
echo "2. Próximos pasos para verificar:"
echo "   📱 Ve a: https://railway.app/project/striking-transformation/deploy"
echo "   📋 Revisa que el deploy muestre 'Success'"
echo "   📊 Ve a: https://railway.app/project/striking-transformation/logs"
echo "   🤖 Ve a: https://discord.com/developers/applications"
echo ""
echo "3. Estado esperado:"
echo "   ✅ Deploy: Success (verde)"
echo "   ✅ Logs: 'Bot is ready!' o similar"
echo "   ✅ Discord: Bot Online (verde)"
EOF

chmod +x /workspace/railway-config/verificar-bot.sh

echo "✅ Scripts de configuración creados"
echo "📁 Ubicación: /workspace/railway-config/"
echo ""
echo "🎯 COMANDOS PARA RAILWAY:"
echo "========================="
echo "Build Command:"
echo "curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs && npm install"
echo ""
echo "Start Command:"
echo "node bot.js"
echo ""
echo "⚡ O EN ALTERNATIVA:"
echo "Start Command (todo en uno):"
echo "curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs && node bot.js"