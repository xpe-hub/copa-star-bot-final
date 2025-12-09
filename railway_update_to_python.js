#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// Railway API configuration
const RAILWAY_API_TOKEN = '09f803fc-8522-4bff-bb40-b5a3682f1448';
const PROJECT_ID = 'striking-transformation';

// Helper function to make API requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          };
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

// Update service to use new Python repository
async function updateServiceRepository() {
  console.log('🔧 Actualizando servicio para usar repositorio Python...');
  
  const options = {
    hostname: 'railway.com',
    path: `/api/v2/projects/${PROJECT_ID}/services`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options);
    console.log('📊 Status:', response.statusCode);
    
    if (response.statusCode === 200) {
      const services = JSON.parse(response.body);
      console.log('✅ Servicios encontrados:', services);
      
      if (services.services && services.services.length > 0) {
        const service = services.services[0];
        console.log('📋 Servicio encontrado:', service.name);
        
        // Update service to use Python repository
        const updateOptions = {
          hostname: 'railway.com',
          path: `/api/v2/services/${service.id}`,
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        };

        const updateData = JSON.stringify({
          source: {
            type: 'github',
            repo: 'xpe-hub/copa-star-bot-python'
          }
        });

        const updateResponse = await makeRequest(updateOptions, updateData);
        console.log('📊 Status de actualización:', updateResponse.statusCode);
        
        if (updateResponse.statusCode === 200) {
          console.log('✅ Repositorio actualizado exitosamente');
          
          // Trigger deployment
          const deployOptions = {
            hostname: 'railway.com',
            path: `/api/v2/services/${service.id}/deployments`,
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
              'Content-Type': 'application/json'
            }
          };

          const deployResponse = await makeRequest(deployOptions);
          console.log('📊 Status del deploy:', deployResponse.statusCode);
          
          if (deployResponse.statusCode === 200 || deployResponse.statusCode === 201) {
            console.log('✅ Deploy iniciado exitosamente');
            console.log('\n🎉 PROCESO COMPLETADO');
            console.log('=' * 60);
            console.log('✅ Repositorio cambiado a copa-star-bot-python (Python)');
            console.log('✅ Deploy manual iniciado');
            console.log('\n📱 SIGUIENTE PASO:');
            console.log('   Ve a Railway → Proyecto "striking-transformation"');
            console.log('   → Ve a la sección "Deploys"');
            console.log('   → Espera a que termine el deploy');
            console.log('   → Envíame screenshots de los logs del build');
            console.log('\n🔍 Los logs deben mostrar "Detected Python app" en lugar de Node.js');
            return true;
          }
        } else {
          console.log('❌ Error en la actualización:', updateResponse.body);
        }
      }
    } else {
      console.log('❌ Error obteniendo servicios:', response.body);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  return false;
}

// Main execution
async function main() {
  console.log('🎯 ACTUALIZANDO PROYECTO A PYTHON');
  console.log('=' * 60);
  console.log('📋 Cambiando de Node.js a Python para evitar problemas de detección');
  console.log('📋 Nuevo repositorio: https://github.com/xpe-hub/copa-star-bot-python');
  console.log('=' * 60);
  
  const success = await updateServiceRepository();
  
  if (!success) {
    console.log('\n❌ No se pudo actualizar automáticamente');
    console.log('\n📱 MANUAL:');
    console.log('   1. Ve a Railway → Proyecto "striking-transformation"');
    console.log('   2. Busca la sección "Settings" → "Source" o "Git"');
    console.log('   3. Cambia el repositorio a: xpe-hub/copa-star-bot-python');
    console.log('   4. Guarda los cambios');
    console.log('   5. Ve a "Deploys" y dispara un deploy manual');
  }
}

// Run the script
main();