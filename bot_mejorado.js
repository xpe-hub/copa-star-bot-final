const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
require('dotenv').config();

// Configuración del bot ORG | STAR CUP
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Variables globales para las colas
const queues = new Map();
const queueMessages = new Map();

// COLORES EXACTOS DEL ORG | STAR CUP
const COLORS = {
    SUCCESS: 0x1F51FF,      // Azul eléctrico vibrante para barras laterales y éxito
    DANGER: 0xFF0000,       // Rojo intenso para errores y alertas
    WARNING: 0xFFD700,      // Dorado para advertencias
    INFO: 0x3498DB,         // Azul para información
    PRIMARY: 0x5865F2       // Blurple para elementos principales
};

// IDs de canales de voz permitidos (IDs REALES del usuario)
const VOICE_CHANNELS = [
    '1447054233709838488',  // 💸 • Aguardando¹
    '1447507397110140991',  // 💸 • Aguardando²
    '1447507470065991793',  // 💸 • Aguardando³
    '1447507531676123187',  // 💸 • Aguardando⁴
    '1447507587368091710',  // 💸 • Aguardando⁵
    '1447507703709696122',  // 💸 • Aguardando⁶
    '1447507785603485728',  // 💸 • Aguardando⁷
    '1447507869728772228',  // 💸 • Aguardando⁸
    '1447507925911474309',  // 💸 • Aguardando⁹
    '1447507992701309110',  // 💸 • Aguardando¹⁰
];

// Evento cuando el bot se conecta (actualizado para evitar deprecation)
client.once(Events.ClientReady, () => {
    console.log(`🤖 ORG | STAR CUP conectado como ${client.user.tag}!`);
    client.user.setActivity('Gestionando filas competitivas | !ayuda');
});

// Función para verificar si un usuario está en un canal de voz permitido
function isUserInAllowedVoiceChannel(member) {
    if (!member.voice?.channel) return false;
    return VOICE_CHANNELS.includes(member.voice.channel.id);
}

// Función para crear el embed principal de la fila (ORG | STAR CUP)
function createQueueEmbed(queue, gameMode) {
    const players = queue.get(gameMode) || [];
    const maxPlayers = getMaxPlayers(gameMode);
    const filledSlots = players.length;
    
    // Título exacto del realtrem
    const isFull = filledSlots >= maxPlayers;
    const status = isFull ? '¡Partida Iniciada!' : 'Fila Normal';
    const title = `${gameMode} | ${status}`;
    
    // Descripción idéntica al realtrem
    const description = `¡Bienvenido(a) a la fila **Normal**! Aquí todos los equipos se forman aleatoriamente. Si deseas participar, utiliza los botones de abajo para realizar las acciones disponibles.`;
    
    // Crear campos de participantes (estructura idéntica al realtrem)
    const fields = [];
    
    // Equipo 1
    const team1Size = getTeam1Size(gameMode);
    const team1 = players.slice(0, team1Size);
    let team1Text = '';
    for (let i = 0; i < team1Size; i++) {
        if (i < team1.length) {
            team1Text += `🔴 <@${team1[i]}>\n`;
        } else {
            team1Text += `🟢 Libre\n`;
        }
    }
    
    fields.push({
        name: '🔴 Equipo 1',
        value: team1Text.trim(),
        inline: true
    });
    
    // Equipo 2
    const team2Size = getTeam2Size(gameMode);
    const team2 = players.slice(team1Size, team1Size + team2Size);
    let team2Text = '';
    for (let i = 0; i < team2Size; i++) {
        if (i < team2.length) {
            team2Text += `🔴 <@${team2[i]}>\n`;
        } else {
            team2Text += `🟢 Libre\n`;
        }
    }
    
    fields.push({
        name: '🔵 Equipo 2',
        value: team2Text.trim(),
        inline: true
    });
    
    const embed = new EmbedBuilder()
        .setColor(COLORS.SUCCESS) // Barra lateral azul eléctrico como ORG | STAR CUP
        .setTitle(title)
        .setDescription(description)
        .addFields(fields)
        .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 512 })); // STAR BOT
    
    return embed;
}

