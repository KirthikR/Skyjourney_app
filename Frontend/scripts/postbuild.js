const fs = require('fs');
const path = require('path');

// Get the HTML file
const htmlPath = path.resolve(__dirname, '../dist/index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Replace environment variables placeholders
htmlContent = htmlContent.replace('%VITE_OPENAI_API_KEY%', process.env.VITE_OPENAI_API_KEY || '');
htmlContent = htmlContent.replace('%VITE_APP_ENV%', process.env.VITE_APP_ENV || 'production');

// Write updated HTML
fs.writeFileSync(htmlPath, htmlContent);

console.log('Post-build processing completed successfully!');