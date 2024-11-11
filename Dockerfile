# Utiliser une image Node.js officielle
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances du système pour permettre la compilation de bcrypt
RUN apt-get update && apt-get install -y build-essential python3

# Copier uniquement package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances, y compris bcrypt, directement dans le conteneur
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port que l'application utilise
EXPOSE 8000

# Lancer le serveur de l'application
CMD ["node", "server.js"]
