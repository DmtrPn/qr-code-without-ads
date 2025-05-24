import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [preact()],
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
