import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name from import.meta.url
const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        preact(),
        {
            name: 'copy-extension-files',
            closeBundle() {
                // Create images directory if it doesn't exist
                if (!fs.existsSync(resolve(__dirname, 'dist/images'))) {
                    fs.mkdirSync(resolve(__dirname, 'dist/images'), { recursive: true });
                }

                // Copy manifest.json
                fs.copyFileSync(
                    resolve(__dirname, '../extention/manifest.json'),
                    resolve(__dirname, 'dist/manifest.json')
                );

                // Copy icon files
                fs.copyFileSync(
                    resolve(__dirname, '../extention/images/icon-128.png'),
                    resolve(__dirname, 'dist/images/icon-128.png')
                );
                fs.copyFileSync(
                    resolve(__dirname, '../extention/images/icon-16.png'),
                    resolve(__dirname, 'dist/images/icon-16.png')
                );

                // Rename index.html to sidepanel.html
                if (fs.existsSync(resolve(__dirname, 'dist/index.html'))) {
                    fs.renameSync(
                        resolve(__dirname, 'dist/index.html'),
                        resolve(__dirname, 'dist/sidepanel.html')
                    );
                }

                // Fix paths in sidepanel.html
                if (fs.existsSync(resolve(__dirname, 'dist/sidepanel.html'))) {
                    let html = fs.readFileSync(resolve(__dirname, 'dist/sidepanel.html'), 'utf8');
                    html = html.replace(/src="\/sidepanel\.js"/, 'src="sidepanel.js"');
                    html = html.replace(/href="\/sidepanel\.css"/, 'href="sidepanel.css"');
                    fs.writeFileSync(resolve(__dirname, 'dist/sidepanel.html'), html);
                }

                // Remove vite.svg if it exists
                const viteSvgPath = resolve(__dirname, 'dist/vite.svg');
                if (fs.existsSync(viteSvgPath)) {
                    fs.unlinkSync(viteSvgPath);
                }
            }
        }
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                sidepanel: resolve(__dirname, 'index.html'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    },
    css: {
        modules: {
            localsConvention: 'camelCase',
            generateScopedName: (name, path, css) => {
                const componentName =
                    path
                        .split('/')
                        .pop()
                        ?.replace(/\.[^/.]+$/, '')
                        .split('.')[0] || '';
                return `${componentName}__${name}_${hashString(css)}`;
            },
        },
    },
});

function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36).slice(0, 5);
}
