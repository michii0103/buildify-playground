# Wenn ich über den Server entwicklen möchte, braucht dieser immer bundled client code.

um das zu realisieren, brauchen wir in der package.json folgende Befehle:

- "build:client:watch": "vite build --watch",
- "build:server:watch": "tsc -w",
- "serve": "nodemon dist/server/server.js",
- "dev": "concurrently \"npm run build:client:watch\" \"npm run build:server:watch\" \"npm run serve\""

# das gleiche erreichen wir aber, indem wir client und server unterschiedlich serven.

-> client über vite und den server über npx

- "build": "vite build && tsc",
- "dev": "vite",
- "dev:server": "npx tsx watch src/server/server.ts",
- "start-all": "concurrently \"npm:dev\" \"npm:dev:server\""

# ecosystem.config.cjs

ist die Konfiguration für pm2 auf dem Server
