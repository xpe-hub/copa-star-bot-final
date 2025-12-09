const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Events } = require('discord.js');
const { readFileSync, writeFileSync, existsSync } = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Configuração global
const COLORS = {
    primary: 0x1E90FF,  // Azul como debe ser
    success: 0x4CAF50,
    warning: 0xFF9800,
    error: 0xED4245,   // Rojo exacto para mensajes de error
    info: 0x2196F3
};

// Emojis personalizados do servidor
const CUSTOM_EMOJIS = {
    microphone: '🎤', // Emoji do microfone (será colorido via CSS se for personalizado)
    volume: '🔊' // Emoji padrão do altavoz
};

// Lista de canais de voz permitidos (IDs reais do seu servidor)
const VOICE_CHANNELS = [
    '1447054233709838488', // aguardando 1
    '1447507397110140991', // aguardando 2
    '1447507470065991793', // aguardando 3
    '1447507531676123187', // aguardando 4
    '1447507587368091710', // aguardando 5
    '1447507703709696122', // aguardando 6
    '1447507785603485728', // aguardando 7
    '1447507869728772228', // aguardando 8
    '1447507925911474309', // aguardando 9
    '1447507992701309110'  // aguardando 10
];

// Mapa de nomes dos canais para exibição
const CHANNEL_NAMES = {
    '1447054233709838488': 'aguardando 1',
    '1447507397110140991': 'aguardando 2',
    '1447507470065991793': 'aguardando 3',
    '1447507531676123187': 'aguardando 4',
    '1447507587368091710': 'aguardando 5',
    '1447507703709696122': 'aguardando 6',
    '1447507785603485728': 'aguardando 7',
    '1447507869728772228': 'aguardando 8',
    '1447507925911474309': 'aguardando 9',
    '1447507992701309110': 'aguardando 10'
};

// Mapa para armazenar filas e mensagens de fila
const queues = new Map();
const queueMessages = new Map();

// Sistema de status dinâmico do bot
const botStatus = [
    '🎮 Dominando filas',
    '⚔️ Organizando partidas',
    '🚀 Conectando jogadores',
    '🏆 Gerenciando Copa Star',
    '⭐ Criando experiências'
];

let statusIndex = 0;

// Função para alterar status do bot
function updateBotStatus() {
    const status = botStatus[statusIndex];
    client.user.setPresence({
        activities: [{ name: status, type: 0 }],
        status: 'online'
    });
    statusIndex = (statusIndex + 1) % botStatus.length;
}

// Função para criar embed da fila
function createQueueEmbed(gameMode, isClosed = false) {
    const queue = queues.get(gameMode) || { players: [], teams: [[], []] };
    const isFull = queue.players.length >= (gameMode === '2v2' ? 4 : 2);
    const isEmpty = queue.players.length === 0;
    
    let status = '';
    let description = '';
    
    if (isClosed) {
        status = '🚫 Cerrada con Éxito!';
        description = 'Esta fila fue cerrada con éxito. Espera a que se cree una nueva fila.';
    } else if (isFull) {
        status = '🎯 Partida Iniciada!';
        description = 'Partida em progresso. Todos os jogadores devem ir ao canal de voz.';
    } else if (isEmpty) {
        status = '⏳ Aguardando Jogadores';
        description = `Fila vazia para **${gameMode}**. Use os botões abaixo para entrar na fila.`;
    } else {
        status = '🔥 Fila Normal';
        description = `Jogadores na fila: **${queue.players.length}/${gameMode === '2v2' ? 4 : 2}**`;
    }

    // Generate player list with proper empty slots
    let playerList = '';
    if (gameMode === '2v2') {
        const teamAPlayers = queue.teams[0].map(p => `🔴 ${p.username || `<@${p.id}>`}`);
        const teamBPlayers = queue.teams[1].map(p => `🔴 ${p.username || `<@${p.id}>`}`);
        
        // Fill empty slots for Team A
        while (teamAPlayers.length < 2) {
            teamAPlayers.push('🟢 Livre');
        }
        
        // Fill empty slots for Team B  
        while (teamBPlayers.length < 2) {
            teamBPlayers.push('🟢 Livre');
        }
        
        playerList = `**Equipe A (${queue.teams[0].length}/2):**\n${teamAPlayers.join('\n')}\n\n**Equipe B (${queue.teams[1].length}/2):**\n${teamBPlayers.join('\n')}`;
    } else {
        const players = queue.players.map(p => `🔴 ${p.username || `<@${p.id}>`}`);
        while (players.length < 2) {
            players.push('🟢 Livre');
        }
        playerList = `**Jogadores (${queue.players.length}/2):**\n${players.join('\n')}`;
    }

    const embed = new EmbedBuilder()
        .setColor(COLORS.primary)
        .setTitle(`🎮 Copa Star - Fila ${gameMode}`)
        .setDescription(description)
        .addFields([
            {
                name: status,
                value: playerList,
                inline: false
            }
        ])
        .setThumbnail('attachment://star_cup_logo_blanco.jpeg')
        .setTimestamp()
        .setFooter({ 
            text: 'Bot Copa Star • Sistema de Filas Automático', 
            iconURL: 'https://i.imgur.com/AfFp7pu.png' 
        });

    return embed;
}

