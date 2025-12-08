const { Client, GatewayIntentBits, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Estado de las colas
const queues = {
    '1v1': [],
    '2v2': [],
    '3v3': [],
    '4v4': [],
    '5v5': []
};

// Cuando el bot esté listo
client.once('ready', () => {
    console.log('🚀 Copa Star Bot está online!');
    console.log(`Bot logueado como ${client.user.tag}`);
    console.log(`Bot ID: ${client.user.id}`);
    console.log(`Serving ${client.guilds.cache.size} servers`);
});

// Manejo de mensajes
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    const args = message.content.toLowerCase().split(' ');
    const command = args[0];

    // Comandos principales
    if (command === '!entrar' || command === '!entrar1v1' || command === '!entrar1') {
        await joinQueue(message, '1v1');
    } else if (command === '!entrar2v2' || command === '!entrar2') {
        await joinQueue(message, '2v2');
    } else if (command === '!entrar3v3' || command === '!entrar3') {
        await joinQueue(message, '3v3');
    } else if (command === '!entrar4v4' || command === 'entrar4') {
        await joinQueue(message, '4v4');
    } else if (command === '!entrar5v5' || command === '!entrar5') {
        await joinQueue(message, '5v5');
    } else if (command === '!sair' || command === '!salir' || command === '!exit') {
        await leaveQueue(message);
    } else if (command === '!fila' || command === '!queue') {
        await showQueue(message);
    } else if (command === '!limpar' || command === '!clear') {
        await clearQueue(message, args[1]);
    }
});

// Función para unirse a la cola
async function joinQueue(message, mode) {
    const userId = message.author.id;
    const username = message.author.username;
    
    // Verificar si ya está en alguna cola
    for (const queueMode in queues) {
        if (queues[queueMode].includes(userId)) {
            return message.reply(`❌ Você já está na fila ${queueMode}! Use !sair para sair.`);
        }
    }
    
    // Agregar a la cola
    queues[mode].push(userId);
    
    // Crear embed
    const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🎮 Copa Star Bot - Fila')
        .setDescription(`✅ **${username}** entrou na fila ${mode}!`)
        .addFields(
            { name: 'Fila atual:', value: getQueueDisplay(mode), inline: true },
            { name: 'Slots disponíveis:', value: `${queues[mode].length}/${mode.replace('v', '').replace('v', '')}`, inline: true }
        )
        .setTimestamp();
    
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`join_${mode}`)
                .setLabel('Entrar')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`leave_${mode}`)
                .setLabel('Sair')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`show_${mode}`)
                .setLabel('Ver Fila')
                .setStyle(ButtonStyle.Primary)
        );
    
    await message.reply({ embeds: [embed], components: [row] });
}

// Función para salir de la cola
async function leaveQueue(message) {
    const userId = message.author.id;
    let found = false;
    
    for (const mode in queues) {
        const index = queues[mode].indexOf(userId);
        if (index !== -1) {
            queues[mode].splice(index, 1);
            found = true;
            
            const embed = new EmbedBuilder()
                .setColor('#FF6B6B')
                .setTitle('🎮 Copa Star Bot - Saída da Fila')
                .setDescription(`👋 **${message.author.username}** saiu da fila ${mode}!`)
                .addFields(
                    { name: 'Fila atual:', value: getQueueDisplay(mode), inline: true },
                    { name: 'Slots disponíveis:', value: `${queues[mode].length}/${mode.replace('v', '').replace('v', '')}`, inline: true }
                )
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
            break;
        }
    }
    
    if (!found) {
        message.reply('❌ Você não está em nenhuma fila!');
    }
}

// Función para mostrar la cola
async function showQueue(message) {
    let response = '📊 **Fila Atual:**\n\n';
    
    for (const mode in queues) {
        if (queues[mode].length > 0) {
            const display = getQueueDisplay(mode);
            response += `**${mode}:** ${display}\n`;
        }
    }
    
    if (response === '📊 **Fila Atual:**\n\n') {
        response = '❌ Nenhuma fila ativa no momento!';
    }
    
    const embed = new EmbedBuilder()
        .setColor('#1E90FF')
        .setTitle('🎮 Copa Star Bot - Status')
        .setDescription(response)
        .setTimestamp();
    
    await message.reply({ embeds: [embed] });
}

// Función para limpiar cola
async function clearQueue(message, mode) {
    if (!mode) {
        // Limpiar todas las colas
        for (const queueMode in queues) {
            queues[queueMode] = [];
        }
        message.reply('🧹 Todas as filas foram limpas!');
    } else {
        // Limpiar cola específica
        if (queues[mode]) {
            queues[mode] = [];
            message.reply(`🧹 Fila ${mode} foi limpa!`);
        } else {
            message.reply('❌ Modo de fila inválido!');
        }
    }
}

// Función auxiliar para mostrar la cola
function getQueueDisplay(mode) {
    const queue = queues[mode];
    if (queue.length === 0) return '🟢 Livre';
    
    const maxSlots = parseInt(mode.replace('v', '').replace('v', ''));
    const availableSlots = maxSlots - queue.length;
    
    let display = `**${queue.length}/${maxSlots}**`;
    if (availableSlots > 0) {
        display += ` (${availableSlots} 🟢 Livre)`;
    }
    
    return display;
}

// Manejo de interacciones (botones)
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    const [action, mode] = interaction.customId.split('_');
    const userId = interaction.user.id;
    const username = interaction.user.username;
    
    if (action === 'join') {
        // Verificar si ya está en alguna cola
        for (const queueMode in queues) {
            if (queues[queueMode].includes(userId)) {
                return interaction.reply({ 
                    content: `❌ Você já está na fila ${queueMode}!`, 
                    ephemeral: true 
                });
            }
        }
        
        // Agregar a la cola
        queues[mode].push(userId);
        
        // Actualizar embed
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🎮 Copa Star Bot - Fila')
            .setDescription(`✅ **${username}** entrou na fila ${mode}!`)
            .addFields(
                { name: 'Fila atual:', value: getQueueDisplay(mode), inline: true },
                { name: 'Slots disponíveis:', value: `${queues[mode].length}/${mode.replace('v', '').replace('v', '')}`, inline: true }
            )
            .setTimestamp();
        
        await interaction.update({ embeds: [embed] });
        
    } else if (action === 'leave') {
        const index = queues[mode].indexOf(userId);
        if (index !== -1) {
            queues[mode].splice(index, 1);
            
            const embed = new EmbedBuilder()
                .setColor('#FF6B6B')
                .setTitle('🎮 Copa Star Bot - Saída da Fila')
                .setDescription(`👋 **${username}** saiu da fila ${mode}!`)
                .addFields(
                    { name: 'Fila atual:', value: getQueueDisplay(mode), inline: true },
                    { name: 'Slots disponíveis:', value: `${queues[mode].length}/${mode.replace('v', '').replace('v', '')}`, inline: true }
                )
                .setTimestamp();
            
            await interaction.update({ embeds: [embed] });
        } else {
            interaction.reply({ content: '❌ Você não está nesta fila!', ephemeral: true });
        }
        
    } else if (action === 'show') {
        const display = getQueueDisplay(mode);
        const embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setTitle(`🎮 Fila ${mode}`)
            .setDescription(display)
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
});

// Iniciar el bot
const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error('❌ DISCORD_TOKEN no está configurado!');
    process.exit(1);
}

client.login(token).catch(error => {
    console.error('❌ Error al conectar el bot:', error);
    process.exit(1);
});