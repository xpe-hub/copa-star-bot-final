#!/usr/bin/env node

/**
 * 🤖 Copa Star Bot - Automatización Railway.app
 * Script de automatización completa para deployment y gestión
 */

const { exec } = require('child_process');
const fs = require('fs');

class RailwayBotManager {
    constructor() {
        this.token = process.env.RAILWAY_TOKEN || '';
        this.projectId = '';
        this.serviceId = '';
    }

    async runCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) reject(error);
                else resolve(stdout);
            });
        });
    }

    async checkRailwayCLI() {
        try {
            await this.runCommand('railway --version');
            console.log('✅ Railway CLI instalado');
            return true;
        } catch (error) {
            console.log('❌ Railway CLI no encontrado, instalando...');
            await this.runCommand('npm install -g @railway/cli');
            console.log('✅ Railway CLI instalado');
            return true;
        }
    }

    async login() {
        console.log('🔐 Iniciando sesión en Railway...');
        await this.runCommand('railway login');
        console.log('✅ Sesión iniciada');
    }

    async createProject() {
        console.log('🏗️ Creando proyecto...');
        try {
            await this.runCommand('railway init');
        } catch (error) {
            console.log('ℹ️ Proyecto ya existe, obteniendo ID...');
        }
    }

    async setEnvironmentVariables() {
        console.log('🔧 Configurando variables de entorno...');
        
        const variables = {
            DISCORD_TOKEN: 'MTQ0NzE1NTEyMTAxNTIyNjQyOQ.GB_Q8y.jRVb0hZn9DziEaOQv4WtQiyJneEtMq3hmrl8xQ',
            NODE_ENV: 'production',
            PORT: '3000'
        };

        for (const [key, value] of Object.entries(variables)) {
            await this.runCommand(`railway variables set ${key}="${value}"`);
            console.log(`✅ ${key} configurado`);
        }
    }

    async connectGitHub() {
        console.log('🔗 Conectando repositorio GitHub...');
        const repoUrl = 'https://github.com/xpe-hub/copa-star-bot-v3-clean';
        try {
            await this.runCommand(`railway github link "${repoUrl}" --create`);
            console.log('✅ GitHub conectado');
        } catch (error) {
            console.log('ℹ️ GitHub ya conectado o no se puede vincular');
        }
    }

    async deploy() {
        console.log('🚀 Iniciando deployment...');
        const output = await this.runCommand('railway up');
        console.log('✅ Deployment iniciado');
        console.log(output);
    }

    async restart() {
        console.log('🔄 Reiniciando bot...');
        await this.runCommand('railway restart');
        console.log('✅ Bot reiniciado');
    }

    async status() {
        console.log('📊 Obteniendo estado del proyecto...');
        const output = await this.runCommand('railway status');
        console.log(output);
    }

    async logs() {
        console.log('📋 Obteniendo logs...');
        const output = await this.runCommand('railway logs');
        console.log(output);
    }

    async fullDeploy() {
        console.log('🤖 Copa Star Bot - Deploy Completo Railway');
        console.log('==========================================');
        
        try {
            await this.checkRailwayCLI();
            await this.login();
            await this.createProject();
            await this.setEnvironmentVariables();
            await this.connectGitHub();
            await this.deploy();
            
            console.log('\n🎉 ¡DEPLOY COMPLETADO!');
            console.log('⚡ Bot estará online en 2-3 minutos');
            console.log('📊 Dashboard: railway.app/dashboard');
            
        } catch (error) {
            console.error('❌ Error durante deploy:', error.message);
            process.exit(1);
        }
    }
}

// Ejecutar deploy si se llama directamente
if (require.main === module) {
    const manager = new RailwayBotManager();
    manager.fullDeploy();
}

module.exports = RailwayBotManager;