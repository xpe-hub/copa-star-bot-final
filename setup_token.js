// Script para configurar el token del bot de manera interactiva
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🎮 Configuración del Bot Copa Star');
console.log('==================================');
console.log('');
console.log('Para que el bot funcione correctamente, necesita el token de Discord.');
console.log('');

rl.question('Por favor, ingresa el token del bot de Discord: ', (token) => {
    if (!token) {
        console.log('❌ Error: El token no puede estar vacío.');
        rl.close();
        return;
    }
    
    console.log('');
    console.log('✅ Token recibido correctamente.');
    console.log('');
    console.log('Para configurar el token en Replit:');
    console.log('1. Ve a la pestaña "Secrets" (lado izquierdo)');
    console.log('2. Click en "New Secret"');
    console.log('3. Nombre: DISCORD_TOKEN');
    console.log('4. Valor: ' + token);
    console.log('5. Click "Add Secret"');
    console.log('');
    console.log('Luego reinicia el bot para que tome los cambios.');
    
    // Guardar en archivo temporal para referencia
    const fs = require('fs');
    fs.writeFileSync('.discord_token', token);
    
    rl.close();
});

rl.on('close', () => {
    console.log('');
    console.log('🎯 Configuración completada. El bot ya tiene acceso al token.');
});