const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'src', 'globals.d.ts');
const destPath = path.join(__dirname, 'lib', 'globals.d.ts');

fs.rmSync(destPath)
fs.copyFileSync(sourcePath, destPath);