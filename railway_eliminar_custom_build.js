#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// Railway API configuration
const RAILWAY_API_TOKEN = '09f803fc-8522-4bff-bb40-b5a3682f1448';
const PROJECT_ID = 'striking-transformation';
const BASE_URL = 'railway.app';

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

// Step 1: Get project details to find service ID
async function getProjectDetails() {
  console.log('🔍 Buscando detalles del proyecto...');
  
  const options = {
    hostname: BASE_URL,
    path: `/api/v2/query/graphql`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RAILWAY_API_TOKEN}`
    }
  };

  const query = `
    query GetProject($id: String!) {
      project(id: $id) {
        id
        name
        services {
          nodes {
            id
            name
            buildCommand
          }
        }
      }
    }
  `;

  const data = JSON.stringify({
    query,
    variables: { id: PROJECT_ID }
  });

  try {
    const response = await makeRequest(options, data);
    console.log('📊 Respuesta del proyecto:', response.statusCode);
    
    if (response.statusCode === 200) {
      const result = JSON.parse(response.body);
      console.log('✅ Proyecto encontrado:', result.data?.project?.name);
      
      if (result.data?.project?.services?.nodes?.length > 0) {
        const service = result.data.project.services.nodes[0];
        console.log('📋 Servicio encontrado:', service.name);
        console.log('🔧 Build Command actual:', service.buildCommand || '(vacío)');
        return service;
      }
    } else {
      console.log('❌ Error:', response.body);
    }
  } catch (error) {
    console.error('❌ Error obteniendo detalles:', error);
  }
  
  return null;
}

// Step 2: Update service to remove build command
async function updateService(serviceId) {
  console.log('🔧 Actualizando servicio para eliminar Custom Build Command...');
  
  const options = {
    hostname: BASE_URL,
    path: `/api/v2/query/graphql`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RAILWAY_API_TOKEN}`
    }
  };

  const query = `
    mutation UpdateService($serviceId: String!, $buildCommand: String) {
      updateService(
        serviceId: $serviceId
        buildCommand: $buildCommand
      ) {
        id
        name
        buildCommand
      }
    }
  `;

  const data = JSON.stringify({
    query,
    variables: { 
      serviceId: serviceId,
      buildCommand: null  // Esto elimina el comando
    }
  });

  try {
    const response = await makeRequest(options, data);
    console.log('📊 Respuesta de actualización:', response.statusCode);
    
    if (response.statusCode === 200) {
      const result = JSON.parse(response.body);
      console.log('✅ Build Command eliminado:', result.data?.updateService?.buildCommand || '(vacío)');
      return true;
    } else {
      console.log('❌ Error:', response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Error actualizando servicio:', error);
    return false;
  }
}

// Step 3: Trigger manual deployment
async function triggerDeployment(serviceId) {
  console.log('🚀 Disparando redeploy manual...');
  
  const options = {
    hostname: BASE_URL,
    path: `/api/v2/query/graphql`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RAILWAY_API_TOKEN}`
    }
  };

  const query = `
    mutation DeployService($serviceId: String!) {
      deployService(serviceId: $serviceId) {
        id
        status
      }
    }
  `;

  const data = JSON.stringify({
    query,
    variables: { serviceId: serviceId }
  });

  try {
    const response = await makeRequest(options, data);
    console.log('📊 Respuesta del deploy:', response.statusCode);
    
    if (response.statusCode === 200) {
      const result = JSON.parse(response.body);
      console.log('✅ Deploy iniciado:', result.data?.deployService?.status || 'en progreso');
      return true;
    } else {
      console.log('❌ Error:', response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Error disparando deploy:', error);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🎯 ELIMINANDO CUSTOM BUILD COMMAND Y HACIENDO REDEPLOY');
  console.log('=' * 60);
  
  try {
    // Step 1: Get project details
    const service = await getProjectDetails();
    if (!service) {
      console.log('❌ No se pudo obtener el servicio');
      return;
    }
    
    // Step 2: Update service to remove build command
    const updated = await updateService(service.id);
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