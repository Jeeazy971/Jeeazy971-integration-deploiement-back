FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port de l'API
EXPOSE 5000

# Commande par défaut
CMD ["npm", "run", "dev"]