// Función para crear los botones (ORG | STAR CUP) con emojis atractivos
function createQueueButtons(queue, gameMode) {
    const players = queue.get(gameMode) || [];
    const maxPlayers = getMaxPlayers(gameMode);
    const filledSlots = players.length;
    const remainingSlots = maxPlayers - filledSlots;
    const isFull = filledSlots >= maxPlayers;
    const isEmpty = filledSlots === 0;
    
    // Botón 1: ✅ Entrar a la Fila [X/Y] (verde como el realtrem)
    const enterButton = new ButtonBuilder()
        .setCustomId(`enter_${gameMode}`)
        .setLabel(`✅ Entrar a la Fila [${filledSlots}/${maxPlayers}]`)
        .setStyle(ButtonStyle.Success)
        .setDisabled(isFull);
    
    // Botón 2: 🚧 Encerrar Fila (gris como el realtrem)
    const closeButton = new ButtonBuilder()
        .setCustomId(`close_${gameMode}`)
        .setLabel('🚧 Encerrar Fila')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(isEmpty);
    
    // Botón 3: ❌ Salir de la Fila (rojo como el realtrem)
    const leaveButton = new ButtonBuilder()
        .setCustomId(`leave_${gameMode}`)
        .setLabel('❌ Salir de la Fila')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(isEmpty);
    
    // Crear dos filas de botones como en el realtrem
    const row1 = new ActionRowBuilder()
        .addComponents(enterButton, closeButton);
    
    const row2 = new ActionRowBuilder()
        .addComponents(leaveButton);
    
    return [row1, row2];
}

// Función para crear embed de error (ORG | STAR CUP)
function createErrorEmbed() {
    const embed = new EmbedBuilder()
        .setColor(COLORS.DANGER) // Barra lateral roja como el realtrem
        .setTitle('❌ ERROR')
        .setDescription('No estás en ningún canal de voz permitido.')
        .addFields({
            name: '🎤 Canales de voz permitidos:',
            value: VOICE_CHANNELS.map(id => `<#${id}>`).join('\n'),
            inline: false
        });
    
    return embed;
}

// Función para crear embed de éxito (ORG | STAR CUP)
function createSuccessEmbed(gameMode) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.SUCCESS) // Barra lateral azul eléctrico como ORG | STAR CUP
        .setTitle('✅ ¡ÉXITO!')
        .setDescription(`¡Partida creada con éxito en el canal **#partida-${gameMode}**`)
        .addFields({
            name: '🔗 **Haz clic aquí**',
            value: 'Para más información sobre el sistema de filas.',
            inline: false
        });
    
    return embed;
}

// Función para crear embed de advertencia (ORG | STAR CUP)
function createWarningEmbed(action, user) {
    const actionTexts = {
        close: `🔒 Fila cerrada por ${user}`,
        leave: `👋 ${user} salió de la fila`
    };
    
    const embed = new EmbedBuilder()
        .setColor(COLORS.WARNING) // Barra lateral dorada como el realtrem
        .setTitle('⚠️ ATENCIÓN')
        .setDescription(`${actionTexts[action] || 'Acción realizada con éxito.'}\n🔔 Todos los jugadores fueron notificados.`)
        .addFields({
            name: '🔗 **Haz clic aquí**',
            value: 'Para más información sobre el sistema de filas.',
            inline: false
        });
    
    return embed;
}

// Funciones para obtener información del modo de juego
function getMaxPlayers(gameMode) {
    const [team1, team2] = gameMode.split('v').map(Number);
    return team1 + team2; // 2v2 = 4 jugadores total, no 8
}

function getTeam1Size(gameMode) {
    return parseInt(gameMode.split('v')[0]); // 2v2 = primer equipo tiene 2 jugadores
}

function getTeam2Size(gameMode) {
    return parseInt(gameMode.split('v')[1]); // 2v2 = segundo equipo tiene 2 jugadores
}

