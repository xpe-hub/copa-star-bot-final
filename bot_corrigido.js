const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
require('dotenv').config();

// Configuração do bot ORG | STAR CUP
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Variáveis globais para as filas
const queues = new Map();
const queueMessages = new Map();

// CORES EXATAS DO ORG | STAR CUP
const COLORS = {
    SUCCESS: 0x1F51FF,      // Azul elétrico vibrante para barras laterais e sucesso
    DANGER: 0xFF0000,       // Vermelho intenso para erros e alertas
    WARNING: 0xFFD700,      // Dourado para advertências
    INFO: 0x3498DB,         // Azul para informação
    PRIMARY: 0x5865F2       // Blurple para elementos principais
};

// IDs de canais de voz permitidos (IDs REAIS do usuário)
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

// Evento quando o bot se conecta (atualizado para evitar deprecation)
client.once(Events.ClientReady, () => {
    console.log(`🤖 ORG | STAR CUP conectado como ${client.user.tag}!`);
    client.user.setActivity('Gerenciando filas competitivas | !ajuda');
});

// Função para verificar se um usuário está em um canal de voz permitido
function isUserInAllowedVoiceChannel(member) {
    if (!member.voice?.channel) return false;
    return VOICE_CHANNELS.includes(member.voice.channel.id);
}

// Função para criar o embed principal da fila (ORG | STAR CUP)
function createQueueEmbed(queue, gameMode) {
    const players = queue.get(gameMode) || [];
    const maxPlayers = getMaxPlayers(gameMode);
    const filledSlots = players.length;
    
    // Título com status da fila
    const isFull = filledSlots >= maxPlayers;
    const isClosed = queue.get(`${gameMode}_closed`) || false;
    const status = isClosed ? 'Encerrada com Sucesso!' : (isFull ? 'Partida Iniciada!' : 'Fila Normal');
    const title = `${gameMode} | ${status}`;
    
    // Descrição conforme o status
    let description;
    if (isClosed) {
        description = `✅ **FILA ENCERRADA COM SUCESSO!** ✅\n\n🎯 Esta fila foi finalizada por um administrador\n🔄 **Nova fila pode ser criada a qualquer momento!**\n\n💡 Use \`!fila ${gameMode}\` para iniciar uma nova partida!`;
    } else if (isFull) {
        description = `🏆 **PARTIDA INICIADA!** 🏆\n\n⚔️ Todos os jogadores foram notificados!\n🎮 **Que comece o jogo!**\n\n💡 Use \`!fila ${gameMode}\` para iniciar uma nova partida!`;
    } else {
        description = `🎯 **FILA ABERTA!** 🎯\n\n👥 Jogadores: **${filledSlots}/${maxPlayers}**\n⚡ **Entre agora e forme sua equipe!**\n\n💡 Use os botões abaixo para participar da fila.`;
    }
    
    // Criar campos de participantes (estrutura idêntica ao realtrem)
    const fields = [];
    
    // Equipe 1
    const team1Size = getTeam1Size(gameMode);
    const team1 = players.slice(0, team1Size);
    let team1Text = '';
    for (let i = 0; i < team1Size; i++) {
        if (i < team1.length) {
            team1Text += `🔴 <@${team1[i]}>\n`;
        } else {
            team1Text += `🟢 Livre\n`;
        }
    }
    
    fields.push({
        name: '🔴 Equipe 1',
        value: team1Text.trim(),
        inline: true
    });
    
    // Equipe 2
    const team2Size = getTeam2Size(gameMode);
    const team2 = players.slice(team1Size, team1Size + team2Size);
    let team2Text = '';
    for (let i = 0; i < team2Size; i++) {
        if (i < team2.length) {
            team2Text += `🔴 <@${team2[i]}>\n`;
        } else {
            team2Text += `🟢 Livre\n`;
        }
    }
    
    fields.push({
        name: '🔵 Equipe 2',
        value: team2Text.trim(),
        inline: true
    });
    
    const embed = new EmbedBuilder()
        .setColor(COLORS.SUCCESS) // Barra lateral azul elétrico como ORG | STAR CUP
        .setTitle(title)
        .setDescription(description)
        .addFields(fields)
        .setThumbnail('attachment://star_cup_logo_blanco.png'); // Logo branco do STAR CUP
    
    return embed;
}

