# Configuración RealTREM - Copa Star Bot
# IDs reales del servidor ORG | APOS STAR $

# IDs de roles del servidor (por nombre)
SERVER_CONFIG = {
    'creator_id': '751601149928538224',  # Creador del servidor
    'partidas_ranked_category_id': '1448062717318533150',  # Categoría PARTIDAS RANKED
    'partidas_channel_id': '1448083864537796638'  # Canal de texto #partidas
}

# Canales de voz de juego (#1-7, ambos times)
GAME_CHANNELS = {
    'time_1': {
        '1': '1448073607355043983',
        '2': '1448076094388437153', 
        '3': '1448076611659235338',
        '4': '1448077277652062370',
        '5': '1448077939735527574',
        '6': '1448078712859000892',
        '7': '1448079693201801388'
    },
    'time_2': {
        '1': '1448074209107378236',
        '2': '1448076353596428338',
        '3': '1448076828114817034', 
        '4': '1448077524520407142',
        '5': '1448078184737411166',
        '6': '1448078949727994047',
        '7': '1448080044034621560'
    }
}

# Canales de voz de espera ("aguardando")
AWAITING_CHANNELS = [
    '1447054233709838488',  # aguardando 1
    '1447507397110140991',  # aguardando 2
    '1447507470065991793',  # aguardando 3
    '1447507531676123187',  # aguardando 4
    '1447507587368091710',  # aguardando 5
    '1447507703709696122',  # aguardando 6
    '1447507785603485728',  # aguardando 7
    '1447507869728772228',  # aguardando 8
    '1447507925911474309',  # aguardando 9
    '1447507992701309110'   # aguardando 10
]

# Nombres para display
CHANNEL_NAMES = {
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
}

# Función para obtener un número de sala único
def get_available_room_number():
    """Retorna un número único para la sala (1-999)"""
    import random
    return random.randint(1, 999)

# Función para verificar si es creador
def is_creator(user_id):
    return str(user_id) == SERVER_CONFIG['creator_id']

# Función para obtener el siguiente canal disponible
def get_next_available_channel():
    """Retorna el siguiente número de canal disponible"""
    # Por simplicidad, retornamos el próximo número disponible
    # En implementación real, verificaríamos qué canales están libres
    return 1  # Por ahora siempre 1

# Detección de patrones de ID/contraseña de sala
import re

def detect_room_data(message_content):
    """
    Detecta si el mensaje contiene datos de sala en formato RealTREM
    Formato esperado: "12345678 / 12" o "12345678/12" o "12345678 - 12"
    """
    # Patrones para detectar ID/contraseña
    patterns = [
        r'(\d{6,8})\s*[/\-]\s*(\d{1,4})',  # 12345678 / 12
        r'(\d{6,8})\s*(\d{1,4})',          # 1234567812 (sin separador)
    ]
    
    for pattern in patterns:
        match = re.search(pattern, message_content)
        if match:
            room_id = match.group(1)
            password = match.group(2)
            return {
                'room_id': room_id,
                'password': password,
                'found': True
            }
    
    return {'found': False}

# Mensajes del sistema RealTREM
REALTREM_MESSAGES = {
    'auto_move_success': '✅ **MOVIMENTAÇÃO AUTOMÁTICA REALIZADA!**\n\n🎮 A partida #{room_number} foi criada com sucesso!\n\n👥 **Jogadores movidos:**\nTeam 1: {team1_players}\nTeam 2: {team2_players}\n\n🔒 **Canais criados:**\n🔒 #{room_number} - Time 1\n🔒 #{room_number} - Time 2\n\n🎯 **Instruções:**\n• Aguardem a criação da sala pelo Staff\n• Quando a sala for criada, os dados serão enviados automaticamente\n• Se houver problemas, avisem @everyone',
    
    'room_data_detected': '✅ **A SALA FOI CRIADA!**\n\n📋 **Dados da sala para copiar:**\n\n↪ **ID da Sala:** {room_id}\n↪ **Senha:** {password}\n\n👥 **Jogadores da partida #{room_number}:**\n{player_list}\n\n🎯 **Times:**\n**Time 1:** {team1_list}\n**Time 2:** {team2_list}\n\n📌 **Mensagem fixada no canal da partida!**',
    
    'room_data_copy_button': 'Copiar ID e Senha',
    'room_data_copied': '✅ **ID e Senha copiados com sucesso!**',
    
    'captain_selection': '👑 **SELEÇÃO DE CAPITÃES**\n\n👥 **Jogadores para selecionar:**\n{player_list}\n\n🎯 **Time 1 - Escolha {captain_count} jogadores:**',
    
    'captain_selected': '👑 **{player_name}** foi selecionado para o **Time {team_number}**!'
}

# Sistema de threading automático
async def create_match_thread(bot, channel, room_number, game_mode, players):
    """Cria thread privado para a partida"""
    try:
        thread = await channel.create_thread(
            name=f'🎮 Partida #{room_number} - {game_mode}',
            type=discord.ChannelType.private_thread,
            invitable=False
        )
        return thread
    except Exception as e:
        print(f'Erro ao criar thread: {e}')
        return None

# Sistema de auto-movimento
async def auto_move_players(bot, room_number, team1_players, team2_players):
    """Move automaticamente os jogadores para os canais de voz"""
    try:
        # Obter canais de destino
        time1_channel = await bot.get_channel(int(GAME_CHANNELS['time_1'][str(room_number)]))
        time2_channel = await bot.get_channel(int(GAME_CHANNELS['time_2'][str(room_number)]))
        
        if not time1_channel or not time2_channel:
            print('Erro: Canais de destino não encontrados')
            return False
            
        # Mover jogadores do Team 1
        for player_data in team1_players:
            member = await bot.guilds[0].fetch_member(int(player_data['id']))
            if member and member.voice:
                await member.move_to(time1_channel)
                
        # Mover jogadores do Team 2  
        for player_data in team2_players:
            member = await bot.guilds[0].fetch_member(int(player_data['id']))
            if member and member.voice:
                await member.move_to(time2_channel)
                
        return True
    except Exception as e:
        print(f'Erro no movimento automático: {e}')
        return False

# Sistema de roles
ROLES = {
    'admin': 'ADMIN',
    'moderador': 'MODERADOR', 
    'suporte': 'SUPORTE',
    'capitao': 'CAPITAO'
}

def has_permission(user, required_role):
    """Verifica se o usuário tem a permissão necessária"""
    # Implementação básica - em produção seria mais complexa
    if is_creator(user.id):
        return True
    
    # Verificar roles do usuário
    for role in user.roles:
        if role.name.upper() in [ROLES[role_type].upper() for role_type in ROLES]:
            return True
    
    return False