// Função para criar botões da fila
function createQueueButtons(gameMode, isClosed = false) {
    const queue = queues.get(gameMode) || { players: [], teams: [[], []] };
    const isFull = queue.players.length >= (gameMode === '2v2' ? 4 : 2);
    
    const row = new ActionRowBuilder();
    
    // Botão entrar na fila
    row.addComponents(
        new ButtonBuilder()
            .setCustomId(`join_${gameMode}`)
            .setLabel('Entrar na Fila')
            .setStyle(ButtonStyle.Success)
            .setEmoji('➕')
            .setDisabled(isFull)
    );

    // Botón salir de la fila
    row.addComponents(
        new ButtonBuilder()
            .setCustomId(`leave_${gameMode}`)
            .setLabel('Sair da Fila')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('➖')
            .setDisabled(isClosed || isFull || isEmpty(queue.players))
    );

    // Botón cerrar fila
    row.addComponents(
        new ButtonBuilder()
            .setCustomId(`close_${gameMode}`)
            .setLabel('Encerrar a Fila')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🚧')
            .setDisabled(isClosed || isFull || isEmpty(queue.players))
    );

    return [row];
}

function isEmpty(arr) {
    return !arr || arr.length === 0;
}

// Função para verificar se usuário está em canal de voz permitido
async function isUserInAllowedVoiceChannel(user) {
    // Verificar se o usuário está em um servidor
    if (!user.guild) return false;
    
    const member = await user.guild.members.fetch(user.id);
    if (!member.voice.channel) return false;
    
    const channelId = member.voice.channel.id;
    return VOICE_CHANNELS.includes(channelId);
}

// Função para buscar nome do canal de voz
async function getVoiceChannelName(channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        return channel ? channel.name : 'Canal Desconhecido';
    } catch {
        return 'Canal Desconhecido';
    }
}

// Função para verificar se usuário já está em alguma fila
function isUserInAnyQueue(userId) {
    for (const [gameMode, queue] of queues.entries()) {
        if (queue.players.some(p => p.id === userId)) {
            return gameMode;
        }
    }
    return null;
}

// Evento quando bot está pronto
client.once('ClientReady', () => {
    console.log(`🤖 ${client.user.tag} está online!`);
    
    // Atualizar status do bot a cada 30 segundos
    updateBotStatus();
    setInterval(updateBotStatus, 30000);
    
    // Definir status inicial
    client.user.setPresence({
        activities: [{ name: botStatus[0], type: 0 }],
        status: 'online'
    });
});