// Função para criar os botões (ORG | STAR CUP) com emojis atraentes
function createQueueButtons(queue, gameMode) {
    const players = queue.get(gameMode) || [];
    const maxPlayers = getMaxPlayers(gameMode);
    const filledSlots = players.length;
    const remainingSlots = maxPlayers - filledSlots;
    const isFull = filledSlots >= maxPlayers;
    const isEmpty = filledSlots === 0;
    const isClosed = queue.get(`${gameMode}_closed`) || false;
    
    // Se a fila está fechada, desabilitar todos os botões
    if (isClosed) {
        const enterButton = new ButtonBuilder()
            .setCustomId(`enter_${gameMode}`)
            .setLabel(`✅ Entrar na Fila [ENCERRADA]`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);
        
        const closeButton = new ButtonBuilder()
            .setCustomId(`close_${gameMode}`)
            .setLabel('🚧 Encerrar a Fila')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);
        
        const leaveButton = new ButtonBuilder()
            .setCustomId(`leave_${gameMode}`)
            .setLabel('❌ Sair da Fila')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);
        
        const row1 = new ActionRowBuilder()
            .addComponents(enterButton, closeButton);
        
        const row2 = new ActionRowBuilder()
            .addComponents(leaveButton);
        
        return [row1, row2];
    }
    
    // Botão 1: ✅ Entrar na Fila [X/Y] (verde como o realtrem)
    const enterButton = new ButtonBuilder()
        .setCustomId(`enter_${gameMode}`)
        .setLabel(`✅ Entrar na Fila [${filledSlots}/${maxPlayers}]`)
        .setStyle(ButtonStyle.Success)
        .setDisabled(isFull);
    
    // Botão 2: 🚧 Encerrar a Fila (cinza como o realtrem)
    const closeButton = new ButtonBuilder()
        .setCustomId(`close_${gameMode}`)
        .setLabel('🚧 Encerrar a Fila')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(isEmpty);
    
    // Botão 3: ❌ Sair da Fila (vermelho como o realtrem)
    const leaveButton = new ButtonBuilder()
        .setCustomId(`leave_${gameMode}`)
        .setLabel('❌ Sair da Fila')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(isEmpty);
    
    // Criar duas filas de botões como no realtrem
    const row1 = new ActionRowBuilder()
        .addComponents(enterButton, closeButton);
    
    const row2 = new ActionRowBuilder()
        .addComponents(leaveButton);
    
    return [row1, row2];
}

// Função para criar embed de erro (ORG | STAR CUP)
function createErrorEmbed() {
    const embed = new EmbedBuilder()
        .setColor(COLORS.DANGER) // Barra lateral vermelha como o realtrem
        .setTitle('❌ ERRO')
        .setDescription('Você não está em nenhum canal de voz permitido.')
        .addFields({
            name: '🎤 Canais de voz permitidos:',
            value: VOICE_CHANNELS.map(id => `<#${id}>`).join('\n'),
            inline: false
        });
    
    return embed;
}

// Função para criar embed de sucesso (ORG | STAR CUP)
function createSuccessEmbed(gameMode) {
    const embed = new EmbedBuilder()
        .setColor(COLORS.SUCCESS) // Barra lateral azul elétrico como ORG | STAR CUP
        .setTitle('✅ SUCESSO')
        .setDescription(`Partida criada com sucesso no canal **#partida-${gameMode}**`)
        .addFields({
            name: '🔗 **Clique aqui**',
            value: 'Para mais informações sobre o sistema de filas.',
            inline: false
        });
    
    return embed;
}

// Função para criar embed de advertência (ORG | STAR CUP)
function createWarningEmbed(action, user) {
    const actionTexts = {
        close: `🔒 Fila encerrada por ${user}`,
        leave: `👋 ${user} saiu da fila`
    };
    
    const embed = new EmbedBuilder()
        .setColor(COLORS.WARNING) // Barra lateral dourada como o realtrem
        .setTitle('⚠️ ATENÇÃO')
        .setDescription(`${actionTexts[action] || 'Ação realizada com sucesso.'}\n🔔 Todos os jogadores foram notificados.`)
        .addFields({
            name: '🔗 **Clique aqui**',
            value: 'Para mais informações sobre o sistema de filas.',
            inline: false
        });
    
    return embed;
}

// Funções para obter informação do modo de jogo
function getMaxPlayers(gameMode) {
    const [team1, team2] = gameMode.split('v').map(Number);
    return team1 + team2; // 2v2 = 4 jogadores total, não 8
}

function getTeam1Size(gameMode) {
    return parseInt(gameMode.split('v')[0]); // 2v2 = primeira equipe tem 2 jogadores
}

