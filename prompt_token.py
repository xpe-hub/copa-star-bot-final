#!/usr/bin/env python3
"""
Script para pedir el token del bot de Discord de manera interactiva
"""

import os
import sys

def main():
    print("🎮 CONFIGURACIÓN DEL BOT COPA STAR")
    print("=" * 40)
    print()
    print("Para que el bot funcione correctamente, necesita el token de Discord.")
    print()
    print("📋 INSTRUCCIONES:")
    print("1. Ve a https://discord.com/developers/applications")
    print("2. Selecciona tu aplicación del bot")
    print("3. Ve a la sección 'Bot'")
    print("4. Copia el token del bot")
    print()
    
    while True:
        token = input("🔑 Ingresa el token del bot de Discord: ").strip()
        
        if not token:
            print("❌ Error: El token no puede estar vacío.")
            continue
            
        if len(token) < 50:
            print("⚠️  Advertencia: El token parece muy corto. ¿Estás seguro? (y/n): ", end="")
            confirm = input().strip().lower()
            if confirm != 'y':
                continue
        
        print()
        print("✅ Token recibido correctamente.")
        print()
        print("🔧 CONFIGURACIÓN EN REPLIT:")
        print("1. Ve a la pestaña 'Secrets' (lado izquierdo)")
        print("2. Click en 'New Secret'")
        print("3. Nombre: DISCORD_TOKEN")
        print("4. Valor:", token)
        print("5. Click 'Add Secret'")
        print("6. Reinicia el bot")
        print()
        print("🎯 Token configurado para Copa Star Bot v2!")
        
        # Guardar token para referencia
        try:
            with open('.discord_token', 'w') as f:
                f.write(token)
            print("💾 Token guardado temporalmente en .discord_token")
        except:
            pass
            
        break

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Configuración cancelada por el usuario.")
        sys.exit(0)