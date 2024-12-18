FROM node:18-alpine

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package.json kopieren und Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# Projektcode kopieren
COPY . .

# Build-Prozess sicherstellen
RUN npm run build

# Port freigeben
EXPOSE 8080

# Startbefehl
CMD ["npm", "run", "dev"]