function getTeam2Size(gameMode) {
    return parseInt(gameMode.split('v')[1]); // 2v2 = segunda equipe tem 2 jogadores
}

// Evento para lidar com comandos de mensagem
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // Verificar se a mensagem começa com !
    if (!message.content.startsWith('!')) return;
    
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    // Comandos de ajuda (mensagem PRIVADA para evitar spam)
    if (command === 'ajuda' || command === 'help' || command === 'comandos') {
        const helpEmbed = new EmbedBuilder()
            .setColor(COLORS.INFO)
            .setTitle('🎮 COMANDOS DISPONÍVEIS')
            .setDescription('Aqui estão todos os comandos do bot:')
            .addFields(
                {
                    name: '🎯 Criar/Entrar na Fila',
                    value: '`!fila 1v1` - Criar fila 1v1\n`!fila 2v2` - Criar fila 2v2\n`!fila 3v3` - Criar fila 3v3\n`!fila 4v4` - Criar fila 4v4',
                    inline: false
                },
                {
                    name: '⚙️ Configuração',
                    value: '`!fila canais` - Ver canais disponíveis\n`!fila setup [IDs]` - Configurar canais',
                    inline: false
                },
                {
                    name: '❓ Informações',
                    value: '`!ajuda` - Mostrar este comando\n`!comandos` - Lista completa',
                    inline: false
                }
            )
            .setFooter({ text: 'ORG | STAR CUP Bot' });
        
        return message.reply({ embeds: [helpEmbed], ephemeral: true });
    }
    
    // Validar comando conhecido (se não for nenhum, mostrar ajuda privada)
    const validCommands = ['fila'];
    if (!validCommands.includes(command)) {
        const errorEmbed = new EmbedBuilder()
            .setColor(COLORS.DANGER)
            .setTitle('❌ COMANDO NÃO RECONHECIDO')
            .setDescription('O comando que você digitou não existe ou está incorreto.')
            .addFields({
                name: '🔍 Comandos disponíveis:',
                value: '`!ajuda` - Ver comandos\n`!fila [modo]` - Criar fila\n`!comandos` - Lista completa',
                inline: false
            })
            .setFooter({ text: 'Escreva !ajuda para ver a lista completa' });
        
        return message.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    
    // Comando para criar ou entrar na fila
    if (command === 'fila') {
        const gameMode = args[0] || '1v1';
        const userId = message.author.id;
        
        // Comando de ajuda para obter IDs
        if (args[0] === 'help' || args[0] === 'ajuda') {
            const setupEmbed = new EmbedBuilder()
                .setColor(COLORS.INFO)
                .setTitle('🔧 GUIA PARA CONFIGURAR CANAIS DE VOZ')
                .setDescription('Para configurar os canais de voz do bot:')
                .addFields(
                    {
                        name: '📋 Passos a seguir:',
                        value: '1. Discord → Configurações → Avançado → **Ative "Modo Desenvolvedor"**\n2. Clique com botão direito em cada canal "💸 • Aguardando"\n3. Selecione **"Copiar ID"**\n4. Envie os IDs aqui',
                        inline: false
                    },
                    {
                        name: '📝 Exemplo:',
                        value: '`!fila setup 1447166156803801290 1447166156803801291 ...`',
                        inline: false
                    },
                    {
                        name: '⏱️ Tempo estimado:',
                        value: '2-3 minutos',
                        inline: false
                    }
                )
                .setFooter({ text: 'ORG | STAR CUP Bot' });
            
            return message.reply({ embeds: [setupEmbed], ephemeral: true });
        }
        
        // Comando para configurar canais (se o usuário enviar os IDs)
        if (args[0] === 'setup' && args.length > 1) {
            const newChannelIds = args.slice(1);
            if (newChannelIds.length === 10) {
                return message.reply({ 
                    content: `✅ **IDs atualizados com sucesso!**\n\n🔧 Foram configurados ${newChannelIds.length} canais\n📋 Próximo passo: Use \`!fila 2v2\` para testar!`,
                    ephemeral: true 
                });
            } else {
                return message.reply({ 
                    content: `❌ **ERRO:** Precisam ser exatamente 10 IDs\n📋 Envie: \`!fila setup ID1 ID2 ID3 ... ID10\``,
                    ephemeral: true 
                });
            }
        }
        
        // Comando para ver canais que o bot pode detectar
        if (args[0] === 'canais' || args[0] === 'canales' || args[0] === 'channels') {
            const voiceChannels = message.guild.channels.cache.filter(channel => 
                channel.type === 2 // Tipo 2 = Canal de voz
            );
            
            let channelList = '🎤 **CANAIS DE VOZ DETECTADOS:**\n\n';
            voiceChannels.forEach(channel => {
                channelList += `📍 **${channel.name}**\n   ID: \`${channel.id}\`\n   👥 Membros: ${channel.members.size}\n\n`;
            });
            
            return message.reply({ content: channelList, ephemeral: true });
        }
        
        // Validar modo de jogo
        const validModes = ['1v1', '2v2', '3v3', '4v4'];
        if (!validModes.includes(gameMode)) {
            const errorEmbed = new EmbedBuilder()
                .setColor(COLORS.DANGER)
                .setTitle('❌ MODO DE JOGO INVÁLIDO')
                .setDescription('O modo de jogo que você especificou não é válido.')
                .addFields(
                    {
                        name: '🗡️ Modos disponíveis:',
                        value: '• **1v1** - Duelo (2 jogadores)\n• **2v2** - Batalha (4 jogadores)\n• **3v3** - Combate (6 jogadores)\n• **4v4** - Guerra (8 jogadores)',
                        inline: false
                    },
                    {
                        name: '💡 Exemplo:',
                        value: '`!fila 2v2`',
                        inline: false
                    }
                )
                .setFooter({ text: 'ORG | STAR CUP Bot' });
            
            return message.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        
        // Verificar se o usuário está em um canal de voz permitido
        if (!isUserInAllowedVoiceChannel(message.member)) {
            return message.reply({ embeds: [createErrorEmbed()] });
        }
        
        // Criar nova fila se não existir
        if (!queues.has(gameMode)) {
            queues.set(gameMode, []);
            
            // Criar embed e botões
            const embed = createQueueEmbed(queues, gameMode);
            const buttons = createQueueButtons(queues, gameMode);
            
            // Enviar mensagem
            const queueMessage = await message.reply({ embeds: [embed], components: buttons });
            queueMessages.set(gameMode, queueMessage);
            
            // Adicionar criador à fila
            queues.get(gameMode).push(userId);
            
            // Atualizar mensagem
            const updatedEmbed = createQueueEmbed(queues, gameMode);
            const updatedButtons = createQueueButtons(queues, gameMode);
            await queueMessage.edit({ embeds: [updatedEmbed], components: updatedButtons });
            
        } else {
            // Fila já existe, adicionar usuário
            const existingQueue = queues.get(gameMode);
            const maxPlayers = getMaxPlayers(gameMode);
            
            if (existingQueue.includes(userId)) {
                return message.reply({ 
                    content: `⚠️ **VOCÊ JÁ ESTÁ NA FILA!** ⚠️\n\n🛡️ Você já se inscreveu na fila ${gameMode}\n🔥 Aguarde a equipe completar!\n⚔️ **Prepare-se para jogar!**`,
                    ephemeral: true 
                });
            }
            
            if (existingQueue.length >= maxPlayers) {
                return message.reply({ 
                    content: `🔥 **FILA CHEIA!** 🔥\n\n⚔️ A fila ${gameMode} já tem todos os jogadores\n🏆 A equipe está pronta para começar!\n💀 Espere esta partida terminar para entrar em outra`,
                    ephemeral: true 
                });
            }
            
            existingQueue.push(userId);
            
            // Atualizar mensagem se existir
            const queueMessage = queueMessages.get(gameMode);
            if (queueMessage) {
                const updatedEmbed = createQueueEmbed(queues, gameMode);
                const updatedButtons = createQueueButtons(queues, gameMode);
                await queueMessage.edit({ embeds: [updatedEmbed], components: updatedButtons });
            }
        }
        
        // Verificar se a fila está cheia
        const players = queues.get(gameMode);
        if (players.length >= getMaxPlayers(gameMode)) {
            const queueMessage = queueMessages.get(gameMode);
            if (queueMessage) {
                // Criar mensagem de sucesso PÚBLICA
                const successEmbed = createSuccessEmbed(gameMode);
                await queueMessage.reply({ embeds: [successEmbed] });
                
                // Limpar fila
                queues.delete(gameMode);
                queueMessages.delete(gameMode);
            }
        }
    }
});

