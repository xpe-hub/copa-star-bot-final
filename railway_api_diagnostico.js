#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// Railway API configuration
const RAILWAY_API_TOKEN = '09f803fc-8522-4bff-bb40-b5a3682f1448';
const PROJECT_ID = 'striking-transformation';
const API_BASE = 'railway.app';

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

// Try alternative API endpoints
async function getProjectServices() {
  console.log('🔍 Buscando servicios del proyecto...');
  
  const options = {
    hostname: API_BASE,
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
    console.log('📊 Headers:', JSON.stringify(response.headers, null, 2));
    console.log('📊 Body:', response.body.substring(0, 500));
    
    if (response.statusCode === 200) {
      const services = JSON.parse(response.body);
      console.log('✅ Servicios encontrados:', services);
      return services;
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  return null;
}

// Alternative: Try direct Railway API v2
async function getProjectDirect() {
  console.log('🔍 Probando API directa de Railway...');
  
  const options = {
    hostname: API_BASE,
    path: `/api/v2/projects/${PROJECT_ID}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${RAILWAY_API_TOKEN}`
    }
  };

  try {
    const response = await makeRequest(options);
    console.log('📊 Status:', response.statusCode);
    console.log('📊 Body:', response.body.substring(0, 500));
    
    if (response.statusCode === 200) {
      const project = JSON.parse(response.body);
      console.log('✅ Proyecto encontrado:', project);
      return project;
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  return null;
}

// Try to use GraphQL with correct headers
async function graphqlQuery(query, variables = {}) {
  console.log('🔍 Ejecutando GraphQL query...');
  
  const options = {
    hostname: 'railway.app',
    path: '/api/v2/query',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Railway-CLI/1.0'
    }
  };

  const data = JSON.stringify({ query, variables });

  try {
    const response = await makeRequest(options, data);
    console.log('📊 Status:', response.statusCode);
    console.log('📊 Body:', response.body.substring(0, 500));
    
    if (response.statusCode === 200) {
      const result = JSON.parse(response.body);
      return result;
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  return null;
}

// Main execution
async function main() {
  console.log('🎯 DIAGNÓSTICO DE API RAILWAY');
  console.log('=' * 60);
  
  // Try different approaches
  const services = await getProjectServices();
  if (services) {
    console.log('✅ Método 1 exitoso: Servicios encontrados');
    return;
  }
  
  const project = await getProjectDirect();
  if (project) {
    console.log('✅ Método 2 exitoso: Proyecto encontrado');
    return;
  }
  
  // Try GraphQL
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
  
  const result = await graphqlQuery(query, { id: PROJECT_ID });
  if (result) {
    console.log('✅ Método 3 exitoso: GraphQL query');
    console.log('📋 Resultado:', JSON.stringify(result, null, 2));
    return;
  }
  
  console.log('❌ Ningún método funcionó');
}

// Run the script
main();