# 🎮 SISTEMA DE CANALES DE JUEGO AUTOMÁTICO

## 📋 Requerimiento del Usuario

El bot debe tener una **categoría separada** con **canales de juego específicos** donde mover automáticamente a los jugadores cuando la fila esté llena.

## 🏗️ Arquitectura Propuesta

### Estructura de Categorías:
1. **Categoría "Aguardando"** (ya existe)
   - Canales: `aguardando 1`, `aguardando 2`, ... `aguardando 10`
   - **Función:** Donde los jugadores esperan para entrar a la fila

2. **Categoría "Salas de Juego"** (NUEVA)
   - Canales: `sala-1v1-1`, `sala-1v1-2`, `sala-1v1-3`, etc.
   - Canales: `sala-2v2-1`, `sala-2v2-2`, `sala-2v2-3`, etc.
   - **Función:** Canales donde el bot mueve automáticamente a los jugadores

### Flujo Automático:
1. ✅ **Fila se llena** (1v1 = 2 jugadores, 2v2 = 4 jugadores)
2. ✅ **Bot crea hilo** de la partida
3. ✅ **Bot mueve jugadores** a canal específico de la categoría "Salas de Juego"
4. ✅ **Bot envía mensaje** en el canal con instrucciones
5. ✅ **Cuando termina la partida** → Bot mueve de vuelta o libera canal

## ❓ INFORMACIÓN REQUERIDA

Para implementar correctamente, necesito:

### 🔍 IDs Necesarios:
- **ID de la categoría "Salas de Juego"**
- **IDs de los canales 1v1:** `sala-1v1-1`, `sala-1v1-2`, etc.
- **IDs de los canales 2v2:** `sala-2v2-1`, `sala-2v2-2`, etc.

### 📝 Opciones de Implementación:

#### Opción A: Canales Pre-creados
- Usar canales ya existentes en la categoría
- Bot asigna automáticamente a la próxima sala disponible

#### Opción B: Creación Dinámica
- Bot crea nuevos canales temporales
- Se eliminan automáticamente cuando termina la partida

#### Opción C: Híbrida
- Combinar hilos + canales de voz
- Hilo para chat + canal de voz para juego

## 🤖 Funcionalidades a Implementar

### ✅ Movimientos Automáticos
```python
# Pseudo-código
async def move_players_to_game_channel(players, game_mode):
    game_channel = get_available_game_channel(game_mode)
    for player in players:
        await player.move_to(game_channel)
```

### ✅ Gestión de Canales
- **Buscar salas disponibles**
- **Marcar salas como "ocupadas"**
- **Liberar salas automáticamente**
- **Limpieza periódica de salas libres**

### ✅ Notificaciones
- **Mensaje de bienvenida** en sala de juego
- **Instrucciones** de la partida
- **Confirmación de movimiento** al usuario

## 💭 ¿Qué prefieres?

**Pregunta al usuario:**
1. ¿Ya tienes la categoría y canales creados, o quieres que el bot los cree dinámicamente?
2. ¿Cuántas salas 1v1 y 2v2 necesitas?
3. ¿Quieres que el bot mueva de vuelta a los jugadores cuando termine la partida?

**Una vez que tengas los IDs o me confirmes el enfoque, implemento todo en 10 minutos.** 🚀