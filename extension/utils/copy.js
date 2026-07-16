const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..','src', 'public');
const destDir = path.join(__dirname, '..','out');

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    if (fs.existsSync(srcDir)) {
        copyDir(srcDir, destDir);
        console.log('Kopieren erfolgreich abgeschlossen!');
    } else {
        console.error('Quellordner "src/public" existiert nicht.');
    }
} catch (err) {
    console.error('Fehler beim Kopieren:', err);
}