// Evento de interação (botões)
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    const gameMode = interaction.customId.split('_')[1];
    const userId = interaction.user.id;
    const username = interaction.user.username;

    try {
        // Verificar si el usuario ya está en otra fila
        const userInQueue = isUserInAnyQueue(userId);
        if (userInQueue && userInQueue !== gameMode) {
            await interaction.reply({
                content: `❌ **Você já está na fila ${userInQueue}!**\n\nPrimeiro saia da fila atual usando os botões ou aguarde para que termine a partida.`,
                ephemeral: true
            });
            return;
        }

        // Verificar se usuário está em canal de voz permitido
        const inVoiceChannel = await isUserInAllowedVoiceChannel(interaction.user);
        if (!inVoiceChannel && interaction.customId.startsWith('join_')) {
            const allowedChannels = [];
            for (const channelId of VOICE_CHANNELS) {
                const channelName = await getVoiceChannelName(channelId);
                allowedChannels.push(`• ${channelName}`);
            }

            await interaction.reply({
                embeds: [{
                    color: COLORS.error,
                    title: `${CUSTOM_EMOJIS.microphone} ERRO`,
                    description: '**Você não está em nenhum canal de voz permitido!**\n\n📢 **Canais permitidos:**\n' + allowedChannels.join('\n') + '\n\n🎮 **Entre em um canal de voz e tente novamente.**',
                    timestamp: new Date()
                }],
                ephemeral: true
            });
            return;
        }

        // Lógica para entrar na fila
        if (interaction.customId.startsWith('join_')) {
            const queue = queues.get(gameMode) || { players: [], teams: [[], []] };
            
            // Verificar se a fila está fechada
            if (queues.get(`${gameMode}_closed`)) {
                await interaction.reply({
                    content: '❌ **Esta fila está fechada!**\n\nAguarde uma nova fila ser criada.',
                    ephemeral: true
                });
                return;
            }

            // Verificar se já está na fila
            if (queue.players.some(p => p.id === userId)) {
                await interaction.reply({
                    content: 'ℹ️ **Você já está nesta fila!**',
                    ephemeral: true
                });
                return;
            }

            // Verificar se a fila está cheia
            const maxPlayers = gameMode === '2v2' ? 4 : 2;
            if (queue.players.length >= maxPlayers) {
                await interaction.reply({
                    content: '❌ **Fila cheia!**\n\nAguarde a próxima partida.',
                    ephemeral: true
                });
                return;
            }

            // Adicionar à fila
            queue.players.push({ id: userId, username: username });
            
            // Lógica para 2v2 (dividir em equipes)
            if (gameMode === '2v2') {
                if (queue.teams[0].length < 2) {
                    queue.teams[0].push({ id: userId, username: username });
                } else if (queue.teams[1].length < 2) {
                    queue.teams[1].push({ id: userId, username: username });
                }
            }

            queues.set(gameMode, queue);

            // Atualizar embed da fila
            await updateQueueMessage(interaction.channel, gameMode);

            await interaction.reply({
                content: '✅ **Você entrou na fila com sucesso!**\n\n🎮 Use os botões para gerenciar sua participação.',
                ephemeral: true
            });

            // Se a fila ficou cheia, iniciar partida
            if (queue.players.length >= maxPlayers) {
                await startMatch(interaction, gameMode, queue);
            }
        }

        // Lógica para sair da fila
        else if (interaction.customId.startsWith('leave_')) {
            const queue = queues.get(gameMode);
            if (!queue) {
                await interaction.reply({
                    content: '❌ **Esta fila não existe!**',
                    ephemeral: true
                });
                return;
            }

            const playerIndex = queue.players.findIndex(p => p.id === userId);
            if (playerIndex === -1) {
                await interaction.reply({
                    content: 'ℹ️ **Você não está nesta fila!**',
                    ephemeral: true
                });
                return;
            }

            // Remover da fila
            queue.players.splice(playerIndex, 1);
            
            // Remover dos times (para 2v2)
            if (gameMode === '2v2') {
                queue.teams[0] = queue.teams[0].filter(p => p.id !== userId);
                queue.teams[1] = queue.teams[1].filter(p => p.id !== userId);
            }

            queues.set(gameMode, queue);

            // Atualizar embed da fila
            await updateQueueMessage(interaction.channel, gameMode);

            await interaction.reply({
                content: '👋 **Você saiu da fila com sucesso!**',
                ephemeral: true
            });
        }

        // Lógica para fechar fila
        else if (interaction.customId.startsWith('close_')) {
            queues.set(`${gameMode}_closed`, true);
            
            // Atualizar embed da fila
            await updateQueueMessage(interaction.channel, gameMode);

            await interaction.reply({
                content: '🚧 **Fila encerrada com sucesso!**',
                ephemeral: true
            });
        }

    } catch (error) {
        console.error('Erro na interação:', error);
        await interaction.reply({
            content: '❌ **Ocorreu um erro ao processar sua solicitação.**',
            ephemeral: true
        });
    }
});

