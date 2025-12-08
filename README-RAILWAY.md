# 🤖 Copa Star Bot - Railway.app Deployment

## 🚀 Deployment Automático Completo

### ⚡ Deploy en 1 Comando
```bash
npm run deploy
```

### 🔧 Comandos Rápidos
```bash
# Ver estado del bot
npm run status

# Ver logs
npm run logs

# Reiniciar bot
npm run restart

# Deploy completo
npm run deploy
```

## 🎯 ¿Qué hace este bot?

### ✅ Funcionalidades Principales
- **Sistema de colas automático** - Sin límite de tiempo
- **Embds en color azul** - Diseño profesional
- **Prevención de múltiples colas** - Solo una fila activa
- **Espacios vacíos "🟢 Livre"** - Identificación visual clara
- **Botón "Encerrar a Fila"** - Control total de la cola
- **Texto en portugués** - Localización completa

### 🔄 Automatización Railway
- **Deploy automático** desde GitHub
- **Variables de entorno** configuradas
- **Monitoreo automático** de errores
- **Restart automático** en caso de fallos
- **Logs centralizados** para debugging

## 🛠️ Configuración Manual

### 1. Registro en Railway
1. Ve a [railway.app](https://railway.app)
2. Registra cuenta con GitHub
3. Autoriza acceso a repositorios

### 2. Crear Proyecto
```bash
railway login
railway init
```

### 3. Conectar GitHub
```bash
railway github link https://github.com/xpe-hub/copa-star-bot-v3-clean
```

### 4. Variables de Entorno
```bash
railway variables set DISCORD_TOKEN="MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ"
railway variables set NODE_ENV=production
```

### 5. Deploy
```bash
railway up
```

## 📊 Monitoreo

### Dashboard
- **URL:** [railway.app/dashboard](https://railway.app/dashboard)
- **Logs en tiempo real**
- **Métricas de rendimiento**
- **Alertas automáticas**

### Comandos de Estado
```bash
# Estado general
railway status

# Logs recientes
railway logs

# Reiniciar servicio
railway restart
```

## 🔄 Autodeploy GitHub

Railway se conecta automáticamente a tu GitHub:
- **Cada push** = Deploy automático
- **Ramas** = Deploys separados
- **Rollback** = Un clic desde dashboard

## ⚠️ Resolución de Problemas

### Bot no conecta
```bash
railway logs | grep error
railway restart
```

### Variables de entorno
```bash
railway variables list
```

### Deploy fallido
1. Verificar repositorio público
2. Verificar token Discord válido
3. Revisar logs en dashboard

## 📈 Límites Railway

### Plan Gratuito
- **$5 créditos mensuales**
- **Bot activo 24/7** - Suficiente para tu caso
- **Sin límites de tiempo**

### Upgrade (Opcional)
- **Más recursos** si crece el bot
- **Soporte prioritario**
- **Métricas avanzadas**

## 🎮 Uso del Bot

### Comandos
- **Solo botones** - Interfaz visual completa
- **No comandos de texto** - Simplicidad total
- **Feedback inmediato** - Respuesta visual

### Para la Competencia
- **Fila siempre disponible** - Sin tiempo límite
- **Control de cola** - Solo 1 fila activa
- **Embds profesionales** - Diseño competitivo

---

**🎯 Resultado:** Bot 24/7 sin límites, deployment automático, API completa para control total.