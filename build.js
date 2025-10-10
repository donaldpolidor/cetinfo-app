// build.js
const fs = require('fs');
const path = require('path');

console.log('🚀 Début du build...');

// Créer le dossier dist s'il n'existe pas
const distDir = './dist';
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('📁 Dossier dist créé');
}

// Fonction pour copier les fichiers
function copyFile(source, destination) {
    const destDir = path.dirname(destination);
    
    // Créer le dossier de destination s'il n'existe pas
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    if (fs.existsSync(source)) {
        fs.copyFileSync(source, destination);
        console.log(`✅ Copié: ${source} → ${destination}`);
    } else {
        console.log(`❌ Fichier non trouvé: ${source}`);
    }
}

// Fonction pour copier un dossier récursivement
function copyDir(src, dest) {
    if (!fs.existsSync(src)) {
        console.log(`❌ Dossier source non trouvé: ${src}`);
        return;
    }
    
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`✅ Copié: ${srcPath} → ${destPath}`);
        }
    });
}

// Copier les fichiers principaux
copyFile('./src/index.html', './dist/index.html');
copyFile('./src/css/style.css', './dist/css/style.css');
copyFile('./src/js/script.js', './dist/js/script.js');

// Copier les images
if (fs.existsSync('./src/images')) {
    copyDir('./src/images', './dist/images');
} else {
    console.log('ℹ️  Dossier images non trouvé, création d\'un placeholder...');
    // Créer un dossier images vide
    if (!fs.existsSync('./dist/images')) {
        fs.mkdirSync('./dist/images', { recursive: true });
    }
}

console.log('🎉 Build terminé avec succès !');
console.log('📂 Les fichiers sont dans le dossier dist/');