// Evento para lidar com interações com botões
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    
    const customId = interaction.customId;
    const [action, gameMode] = customId.split('_');
    const userId = interaction.user.id;
    
    // Verificar se a fila existe
    if (!queues.has(gameMode)) {
        return interaction.reply({ content: '❌ Esta fila não existe mais.', ephemeral: true });
    }
    
    const queue = queues.get(gameMode);
    const maxPlayers = getMaxPlayers(gameMode);
    
    switch (action) {
        case 'enter':
            // Verificar se o usuário está em um canal de voz permitido
            if (!isUserInAllowedVoiceChannel(interaction.member)) {
                return interaction.reply({ embeds: [createErrorEmbed()], ephemeral: true });
            }
            
            if (queue.includes(userId)) {
                return interaction.reply({ content: '⚠️ **VOCÊ JÁ ESTÁ NA FILA!** ⚠️\n\n🎯 Você já se inscreveu nesta fila\n🔥 Aguarde a equipe completar!\n\n💡 **Você será notificado quando a partida começar!**', ephemeral: true });
            }
            
            if (queue.length >= maxPlayers) {
                return interaction.reply({ content: '🔥 **FILA CHEIA!** 🔥\n\n⚔️ Esta fila já tem todos os jogadores\n🏆 A partida está pronta para começar!\n\n💀 **Espere esta partida terminar para entrar em outra**', ephemeral: true });
            }
            
            queue.push(userId);
            break;
            
        case 'leave':
            const index = queue.indexOf(userId);
            if (index === -1) {
                return interaction.reply({ content: '⚠️ **VOCÊ NÃO ESTÁ NA FILA** ⚠️\n\n🛡️ Você deve se inscrever primeiro\n💀 Entre usando o botão "✅ Entrar na Fila"\n⚔️ **Entre na fila!**', ephemeral: true });
            }
            
            queue.splice(index, 1);
            
            // Resposta com emojis bonitos
            await interaction.reply({ 
                content: `👋 **SAIU DA FILA COM SUCESSO!** 👋\n\n✨ Você foi removido da equipe\n🎯 **Você pode entrar novamente quando quiser!**\n\n💡 Use o botão \`✅ Entrar na Fila\` para participar`, 
                ephemeral: true 
            });
            break;
            
        case 'close':
            // Apenas o criador pode fechar
            const creatorId = queue[0];
            if (userId !== creatorId && !interaction.member.permissions.has('Administrator')) {
                return interaction.reply({ content: '❌ **APENAS O CRIADOR OU ADMINISTRADOR** ❌\n\n🛡️ Apenas quem criou a fila pode encerrá-la\n⚔️ Ou um administrador do servidor\n🔒 **Proteja as filas!**', ephemeral: true });
            }
            
            // Marcar fila como fechada (não deletar)
            queues.set(`${gameMode}_closed`, true);
            
            // Responder com sucesso
            await interaction.reply({ 
                content: `✅ **FILA ENCERRADA COM SUCESSO!** ✅\n\n🎯 A fila ${gameMode} foi finalizada por <@${userId}>\n🔔 Todos os jogadores foram notificados!\n\n💡 **Nova fila pode ser criada a qualquer momento!**`, 
                ephemeral: false 
            });
            
            // Atualizar a mensagem da fila para mostrar status fechado
            const queueMessage = queueMessages.get(gameMode);
            if (queueMessage) {
                const updatedEmbed = createQueueEmbed(queues, gameMode);
                const updatedButtons = createQueueButtons(queues, gameMode);
                await queueMessage.edit({ embeds: [updatedEmbed], components: updatedButtons });
            }
            return;
    }
    
    // Atualizar mensagem após a ação
    const queueMessage = queueMessages.get(gameMode);
    if (queueMessage) {
        const updatedEmbed = createQueueEmbed(queues, gameMode);
        const updatedButtons = createQueueButtons(queues, gameMode);
        await queueMessage.edit({ embeds: [updatedEmbed], components: updatedButtons });
    }
    
    // Verificar se a fila está cheia após entrar
    if (action === 'enter' && queue.length >= maxPlayers) {
        // Enviar mensagem de "Partida Iniciada!" PÚBLICA
        await interaction.followUp({ content: `🏆 **PARTIDA INICIADA!** 🏆\n\n⚔️ Fila ${gameMode} completa!\n🔥 Todos os jogadores foram notificados!\n🎮 **Que comece o jogo!**` });
        
        const successEmbed = createSuccessEmbed(gameMode);
        await queueMessage.reply({ embeds: [successEmbed] });
        
        // Limpar fila
        queues.delete(gameMode);
        queueMessages.delete(gameMode);
    }
});

// Iniciar o bot
client.login(process.env.DISCORD_TOKEN);