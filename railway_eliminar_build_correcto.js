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

// Get project services from railway.com
async function getProjectServices() {
  console.log('🔍 Obteniendo servicios del proyecto...');
  
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
      return services;
    } else {
      console.log('❌ Error:', response.body);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  return null;
}

// Update service build command
async function updateServiceBuildCommand(serviceId, buildCommand) {
  console.log(`🔧 Actualizando build command para servicio ${serviceId}...`);
  
  const options = {
    hostname: 'railway.com',
    path: `/api/v2/services/${serviceId}`,
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  const data = JSON.stringify({
    buildCommand: buildCommand  // null para eliminar
  });

  try {
    const response = await makeRequest(options, data);
    console.log('📊 Status:', response.statusCode);
    
    if (response.statusCode === 200) {
      const result = JSON.parse(response.body);
      console.log('✅ Build command actualizado:', result);
      return true;
    } else {
      console.log('❌ Error:', response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Trigger deployment
async function triggerDeployment(serviceId) {
  console.log(`🚀 Disparando deploy para servicio ${serviceId}...`);
  
  const options = {
    hostname: 'railway.com',
    path: `/api/v2/services/${serviceId}/deployments`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options);
    console.log('📊 Status:', response.statusCode);
    
    if (response.statusCode === 200 || response.statusCode === 201) {
      const result = JSON.parse(response.body);
      console.log('✅ Deploy iniciado:', result);
      return true;
    } else {
      console.log('❌ Error:', response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🎯 ELIMINANDO CUSTOM BUILD COMMAND');
  console.log('=' * 60);
  
  try {
    // Step 1: Get project services
    const services = await getProjectServices();
    if (!services || !services.services || services.services.length === 0) {
      console.log('❌ No se encontraron servicios');
      return;
    }
    
    const service = services.services[0];
    console.log('📋 Servicio encontrado:', service.name);
    console.log('🔧 Build Command actual:', service.buildCommand || '(vacío)');
    
    // Step 2: Update service to remove build command
    const updated = await updateServiceBuildCommand(service.id, null);
    if (!updated) {
      console.log('❌ No se pudo actualizar el servicio');
      return;
    }
    
    // Step 3: Trigger deployment
    const deployed = await triggerDeployment(service.id);
    if (!deployed) {
      console.log('❌ No se pudo disparar el deploy');
      return;
    }
    
    console.log('\n🎉 PROCESO COMPLETADO');
    console.log('=' * 60);
    console.log('✅ Custom Build Command eliminado');
    console.log('✅ Redeploy manual iniciado');
    console.log('\n📱 SIGUIENTE PASO:');
    console.log('   Ve a Railway → Proyecto "striking-transformation"');
    console.log('   → Ve a la sección "Deploys"');
    console.log('   → Espera a que termine el deploy');
    console.log('   → Envíame screenshots de los logs del build');
    console.log('\n🔍 Los logs deben mostrar "Detected Node.js app" en lugar de Python');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Run the script
main();