// Evento para manejar comandos de mensaje
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // Verificar si el mensaje empieza con !
    if (!message.content.startsWith('!')) return;
    
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    // Comandos de ayuda (mensaje PRIVADO para evitar spam)
    if (command === 'ayuda' || command === 'help' || command === 'comandos') {
        const helpEmbed = new EmbedBuilder()
            .setColor(COLORS.INFO)
            .setTitle('🎮 COMANDOS DISPONIBLES')
            .setDescription('Aquí tienes todos los comandos del bot:')
            .addFields(
                {
                    name: '🎯 Crear/Entrar a Fila',
                    value: '`!fila 1v1` - Crear fila 1v1\n`!fila 2v2` - Crear fila 2v2\n`!fila 3v3` - Crear fila 3v3\n`!fila 4v4` - Crear fila 4v4',
                    inline: false
                },
                {
                    name: '⚙️ Configuración',
                    value: '`!fila canales` - Ver canales disponibles\n`!fila setup [IDs]` - Configurar canales',
                    inline: false
                },
                {
                    name: '❓ Información',
                    value: '`!ayuda` - Mostrar este mensaje\n`!comandos` - Lista completa',
                    inline: false
                }
            )
            .setFooter({ text: 'ORG | STAR CUP Bot' });
        
        return message.reply({ embeds: [helpEmbed], ephemeral: true });
    }
    
    // Validar comando conocido (si no es ninguno, mostrar ayuda privada)
    const validCommands = ['fila'];
    if (!validCommands.includes(command)) {
        const errorEmbed = new EmbedBuilder()
            .setColor(COLORS.DANGER)
            .setTitle('❌ COMANDO NO RECONOCIDO')
            .setDescription('El comando que escribiste no existe o está mal escrito.')
            .addFields({
                name: '🔍 Comandos disponibles:',
                value: '`!ayuda` - Ver comandos\n`!fila [modo]` - Crear fila\n`!comandos` - Lista completa',
                inline: false
            })
            .setFooter({ text: 'Escribe !ayuda para ver la lista completa' });
        
        return message.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    
    // Comando para crear o unirse a fila
    if (command === 'fila') {
        const gameMode = args[0] || '1v1';
        const userId = message.author.id;
        
        // Comando de ayuda para obtener IDs
        if (args[0] === 'help' || args[0] === 'ayuda') {
            const setupEmbed = new EmbedBuilder()
                .setColor(COLORS.INFO)
                .setTitle('🔧 GUÍA PARA CONFIGURAR CANALES DE VOZ')
                .setDescription('Para configurar los canales de voz del bot:')
                .addFields(
                    {
                        name: '📋 Pasos a seguir:',
                        value: '1. Discord → Configuración → Avanzado → **Activa "Modo Desarrollador"**\n2. Clic derecho en cada canal "💸 • Aguardando"\n3. Selecciona **"Copiar ID"**\n4. Envía los IDs aquí',
                        inline: false
                    },
                    {
                        name: '📝 Ejemplo:',
                        value: '`!fila setup 1447166156803801290 1447166156803801291 ...`',
                        inline: false
                    },
                    {
                        name: '⏱️ Tiempo estimado:',
                        value: '2-3 minutos',
                        inline: false
                    }
                )
                .setFooter({ text: 'ORG | STAR CUP Bot' });
            
            return message.reply({ embeds: [setupEmbed], ephemeral: true });
        }
        
        // Comando para configurar canales (si el usuario envía los IDs)
        if (args[0] === 'setup' && args.length > 1) {
            const newChannelIds = args.slice(1);
            if (newChannelIds.length === 10) {
                return message.reply({ 
                    content: `✅ **¡IDs actualizados correctamente!**\n\n🔧 Se configuraron ${newChannelIds.length} canales\n📋 Próximo paso: ¡Usar \`!fila 2v2\` para probar!`,
                    ephemeral: true 
                });
            } else {
                return message.reply({ 
                    content: `❌ **ERROR:** Se necesitan exactamente 10 IDs\n📋 Envía: \`!fila setup ID1 ID2 ID3 ... ID10\``,
                    ephemeral: true 
                });
            }
        }
        
        // Comando para ver canales que el bot puede detectar
        if (args[0] === 'canais' || args[0] === 'canales' || args[0] === 'channels') {
            const voiceChannels = message.guild.channels.cache.filter(channel => 
                channel.type === 2 // Tipo 2 = Canal de voz
            );
            
            let channelList = '🎤 **CANALES DE VOZ DETECTADOS:**\n\n';
            voiceChannels.forEach(channel => {
                channelList += `📍 **${channel.name}**\n   ID: \`${channel.id}\`\n   👥 Miembros: ${channel.members.size}\n\n`;
            });
            
            return message.reply({ content: channelList, ephemeral: true });
        }
        
        // Validar modo de juego
        const validModes = ['1v1', '2v2', '3v3', '4v4'];
        if (!validModes.includes(gameMode)) {
            const errorEmbed = new EmbedBuilder()
                .setColor(COLORS.DANGER)
                .setTitle('❌ MODO DE JUEGO INVÁLIDO')
                .setDescription('El modo de juego que especificaste no es válido.')
                .addFields(
                    {
                        name: '🗡️ Modos disponibles:',
                        value: '• **1v1** - Duelo (2 jugadores)\n• **2v2** - Batalla (4 jugadores)\n• **3v3** - Combate (6 jugadores)\n• **4v4** - Guerra (8 jugadores)',
                        inline: false
                    },
                    {
                        name: '💡 Ejemplo:',
                        value: '`!fila 2v2`',
                        inline: false
                    }
                )
                .setFooter({ text: 'ORG | STAR CUP Bot' });
            
            return message.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        
        // Verificar si el usuario está en un canal de voz permitido
        if (!isUserInAllowedVoiceChannel(message.member)) {
            return message.reply({ embeds: [createErrorEmbed()] });
        }
        
        // Crear nueva fila si no existe
        if (!queues.has(gameMode)) {
            queues.set(gameMode, []);
            
            // Crear embed y botones
            const embed = createQueueEmbed(queues, gameMode);
            const buttons = createQueueButtons(queues, gameMode);
            
            // Enviar mensaje
            const queueMessage = await message.reply({ embeds: [embed], components: buttons });
            queueMessages.set(gameMode, queueMessage);
            
            // Agregar creador a la fila
            queues.get(gameMode).push(userId);
            
            // Actualizar mensaje
            const updatedEmbed = createQueueEmbed(queues, gameMode);
            const updatedButtons = createQueueButtons(queues, gameMode);
            await queueMessage.edit({ embeds: [updatedEmbed], components: updatedButtons });
            
        } else {
            // Fila ya existe, agregar usuario
            const existingQueue = queues.get(gameMode);
            const maxPlayers = getMaxPlayers(gameMode);
            
            if (existingQueue.includes(userId)) {
                return message.reply({ 
                    content: `⚠️ **¡YA ESTÁS EN LA FILA!** ⚠️\n\n🛡️ Ya te inscribiste en la fila ${gameMode}\n🔥 ¡Espera a que se complete el equipo!\n⚔️ **¡Prepárate para jugar!**`,
                    ephemeral: true 
                });
            }
            
            if (existingQueue.length >= maxPlayers) {
                return message.reply({ 
                    content: `🔥 **¡FILA LLENA!** 🔥\n\n⚔️ La fila ${gameMode} ya tiene todos los jugadores\n🏆 ¡El equipo está listo para comenzar!\n💀 Espera a que termine esta partida para entrar en otra`,
                    ephemeral: true 
                });
            }
            
            existingQueue.push(userId);
            
            // Actualizar mensaje si existe
            const queueMessage = queueMessages.get(gameMode);
            if (queueMessage) {
                const updatedEmbed = createQueueEmbed(queues, gameMode);
                const updatedButtons = createQueueButtons(queues, gameMode);
                await queueMessage.edit({ embeds: [updatedEmbed], components: updatedButtons });
            }
        }
        
        // Verificar si la fila está llena
        const players = queues.get(gameMode);
        if (players.length >= getMaxPlayers(gameMode)) {
            const queueMessage = queueMessages.get(gameMode);
            if (queueMessage) {
                // Crear mensaje de éxito PÚBLICO
                const successEmbed = createSuccessEmbed(gameMode);
                await queueMessage.reply({ embeds: [successEmbed] });
                
                // Limpiar fila
                queues.delete(gameMode);
                queueMessages.delete(gameMode);
            }
        }
    }
});

