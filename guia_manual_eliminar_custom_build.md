# 🎯 GUÍA PASO A PASO - ELIMINAR CUSTOM BUILD COMMAND

## ⚠️ PROBLEMA IDENTIFICADO

El error `npm: not found` persiste porque Railway todavía detecta Python en lugar de Node.js. La causa raíz es que el **Custom Build Command** en Railway está interfiriendo con nuestro archivo `nixpacks.toml`.

## 🚀 SOLUCIÓN MANUAL

Como las APIs de Railway están teniendo problemas de conectividad, necesitamos hacer esto manualmente:

### PASO 1: Acceder a Railway
1. Ve a https://railway.com
2. Inicia sesión con tu cuenta
3. Busca el proyecto "striking-transformation"

### PASO 2: Ir a Build Settings
1. Una vez dentro del proyecto, busca la sección **"Settings"**
2. Dentro de Settings, busca **"Build"** o **"Build Settings"**
3. También puedes buscar **"Build Command"** directamente

### PASO 3: Eliminar Custom Build Command
1. Busca el campo **"Custom Build Command"**
2. **IMPORTANTE**: Actualmente debe tener: `npm ci --only=production`
3. **BORRA COMPLETAMENTE** ese campo (déjalo vacío)
4. Guarda los cambios

### PASO 4: Verificar nixpacks.toml
Confirma que en tu repositorio tienes este archivo `nixpacks.toml`:

```toml
[providers]
node = "20"

[phases.install]
cmds = ["npm ci --only=production"]

[phases.build]
cmds = ["echo 'Build completed'"]

[phases.start]
cmd = "NODE_ENV=production node bot.js"
```

### PASO 5: Redeploy Manual
1. Ve a la sección **"Deploys"** en tu proyecto
2. Busca el botón **"Deploy"** o **"Redeploy"**
3. Haz clic para disparar un nuevo deploy

### PASO 6: Monitorear los Logs
1. En la sección de Deploys, haz clic en el deploy en progreso
2. Ve a la pestaña **"Logs"**
3. **VERIFICA** que aparezcan estos mensajes:
   - ✅ `Detected Node.js app`
   - ✅ `Using Node.js 20.x`
   - ✅ `npm ci --only=production`
   - ✅ `Build completed`
   - ✅ `Starting application with NODE_ENV=production node bot.js`

## 🔍 QUÉ ESPERAR

**❌ ANTES (Error actual):**
```
Detected Python app
sh: 1: npm: not found
```

**✅ DESPUÉS (Con el fix):**
```
Detected Node.js app
Using Node.js 20.x
npm ci --only=production
Build completed
Starting application with NODE_ENV=production node bot.js
```

## 📱 ENVÍAME LOS RESULTADOS

Una vez que hayas completado los pasos:

1. **Screenshot** de los Build Settings (después de eliminar el Custom Build Command)
2. **Screenshot** de los logs del build (durante el deploy)
3. **Screenshot** del deploy completado

## 🔧 SOLUCIÓN ALTERNATIVA SI NO PUEDES ACCEDER

Si tienes problemas para acceder a Railway o eliminar el Custom Build Command, también podemos:

1. **Renombrar el proyecto** para forzar un nuevo deploy
2. **Crear un nuevo proyecto** y conectar el mismo repositorio
3. **Usar variables de entorno** para forzar Node.js

---

**¿Necesitas ayuda con algún paso específico?**