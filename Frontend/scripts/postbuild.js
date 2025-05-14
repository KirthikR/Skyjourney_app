const fs = require('fs');
const path = require('path');

// Get the path to the index.html file in the dist folder
const indexPath = path.resolve(__dirname, '../dist/index.html');

// Read the file
let html = fs.readFileSync(indexPath, 'utf8');

// Replace any import.meta references in inline scripts
html = html.replace(/import\.meta\.env/g, 'window.ENV');

// Replace %PUBLIC_URL% with empty string (or correct base path)
html = html.replace(/%PUBLIC_URL%/g, '');

// Write the file back
fs.writeFileSync(indexPath, html);

// Create a simple env.js file that will be loaded before any modules
const envJsContent = `
window.ENV = {
  VITE_OPENAI_API_KEY: "${process.env.VITE_OPENAI_API_KEY || ''}",
  VITE_APP_ENV: "${process.env.VITE_APP_ENV || 'production'}",
  MODE: "production"
};
console.log("Environment variables loaded");
`;

// Write the env.js file to the dist folder
fs.writeFileSync(path.resolve(__dirname, '../dist/env.js'), envJsContent);

console.log('Post-build processing completed!');