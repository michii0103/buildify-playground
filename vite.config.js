import { defineConfig } from 'vite';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig({
    root: 'src', // Root-Verzeichnis des Projekts
    build: {
        outDir: '../dist', // Ausgabeordner für Builds
        emptyOutDir: true, // Löscht dist/ vor dem neuen Build
    },
    server: {
        watch: {
            usePolling: true, // Erzwungenes Polling für Dateiwatching (hilft auf Windows/Mac)
        },
        port: 3000, // Port für den Entwicklungsserver
        strictPort: true, // Erzwingt Port 3000
        host: 'localhost', // Ermöglicht Zugriff auf localhost
    },
    fs: {
        strict: false, // Deaktiviert strikte FileSystem-Watch-Regeln (optional)
    },
    resolve: {
        extensions: ['.ts', '.js'], // Ermöglicht Import von .ts und .js ohne Dateiendung
    },
    plugins: [
        FullReload(['src/**/*.ts']), // Beobachtet .ts-Dateien und erzwingt Reload
    ],
});