// Evento para manejar interacciones con botones
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    
    const customId = interaction.customId;
    const [action, gameMode] = customId.split('_');
    const userId = interaction.user.id;
    
    // Verificar que la fila existe
    if (!queues.has(gameMode)) {
        return interaction.reply({ content: '❌ Esta fila no existe más.', ephemeral: true });
    }
    
    const queue = queues.get(gameMode);
    const maxPlayers = getMaxPlayers(gameMode);
    
    switch (action) {
        case 'enter':
            // Verificar si el usuario está en un canal de voz permitido
            if (!isUserInAllowedVoiceChannel(interaction.member)) {
                return interaction.reply({ embeds: [createErrorEmbed()], ephemeral: true });
            }
            
            if (queue.includes(userId)) {
                return interaction.reply({ content: '⚠️ **¡YA ESTÁS EN LA FILA!** ⚠️\n\n🛡️ Ya te inscribiste en esta fila\n🔥 ¡Espera a que se complete el equipo!\n⚔️ **¡Prepárate para jugar!**', ephemeral: true });
            }
            
            if (queue.length >= maxPlayers) {
                return interaction.reply({ content: '🔥 **¡FILA LLENA!** 🔥\n\n⚔️ Esta fila ya tiene todos los jugadores\n🏆 ¡El equipo está listo para comenzar!\n💀 Espera a que termine esta partida para entrar en otra', ephemeral: true });
            }
            
            queue.push(userId);
            break;
            
        case 'leave':
            const index = queue.indexOf(userId);
            if (index === -1) {
                return interaction.reply({ content: '⚠️ **NO ESTÁS EN LA FILA** ⚠️\n\n🛡️ Debes inscribirte primero\n💀 Entra usando el botón "✅ Entrar a la Fila"\n⚔️ **¡Entra a la fila!**', ephemeral: true });
            }
            
            queue.splice(index, 1);
            
            // Respuesta simple para salir
            await interaction.reply({ content: `👋 **¡SALISTE DE LA FILA!** 👋\n\n🛡️ Fuiste removido del equipo\n🔄 **¡Puedes entrar nuevamente cuando quieras!**`, ephemeral: true });
            break;
            
        case 'close':
            // Solo el creador puede cerrar
            const creatorId = queue[0];
            if (userId !== creatorId && !interaction.member.permissions.has('Administrator')) {
                return interaction.reply({ content: '❌ **SOLO EL CREADOR O ADMINISTRADOR** ❌\n\n🛡️ Solo quien creó la fila puede cerrarla\n⚔️ O un administrador del servidor\n🔒 **¡Protege las filas!**', ephemeral: true });
            }
            
            // Cerrar la fila PÚBLICAMENTE
            const warningEmbed = createWarningEmbed('close', `<@${userId}>`);
            await interaction.reply({ embeds: [warningEmbed] });
            
            // Limpiar fila
            queues.delete(gameMode);
            const queueMessage = queueMessages.get(gameMode);
            if (queueMessage) {
                await queueMessage.delete();
                queueMessages.delete(gameMode);
            }
            return;
    }
    
    // Actualizar mensaje después de la acción
    const queueMessage = queueMessages.get(gameMode);
    if (queueMessage) {
        const updatedEmbed = createQueueEmbed(queues, gameMode);
        const updatedButtons = createQueueButtons(queues, gameMode);
        await queueMessage.edit({ embeds: [updatedEmbed], components: updatedButtons });
    }
    
    // Verificar si la fila está llena después de entrar
    if (action === 'enter' && queue.length >= maxPlayers) {
        // Enviar mensaje de "¡Partida Iniciada!" PÚBLICO
        await interaction.followUp({ content: `🏆 **¡PARTIDA INICIADA!** 🏆\n\n⚔️ ¡Fila ${gameMode} completa!\n🔥 ¡Todos los jugadores fueron notificados!\n🎮 **¡Que comience el juego!**` });
        
        const successEmbed = createSuccessEmbed(gameMode);
        await queueMessage.reply({ embeds: [successEmbed] });
        
        // Limpiar fila
        queues.delete(gameMode);
        queueMessages.delete(gameMode);
    }
});

// Iniciar el bot
client.login(process.env.DISCORD_TOKEN);