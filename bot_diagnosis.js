// Script de diagnóstico para el bot de Discord
const https = require('https');

console.log('🚨 DIAGNÓSTICO DEL BOT DE DISCORD');
console.log('=' .repeat(50));

console.log('\n🔍 POSIBLES CAUSAS POR LAS QUE EL BOT NO RESPONDE:');

console.log('\n1️⃣ PROBLEMA DE CONEXIÓN:');
console.log('   • Token de Discord inválido o expirado');
console.log('   • Bot desconectado del servidor Discord');
console.log('   • Error de conectividad');

console.log('\n2️⃣ PROBLEMA DE PERMISOS:');
console.log('   • Bot sin permisos para leer mensajes');
console.log('   • Bot sin permisos para responder');
console.log('   • Comando mal configurado');

console.log('\n3️⃣ PROBLEMA DE CÓDIGO:');
console.log('   • Error JavaScript que rompe el bot');
console.log('   • Comando no registrado correctamente');
console.log('   • Evento de mensaje no funciona');

console.log('\n4️⃣ PROBLEMA DE DEPLOY:');
console.log('   • Cambios no desplegados en Railway');
console.log('   • Código en Railway desactualizado');
console.log('   • Error en el deploy');

console.log('\n🛠️ PASOS DE DIAGNÓSTICO:');

console.log('\n📋 1. VERIFICAR LOGS EN RAILWAY:');
console.log('   • Ve a: https://railway.app/dashboard');
console.log('   • Proyecto: striking-transformation');
console.log('   • Revisa los logs de deploy recientes');
console.log('   • ¿Hay errores en rojo?');

console.log('\n🔍 2. VERIFICAR ESTADO EN RAILWAY:');
console.log('   • ¿Status muestra "Active" en verde?');
console.log('   • ¿Último deploy fue exitoso?');
console.log('   • ¿El bot se conectó a Discord?');

console.log('\n🔧 3. VERIFICAR TOKEN EN RAILWAY:');
console.log('   • Variables → DISCORD_TOKEN');
console.log('   • ¿El token está completo y correcto?');
console.log('   • ¿No hay espacios extra?');

console.log('\n💬 4. VERIFICAR EN DISCORD:');
console.log('   • ¿El bot aparece "Online" en tu servidor?');
console.log('   • ¿El bot puede ver y leer mensajes?');
console.log('   • ¿Los permisos están correctos?');

console.log('\n🧪 5. PRUEBAS BÁSICAS:');
console.log('   • Menciona al bot en un canal: @nombre-del-bot');
console.log('   • ¿Responde al mensaje directo?');
console.log('   • ¿Aparece en la lista de miembros?');

console.log('\n🔧 COMANDOS PARA VERIFICAR:');

// Simular comandos básicos
const basicCommands = [
    '!queue',
    '!help', 
    '@nombre-del-bot',
    '/queue',
    'ping'
];

console.log('\n📝 COMANDOS PARA PROBAR:');
basicCommands.forEach((cmd, index) => {
    console.log(`   ${index + 1}. ${cmd}`);
});

console.log('\n❌ ERRORES COMUNES:');

console.log('\n🔴 ERROR: "Client Login"');
console.log('   • Causa: Token inválido');
console.log('   • Solución: Verificar DISCORD_TOKEN en Railway');

console.log('\n🔴 ERROR: "Missing Permissions"');
console.log('   • Causa: Bot sin permisos');
console.log('   • Solución: Revisar permisos del bot');

console.log('\n🔴 ERROR: "Cannot read properties"');
console.log('   • Causa: Error en código JavaScript');
console.log('   • Solución: Revisar logs y corregir código');

console.log('\n🔴 ERROR: "TokenInvalid"');
console.log('   • Causa: Token expirado o mal formateado');
console.log('   • Solución: Generar nuevo token en Discord Developer Portal');

console.log('\n📊 INFORMACIÓN NECESARIA PARA DIAGNÓSTICO:');

console.log('\n🎯 NECESITO QUE ME DIGAS:');
console.log('   1. ¿Qué muestran los logs de Railway?');
console.log('   2. ¿El bot aparece "Online" en Discord?');
console.log('   3. ¿Hay algún error visible en los logs?');
console.log('   4. ¿El bot responde a menciones directas?');
console.log('   5. ¿El último deploy fue exitoso?');

console.log('\n📸 ENVÍAME:');
console.log('   • Screenshot de los logs de Railway');
console.log('   • Screenshot del bot en Discord (status)');
console.log('   • Cualquier error visible');

console.log('\n' + '=' .repeat(50));
console.log('🎯 PRÓXIMO PASO: Revisar logs de Railway primero');