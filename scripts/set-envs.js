const { writeFileSync, mkdirSync } = require('fs');
require('dotenv').config();

const targetPathDev = './src/environments/environment.ts';
const targetPathProd = './src/environments/environment.prod.ts';

const envFileContentDev = `
export const environment = {
    production: false,
    baseUrl: "${process.env['BASE_URL_DEV']}",
};
`;

const envFileContentProd = `
export const environment = {
    production: true,
    baseUrl: "${process.env['BASE_URL_PROD']}",
};
`;

mkdirSync('./src/environments', { recursive: true });

// Crear el archivo para el entorno de desarrollo
writeFileSync(targetPathDev, envFileContentDev);

// Crear el archivo para el entorno de producción
writeFileSync(targetPathProd, envFileContentProd);

console.log('Archivos de entorno creados con éxito.');
