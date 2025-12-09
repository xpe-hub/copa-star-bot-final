#!/usr/bin/env node

const https = require('https');

const API_TOKEN = '09f803fc-8522-4bff-bb40-b5a3682f1448';
const PROJECT_ID = 'striking-transformation';

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        }).on('error', reject);
    });
}

async function monitorBot() {
    console.log('🤖 Monitoreando estado del bot...\n');
    
    try {
        // Check project status
        const projectData = await makeRequest(`https://railway.app/api/v2/projects/${PROJECT_ID}`);
        
        if (projectData && !projectData.error) {
            console.log(`📊 Proyecto: ${projectData.name}`);
            console.log(`🟢 Estado: ${projectData.status}`);
            
            // Check deployments
            const deploymentsData = await makeRequest(`https://railway.app/api/v2/deployments?projectId=${PROJECT_ID}`);
            
            if (deploymentsData.deployments && deploymentsData.deployments.length > 0) {
                const latest = deploymentsData.deployments[0];
                console.log(`📦 Deployment activo: ${latest.status}`);
                console.log(`📅 Creado: ${new Date(latest.createdAt).toLocaleString()}`);
                
                // Check for success indicators
                if (latest.status === 'success' || latest.status === 'running') {
                    console.log('✅ ¡Bot debería estar funcionando!');
                    console.log('🎯 Cambios aplicados:');
                    console.log('   • Color rojo #ED4245 para errores');
                    console.log('   • Formato correcto de mensajes de error');
                    console.log('   • Emojis ❌ para títulos de error');
                } else {
                    console.log(`⏳ Status: ${latest.status} - Esperando...`);
                }
            }
        } else {
            console.log('⚠️  No se pudo acceder al proyecto vía API');
            console.log('💡 Esto es normal - revisa el dashboard manualmente');
        }
        
        console.log('\n🔗 Enlaces útiles:');
        console.log(`   Dashboard: https://railway.app/project/${PROJECT_ID}`);
        console.log(`   GitHub: https://github.com/xpe-hub/copa-star-bot-final`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run monitoring
monitorBot();