const fs = require('fs');
const path = require('path');
console.log("Scaleflex: Update package to support CommonJS Build");

const packageJsonPath = path.resolve(__dirname, 'node_modules/react-filerobot-media-annotator/package.json');
console.log('Removed "type": "module" from react-filerobot-media-annotator/package.json');


// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Remove the "type" field
delete packageJson.type;

// Write the modified package.json back to the file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));