// Função para atualizar mensagem da fila
async function updateQueueMessage(channel, gameMode) {
    try {
        const messageId = queueMessages.get(gameMode);
        if (messageId) {
            const message = await channel.messages.fetch(messageId);
            const isClosed = queues.get(`${gameMode}_closed`) || false;
            
            await message.edit({
                embeds: [createQueueEmbed(gameMode, isClosed)],
                components: createQueueButtons(gameMode, isClosed)
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar mensagem da fila:', error);
    }
}

// Função para iniciar partida
async function startMatch(interaction, gameMode, queue) {
    try {
        // Criar thread para a partida
        const thread = await interaction.channel.threads.create({
            name: `🎮 Partida ${gameMode} - ${new Date().toLocaleDateString()}`,
            type: 11, // Private thread
            invitable: false
        });

        // Mensagem pública de sucesso
        await interaction.channel.send({
            embeds: [{
                color: COLORS.success,
                title: '🎯 PARTIDA CRIADA COM SUCESSO!',
                description: `✅ A partida de **${gameMode}** foi criada com sucesso!\n\n🎮 **Canal da partida:** <#${thread.id}>\n👥 **Jogadores:** ${queue.players.length}\n⏰ **Data:** ${new Date().toLocaleString('pt-BR')}`,
                timestamp: new Date()
            }]
        });

        // Mensagem privada no thread com instruções
        await thread.send({
            content: `🎮 **Bem-vindos à partida ${gameMode}!**\n\n👥 **Jogadores confirmados:**\n${queue.players.map(p => `• ${p.username}`).join('\n')}\n\n📋 **Instruções:**\n1. ✅ Todos devem estar nos canais de voz correspondentes\n2. 🎯 Quando terminar, avisem aqui no chat\n3. 📢 Para reportar problemas, mencionem @everyone\n\n🚀 **Que comecem os jogos!**`,
            embeds: [{
                color: COLORS.info,
                title: '🏆 Detalhes da Partida',
                fields: [
                    { name: '🎮 Modo de Jogo', value: gameMode, inline: true },
                    { name: '👥 Jogadores', value: `${queue.players.length}`, inline: true },
                    { name: '⏰ Criado em', value: new Date().toLocaleString(), inline: false }
                ],
                timestamp: new Date()
            }]
        });

        // Limpar fila após criar partida
        queues.delete(gameMode);
        queueMessages.delete(gameMode);

    } catch (error) {
        console.error('Erro ao criar partida:', error);
        await interaction.channel.send({
            embeds: [{
                color: COLORS.error,
                title: '❌ ERRO AO CRIAR PARTIDA',
                description: 'Ocorreu um erro ao criar o canal da partida. Tente novamente.',
                timestamp: new Date()
            }]
        });
    }
}

// Evento de comando slash
client.on(Events.MessageCreate, async message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'fila') {
        const gameMode = args[0] || '1v1';
        
        if (!['1v1', '2v2'].includes(gameMode)) {
            await message.reply({
                content: '❌ **Modo inválido!**\n\nUse: `!fila 1v1` ou `!fila 2v2`',
                ephemeral: true
            });
            return;
        }

        // VERIFICAR CANAL DE VOZ - CORREÇÃO CRÍTICA
        const isInVoiceChannel = await isUserInAllowedVoiceChannel(message.author);
        if (!isInVoiceChannel) {
            const allowedChannelsList = VOICE_CHANNELS.map(id => `<#${id}>`).join('\n');
            await message.reply({
                embeds: [{
                    color: COLORS.error,
                    title: `${CUSTOM_EMOJIS.microphone} ERRO`,
                    description: `❌ **Você não está em nenhum canal de voz permitido!**\n\n📢 **Canais permitidos:**\n${allowedChannelsList}\n\n🎮 **Entre em um canal de voz e tente novamente.**`,
                    timestamp: new Date()
                }],
                ephemeral: true
            });
            return;
        }

        // Verificar si ya existe una fila
        if (queues.has(gameMode) && !queues.get(`${gameMode}_closed`)) {
            await message.reply({
                content: 'ℹ️ **Ya existe una fila activa!**\n\nUsa los botones en el mensaje de la fila para participar.',
                ephemeral: true
            });
            return;
        }

        // Criar nova fila
        queues.set(gameMode, { players: [], teams: [[], []] });
        queues.delete(`${gameMode}_closed`);

        // Enviar embed da fila
        const queueMessage = await message.channel.send({
            embeds: [createQueueEmbed(gameMode)],
            components: createQueueButtons(gameMode)
        });

        // Salvar referência da mensagem
        queueMessages.set(gameMode, queueMessage.id);

        await message.reply({
            content: '✅ **Fila criada com sucesso!**\n\nUse os botões acima para gerenciar a fila.',
            ephemeral: true
        });
    }
});

// Iniciar o bot
client.login(process.env.DISCORD_TOKEN);