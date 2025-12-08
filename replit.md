# ORG | STAR CUP BOT

## Overview
This is a Discord bot for managing competitive game queues, inspired by REALTREM. The bot allows players to join queues for different game modes (1v1, 2v2, 3v3, 4v4) and automatically forms teams when enough players have joined.

**Project Type:** Discord Bot (Node.js)  
**Main Language:** JavaScript (Node.js 20)  
**Framework:** Discord.js v14  
**Status:** Ready to run (needs Discord token)

## Recent Changes
- **2024-12-08**: Initial setup in Replit environment
  - Installed Node.js 20 and all dependencies (discord.js, dotenv)
  - Configured workflow to run the bot
  - Set up environment for Discord bot token

## Project Architecture

### File Structure
```
.
├── bot.js                    # Main bot file with all logic
├── guia_ids_canales.js      # Guide for obtaining Discord channel IDs
├── package.json             # Node.js dependencies
├── README.md                # Project documentation
└── .env                     # Environment variables (DISCORD_TOKEN)
```

### Key Components
- **Queue System**: Manages player queues for different game modes
- **Voice Channel Verification**: Only allows players in specific voice channels to join queues
- **Interactive Buttons**: Players can join, leave, or close queues using Discord buttons
- **Embed Messages**: Rich Discord embeds styled with ORG | STAR CUP branding (green neon colors)

### Dependencies
- `discord.js` (v14.14.1): Discord API library
- `dotenv` (v16.3.1): Environment variable management

## Configuration

### Required Environment Variables
- `DISCORD_TOKEN`: Your Discord bot token (stored as secret)

### Voice Channels
The bot is pre-configured with 10 voice channel IDs. These can be updated in `bot.js` in the `VOICE_CHANNELS` array (lines 29-40).

## Commands
- `!fila help` - Display help guide
- `!fila canais` - List all detected voice channels and their IDs
- `!fila 1v1` - Create/join a 1v1 queue (2 players)
- `!fila 2v2` - Create/join a 2v2 queue (4 players)
- `!fila 3v3` - Create/join a 3v3 queue (6 players)
- `!fila 4v4` - Create/join a 4v4 queue (8 players)

## Features
- ✅ Automatic queue management (1v1, 2v2, 3v3, 4v4)
- ✅ Voice channel verification
- ✅ Interactive buttons for queue actions
- ✅ Real-time notifications
- ✅ Portuguese language interface
- ✅ Green neon branding (#00FF00)

## How to Run
1. Set up your Discord bot token in Replit Secrets
2. Click the "Run" button - the bot will start automatically
3. The bot will connect to Discord and be ready to manage queues

## User Preferences
None specified yet.

## Notes
- This is a backend Discord bot - no frontend/web interface
- The bot must remain running to respond to Discord commands
- Players must be in one of the configured voice channels to join queues
