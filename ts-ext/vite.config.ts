import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
    plugins: [preact()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                sidepanel: resolve(__dirname, 'sidepanel.html'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
            },
        },
    },
    assetsInclude: ['**/*.json', '**/*.png'],
    publicDir: resolve(__dirname, './static'),
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
