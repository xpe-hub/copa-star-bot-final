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
                    resolve(data); // Return raw data if not JSON
                }
            });
        }).on('error', reject);
    });
}

async function checkDeployment() {
    try {
        console.log('🔍 Verificando estado del deployment en Railway...\n');
        
        // Check recent deployments
        const deploymentsData = await makeRequest(`https://railway.app/api/v2/deployments?projectId=${PROJECT_ID}`);
        
        if (deploymentsData.deployments && deploymentsData.deployments.length > 0) {
            const latest = deploymentsData.deployments[0];
            console.log(`📦 Deployment más reciente:`);
            console.log(`   ID: ${latest.id}`);
            console.log(`   Estado: ${latest.status}`);
            console.log(`   Commit: ${latest.commit?.substring(0, 7) || 'N/A'}`);
            console.log(`   Creado: ${new Date(latest.createdAt).toLocaleString()}`);
            
            // Try to get logs if available
            if (latest.id) {
                console.log('\n📜 Obteniendo logs...');
                try {
                    const logsData = await makeRequest(`https://railway.app/api/v2/deployments/${latest.id}/logs`);
                    if (logsData && typeof logsData === 'string') {
                        console.log('📋 Logs más recientes:');
                        const lines = logsData.split('\n').slice(-20); // Last 20 lines
                        lines.forEach(line => {
                            if (line.trim()) {
                                console.log(`   ${line}`);
                            }
                        });
                    } else {
                        console.log('   📋 Logs no disponibles vía API');
                    }
                } catch (logError) {
                    console.log('   📋 Logs no disponibles (API limit)');
                }
            }
        } else {
            console.log('❌ No se encontraron deployments');
        }

        console.log('\n✅ Verificación completada');
        console.log('💡 Railway debería detectar automáticamente los cambios de GitHub');
        console.log('🎯 Los cambios incluyen: color rojo exacto #ED4245 y formato correcto de errores');

    } catch (error) {
        console.error('❌ Error al verificar:', error.message);
    }
}

checkDeployment();