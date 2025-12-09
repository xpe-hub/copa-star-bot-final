const https = require('https');

const RAILWAY_TOKEN = '09f803fc-8522-4bff-bb40-b5a3682f1448';
const PROJECT_ID = 'striking-transformation';

function makeRequest(url, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'railway.app',
            port: 443,
            path: url,
            method: method,
            headers: {
                'Authorization': `Bearer ${RAILWAY_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Node.js'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`Status: ${res.statusCode}`);
                console.log(`Response: ${data}`);
                resolve({ status: res.statusCode, data: data });
            });
        });

        req.on('error', (error) => {
            console.error('Error:', error);
            reject(error);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

async function redeployProject() {
    console.log('🎯 Iniciando redeploy en Railway...');
    
    try {
        // Método 1: Trigger deployment
        const result1 = await makeRequest('/api/2/projects/striking-transformation/deployments', 'POST', {
            environment: 'production'
        });
        
        console.log('✅ Deploy triggerado exitosamente');
        console.log('Resultado:', result1);
        
        // Método 2: Obtener estado del proyecto
        setTimeout(async () => {
            console.log('📊 Verificando estado del proyecto...');
            const result2 = await makeRequest('/api/2/projects/striking-transformation');
            console.log('Estado del proyecto:', result2);
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error durante el redeploy:', error);
        
        // Método alternativo: Manual trigger
        console.log('\n🔧 Método alternativo:');
        console.log('1. Ve a: https://railway.app/project/striking-transformation');
        console.log('2. Haz clic en "Deployments"');
        console.log('3. Haz clic en "Deploy" o "Redeploy"');
    }
}

redeployProject();