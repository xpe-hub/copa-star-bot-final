// Script para hacer redeploy manual en Railway
const https = require('https');

// Configuración
const RAILWAY_API_TOKEN = '09f803fc-8522-4bff-bb40-b5a3682f1448';
const PROJECT_ID = 'striking-transformation'; // Del contexto previo

function makeRailwayRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'railway.app',
            port: 443,
            path: endpoint,
            method: method,
            headers: {
                'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve({
                        statusCode: res.statusCode,
                        data: response
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        data: body
                    });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function redeployProject() {
    console.log('🚀 Iniciando redeploy manual en Railway...');
    console.log('📊 Proyecto:', PROJECT_ID);
    
    try {
        // Primero verificar el estado del proyecto
        console.log('\n📋 Verificando estado del proyecto...');
        const projectResponse = await makeRailwayRequest(`/v2/project/${PROJECT_ID}`);
        console.log('Estado del proyecto:', projectResponse.statusCode);
        
        if (projectResponse.statusCode === 200) {
            console.log('✅ Proyecto encontrado y accesible');
            
            // Obtener servicios del proyecto
            console.log('\n🔍 Obteniendo servicios del proyecto...');
            const servicesResponse = await makeRailwayRequest(`/v2/project/${PROJECT_ID}/services`);
            console.log('Estado de servicios:', servicesResponse.statusCode);
            
            if (servicesResponse.statusCode === 200 && servicesResponse.data.services) {
                const services = servicesResponse.data.services;
                console.log(`📦 Encontrados ${services.length} servicios:`);
                
                for (const service of services) {
                    console.log(`  - ${service.name} (${service.id})`);
                    
                    // Hacer deploy de cada servicio
                    console.log(`\n🚀 Iniciando deploy para: ${service.name}`);
                    const deployResponse = await makeRailwayRequest(
                        `/v2/service/${service.id}/deploy`, 
                        'POST'
                    );
                    
                    console.log(`📤 Deploy iniciado para ${service.name}:`, deployResponse.statusCode);
                    
                    if (deployResponse.statusCode === 200) {
                        console.log(`✅ Deploy iniciado exitosamente para ${service.name}`);
                        console.log(`🔗 Deploy ID: ${deployResponse.data.deploy?.id || 'N/A'}`);
                    } else {
                        console.log(`❌ Error iniciando deploy para ${service.name}:`, deployResponse.data);
                    }
                }
            } else {
                console.log('❌ No se pudieron obtener los servicios:', servicesResponse.data);
            }
        } else {
            console.log('❌ Error accediendo al proyecto:', projectResponse.data);
        }
        
        // Verificar deployments recientes
        console.log('\n📊 Verificando deployments recientes...');
        try {
            const deploymentsResponse = await makeRailwayRequest(`/v2/project/${PROJECT_ID}/deploys`);
            console.log('Estado de deployments:', deploymentsResponse.statusCode);
            
            if (deploymentsResponse.statusCode === 200 && deploymentsResponse.data.deployments) {
                const deployments = deploymentsResponse.data.deployments.slice(0, 3);
                console.log('📈 Últimos 3 deployments:');
                deployments.forEach((deploy, index) => {
                    console.log(`  ${index + 1}. ${deploy.status} - ${deploy.createdAt} (${deploy.id})`);
                });
            }
        } catch (e) {
            console.log('⚠️ No se pudieron obtener deployments recientes:', e.message);
        }
        
    } catch (error) {
        console.error('❌ Error durante el redeploy:', error.message);
    }
    
    console.log('\n✅ Proceso de redeploy completado');
    console.log('🔗 Revisa el dashboard de Railway para ver el progreso: https://railway.app/dashboard');
}

// Ejecutar el script
redeployProject();