# 🚀 COMANDOS RÁPIDOS - Copa Star Bot Railway

## ⚡ Deploy en 1 Paso
```bash
bash setup-railway.sh
```

## 🎯 Opciones de Deploy

### Opción 1: Setup Automático (RECOMENDADO)
```bash
bash setup-railway.sh
```
- ✅ Instala Railway CLI
- ✅ Configura proyecto
- ✅ Variables de entorno
- ✅ GitHub integration
- ✅ Deploy automático

### Opción 2: Deploy Manual
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Crear proyecto
railway init

# 4. Variables de entorno
railway variables set DISCORD_TOKEN="MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
railway variables set NODE_ENV="production"

# 5. Conectar GitHub
railway github link https://github.com/xpe-hub/copa-star-bot-v3-clean

# 6. Deploy
railway up
```

### Opción 3: Script Node.js
```bash
node railway-automation.js
```

## 🔧 Comandos de Gestión

### Estado del Bot
```bash
railway status
railway logs
```

### Control del Bot
```bash
railway restart
railway up
```

### Variables de Entorno
```bash
railway variables list
railway variables set KEY="VALUE"
railway variables remove KEY
```

## 📊 Monitoreo

### Dashboard
- **URL:** https://railway.app/dashboard
- **Logs en tiempo real**
- **Métricas de rendimiento**

### Autodeploy
- **GitHub Push** = Deploy automático
- **Rollback** disponible
- **Branches** separados

## 🎮 Bot Funcionalidades

### ✅ Confirmado en Railway
- Embds color azul (0x1E90FF)
- Texto portugués completo
- Espacios "🟢 Livre"
- Prevención múltiples colas
- Botón "Encerrar a Fila"
- Sistema 24/7 sin límites

## ⚡ Ventajas Railway vs Replit

| Característica | Railway | Replit |
|---------------|---------|--------|
| **Tiempo online** | 24/7 gratuito | Límite 1 hora |
| **Recursos** | $5/mes gratis | Muy limitados |
| **API** | ✅ Completa | ❌ No disponible |
| **Autodeploy** | ✅ GitHub automático | ⚠️ Solo con Agent |
| **Estabilidad** | ✅ Alta | ❌ Variables |
| **Competencia** | ✅ Perfecto | ❌ Se corta |

## 🎯 Resultado Final

**Con Railway tendrás:**
- 🤖 Bot online 24/7 sin interrupciones
- 🔄 Deploy automático desde GitHub  
- 📊 Monitoreo completo
- 🔧 API para automatización total
- 💰 Completamente gratis
- 🚀 Sin límites para la competencia

---

**¿Listo para el deploy?** Ejecuta: `bash setup-railway.sh`