# Documentation Complète de l'API "Backend CI/CD"

## 1. Présentation du Projet

L’API "Backend CI/CD" est une application RESTful développée en **Node.js** avec **Express** et utilisant **MongoDB** pour la persistance des données. Elle gère la création, l'authentification et la gestion d'utilisateurs avec différents rôles :  
- **user** (utilisateur standard)  
- **admin** (administrateur)

Les principales fonctionnalités sont :
- **Inscription publique** : accessible via `/public/register`, qui permet à un visiteur de s'inscrire avec le rôle `"user"` forcé.
- **Authentification** : via `/auth/login` pour tous les utilisateurs et `/auth/register-admin` pour créer un administrateur (si aucun n’existe déjà).
- **Création d’utilisateurs authentifiés** : accessible via `/users/create`.  
  - Si l’utilisateur connecté est **admin**, il peut choisir le rôle (`"user"` ou `"admin"`) pour le nouvel utilisateur.
  - Si l’utilisateur connecté est **user**, le rôle du nouvel utilisateur sera forcé à `"user"`, quelle que soit la valeur envoyée.
- **Gestion** : récupération de la liste des utilisateurs créés par le créateur, récupération de tous les administrateurs et suppression d’un utilisateur.

La documentation de l’API est générée à l’aide de **Swagger** et accessible via `/api-docs`.

---

## 2. Architecture et Structure du Projet

### A. Arborescence Principale

```
backend/
├── .github/
│   └── workflows/
│       └── backend-ci-cd.yml      # Workflow GitHub Actions pour CI/CD
├── config/
│   ├── db.js                      # Configuration et connexion MongoDB (gestion des .env)
│   └── swagger.js                 # Configuration Swagger (spécification OpenAPI)
├── controllers/
│   ├── authController.js          # Endpoints d'authentification (login, register-admin)
│   ├── publicController.js        # Endpoints publics (inscription, liste publique)
│   └── userController.js          # Endpoints de gestion des utilisateurs (création, liste, suppression)
├── middlewares/
│   └── authMiddleware.js          # Middleware pour vérifier et décoder le token JWT
├── models/
│   └── User.js                    # Schéma Mongoose du modèle User
├── routes/
│   ├── adminRoutes.js             # Routes pour les actions administratives (ex: création d’utilisateur via admin)
│   ├── authRoutes.js              # Routes d’authentification
│   ├── publicRoutes.js            # Routes d’inscription et de consultation publique
│   └── userRoutes.js              # Routes pour la gestion des utilisateurs (création, liste, suppression)
├── tests/
│   └── user.test.js               # Tests unitaires avec Jest et Supertest
├── utils/
│   └── validators.js              # Fonctions de validation (email, code postal, noms, etc.)
├── .env                         # Variables d'environnement pour développement local
├── .env.test                    # Variables pour les tests
├── .env.docker                  # Variables pour Docker
├── Dockerfile                   # Fichier Docker pour construire l'image
├── docker-compose.yml           # Orchestration Docker (API et MongoDB)
├── codecov.yml                  # Configuration de Codecov pour la couverture de tests
├── local.js                     # Script de démarrage local (lance app.listen)
├── seed.js                      # Script d'initialisation (création de l'admin par défaut)
├── server.js                    # Point d'entrée principal (exporte l'application Express)
├── package.json                 # Dépendances et scripts du projet
└── README.md                    # (Cette documentation)
```

### B. Composants Clés

- **server.js**  
  Exporte l’application Express sans démarrer le serveur (pas de `app.listen()`). Ceci est utile pour le déploiement en mode serverless (par ex. sur Vercel).

- **local.js**  
  Lance l’application localement en appelant `app.listen()`, généralement sur le port défini dans `.env`.

- **config/db.js**  
  Gère la connexion à MongoDB en chargeant le fichier d’environnement approprié (par exemple `.env` pour le développement, `.env.test` pour les tests).

- **config/swagger.js**  
  Configure Swagger pour générer la documentation OpenAPI. En production, l’URL du serveur est définie dynamiquement en utilisant la variable `VERCEL_URL` si disponible.

- **Dockerfile & docker-compose.yml**  
  Permettent de containeriser l’application et d’orchestrer les services (l’API et MongoDB).

- **GitHub Actions**  
  Un workflow CI/CD est configuré pour exécuter les tests, générer la couverture et (optionnellement) déployer sur Vercel.

---

## 3. Endpoints et Schémas Détaillés

### A. Authentification

#### 1. `POST /auth/login`
- **Objectif :** Authentifier un utilisateur (admin ou user).
- **Requête :**  
  **Schéma : LoginRequest**
  ```yaml
  LoginRequest:
    type: object
    required:
      - email
      - password
    properties:
      email:
        type: string
        format: email
        example: "alice.dupont@example.com"
      password:
        type: string
        format: password
        example: "StrongPassword123"
  ```
- **Exemple de Body (JSON) :**
  ```json
  {
    "email": "alice.dupont@example.com",
    "password": "StrongPassword123"
  }
  ```
- **Réponse (200) :**  
  **Schéma : AuthResponse**
  ```yaml
  AuthResponse:
    type: object
    properties:
      token:
        type: string
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ```
- **Erreurs :**  
  - 400 : Identifiants manquants ou incorrects.
  - 401 : Token invalide (pour des endpoints protégés ultérieurement).
  - 500 : Erreur serveur.

---

#### 2. `POST /auth/register-admin`
- **Objectif :** Créer un administrateur (si aucun admin n'existe déjà).
- **Requête :**  
  **Schéma : RegisterAdminRequest**
  ```yaml
  RegisterAdminRequest:
    type: object
    required:
      - email
      - password
    properties:
      email:
        type: string
        format: email
        example: "admin@example.com"
      password:
        type: string
        format: password
        example: "AdminStrongPassword"
  ```
- **Exemple de Body (JSON) :**
  ```json
  {
    "email": "admin@example.com",
    "password": "AdminStrongPassword"
  }
  ```
- **Réponse (201) :**
  ```json
  {
    "msg": "Administrateur créé avec succès."
  }
  ```
- **Erreurs :**
  - 400 : Un administrateur existe déjà ou données invalides.
  - 500 : Erreur serveur.

---

### B. Inscription Publique

#### 1. `POST /public/register`
- **Objectif :** Inscription publique d’un utilisateur avec rôle forcé à `"user"`.
- **Requête :**  
  **Schéma : (objet sans champ role)**
  ```yaml
  type: object
  required:
    - firstName
    - lastName
    - email
    - password
    - birthDate
    - city
    - postalCode
  properties:
    firstName:
      type: string
      example: "Alice"
    lastName:
      type: string
      example: "Dupont"
    email:
      type: string
      format: email
      example: "alice.dupont@example.com"
    password:
      type: string
      example: "MySuperSecretPassword"
    birthDate:
      type: string
      format: date
      example: "1990-04-15"
    city:
      type: string
      example: "Paris"
    postalCode:
      type: string
      example: "75001"
  ```
- **Exemple de Body (JSON) :**
  ```json
  {
    "firstName": "Alice",
    "lastName": "Dupont",
    "email": "alice.dupont@example.com",
    "password": "MySuperSecretPassword",
    "birthDate": "1990-04-15",
    "city": "Paris",
    "postalCode": "75001"
  }
  ```
- **Réponse (201) :**
  ```json
  {
    "msg": "Inscription réussie."
  }
  ```
- **Erreurs :**
  - 400 : Champs manquants, email invalide, ou utilisateur déjà existant.
  - 500 : Erreur serveur.

#### 2. `GET /public/users`
- **Objectif :** Récupérer la liste publique des utilisateurs inscrits (en masquant email et date de naissance).
- **Réponse (200) :**
  ```json
  [
    {
      "_id": "60f7b2c9e3a1f1234567890a",
      "firstName": "Alice",
      "lastName": "Dupont",
      "city": "Paris",
      "postalCode": "75001"
    },
    ...
  ]
  ```
- **Erreurs :**
  - 500 : Erreur serveur.

---

### C. Gestion des Utilisateurs Authentifiés

#### 1. `POST /users/create`
- **Objectif :** Créer un nouvel utilisateur par un utilisateur authentifié.
- **Règles :**
  - **Si l'utilisateur connecté est admin** : il peut spécifier le rôle (valeurs possibles : `"user"` ou `"admin"`) via le champ `role`.
  - **Si l'utilisateur connecté est user** : le rôle du nouvel utilisateur sera forcé à `"user"`, même si un autre rôle est fourni.
- **Sécurité :** Requiert un token JWT (header `Authorization: Bearer <token>`).
- **Requête :**  
  **Schéma :**
  ```yaml
  type: object
  required:
    - firstName
    - lastName
    - email
    - password
    - birthDate
    - city
    - postalCode
  properties:
    firstName:
      type: string
      example: "Alice"
    lastName:
      type: string
      example: "Dupont"
    email:
      type: string
      format: email
      example: "alice.dupont@example.com"
    password:
      type: string
      example: "StrongPassword123"
    birthDate:
      type: string
      format: date
      example: "1980-05-20"
    city:
      type: string
      example: "Paris"
    postalCode:
      type: string
      example: "75001"
    role:
      type: string
      enum: [ "user", "admin" ]
      example: "admin"
  ```
- **Exemple de Body (JSON) :**
  ```json
  {
    "firstName": "Alice",
    "lastName": "Dupont",
    "email": "alice.dupont@example.com",
    "password": "StrongPassword123",
    "birthDate": "1980-05-20",
    "city": "Paris",
    "postalCode": "75001",
    "role": "admin"
  }
  ```
- **Réponse (201) :**
  ```json
  {
    "msg": "Utilisateur créé avec succès."
  }
  ```
- **Erreurs :**
  - 400 : Champs manquants ou utilisateur déjà existant.
  - 401 : Authentification requise (token manquant ou invalide).
  - 403 : Si l’utilisateur connecté n’est pas autorisé à définir un rôle autre que `"user"`.
  - 500 : Erreur serveur.

#### 2. `GET /users`
- **Objectif :** Récupérer la liste des utilisateurs créés par l’utilisateur authentifié (typiquement réservé aux admins).
- **Sécurité :** Requiert un token JWT.
- **Réponse (200) :**  
  Tableau d’objets **User** (voir schéma User ci-dessous).
- **Erreurs :**
  - 403 : Accès interdit.
  - 500 : Erreur serveur.

#### 3. `GET /users/admins`
- **Objectif :** Récupérer la liste de tous les administrateurs.
- **Sécurité :** Requiert un token JWT.
- **Réponse (200) :**  
  Tableau d’objets **User** correspondant aux admins.
- **Erreurs :**
  - 403 : Accès interdit.
  - 500 : Erreur serveur.

#### 4. `DELETE /users/{id}`
- **Objectif :** Supprimer un utilisateur créé par l’utilisateur authentifié.
- **Sécurité :** Requiert un token JWT.
- **Paramètre** : `id` dans l'URL (ID de l'utilisateur à supprimer).
- **Réponse (200) :**
  ```json
  {
    "msg": "Utilisateur supprimé avec succès"
  }
  ```
- **Erreurs :**
  - 403 : Accès interdit.
  - 404 : Utilisateur non trouvé.
  - 500 : Erreur serveur.

---

### D. Schéma Global de l’Utilisateur (User)

Ce schéma est utilisé dans la documentation Swagger pour décrire la structure d’un objet utilisateur.

```yaml
User:
  type: object
  properties:
    _id:
      type: string
      example: "60f7b2c9e3a1f1234567890a"
    firstName:
      type: string
      example: "Alice"
    lastName:
      type: string
      example: "Dupont"
    email:
      type: string
      format: email
      example: "alice.dupont@example.com"
    birthDate:
      type: string
      format: date
      example: "1980-05-20"
    city:
      type: string
      example: "Paris"
    postalCode:
      type: string
      example: "75001"
    role:
      type: string
      enum: [ "user", "admin" ]
      example: "user"
```

---

## 4. Configuration Swagger

La configuration Swagger se trouve dans `config/swagger.js` et intègre :
- Les informations de base de l’API.
- La liste des serveurs (utilisation dynamique de `VERCEL_URL` en production).
- Les schémas de sécurité et de données (User, LoginRequest, AuthResponse, RegisterAdminRequest).

Exemple de configuration :

```js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend API Documentation',
      version: '1.0.0',
      description: 'Documentation de l\'API pour la gestion des utilisateurs',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' && process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api`
          : "http://localhost:5000/api",
        description: process.env.NODE_ENV === 'production'
          ? "Serveur de production"
          : "Serveur local sur le port 5000",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b2c9e3a1f1234567890a" },
            firstName: { type: "string", example: "Alice" },
            lastName: { type: "string", example: "Dupont" },
            email: { type: "string", format: "email", example: "alice.dupont@example.com" },
            birthDate: { type: "string", format: "date", example: "1980-05-20" },
            city: { type: "string", example: "Paris" },
            postalCode: { type: "string", example: "75001" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'alice.dupont@example.com' },
            password: { type: 'string', format: 'password', example: 'StrongPassword123' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        RegisterAdminRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', format: 'password', example: 'AdminStrongPassword' }
          }
        },
      },
    },
    security: [
      { bearerAuth: [] }
    ],
  },
  apis: ['./src/controllers/*.js', './src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
```

---

## 5. Exécution Locale

### A. Sans Docker

1. **Installer les dépendances :**
   ```bash
   npm install
   ```
2. **Créer un fichier `.env`** (voir section Variables d'Environnement).
3. **Démarrer l'API en mode développement :**
   ```bash
   npm run dev
   ```
4. **Accéder à l'API :**
   - API : [http://localhost:5000](http://localhost:5000)
   - Swagger : [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### B. Avec Docker Compose

1. **Installer Docker et Docker Compose.**
2. **À la racine du projet, exécuter :**
   ```bash
   docker-compose up --build
   ```
3. **Accéder à l'API :**
   - API : [http://localhost:5000](http://localhost:5000)
   - Swagger : [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
4. **Pour lancer en arrière-plan :**
   ```bash
   docker-compose up --build -d
   ```
5. **Pour arrêter et supprimer les conteneurs :**
   ```bash
   docker-compose down
   ```

---

## 6. Pipeline CI/CD avec GitHub Actions

Le fichier de workflow (par exemple, `.github/workflows/backend-ci-cd.yml`) exécute les étapes suivantes :

1. **Déclenchement :** sur push ou pull request sur les branches `feature/**` et `main`.
2. **Étapes :**
   - **Checkout du code** (actions/checkout).
   - **Installation de Node.js** (actions/setup-node avec la version 20).
   - **Configuration de l'environnement de test** en ajoutant `MONGO_URI_TEST`.
   - **Démarrage de MongoDB** via Docker.
   - **Installation des dépendances**.
   - **Attente que MongoDB soit prêt** (boucle avec `nc`).
   - **Exécution du script de setup** (`npm run setup`).
   - **Exécution des tests avec couverture** (`npm run test:coverage`).
   - **Upload de la couverture à Codecov** (action codecov/codecov-action).
   - **Arrêt et suppression du conteneur MongoDB**.
3. **(Optionnel) Déploiement sur Vercel** : une section de déploiement est incluse (mais commentée) que vous pouvez activer.

Exemple de workflow :

```yaml
name: Backend CI/CD

on:
  push:
    branches:
      - feature/**
      - main
  pull_request:
    branches:
      - feature/**
      - main
  workflow_dispatch:

jobs:
  build:
    name: Build and Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Set up MongoDB URI for tests
        run: echo "MONGO_URI_TEST=mongodb://localhost:27017/test" >> $GITHUB_ENV

      - name: Start MongoDB (via Docker)
        run: |
          docker run -d --name mongodb_container -p 27017:27017 mongo:latest
          sleep 10

      - name: Install dependencies
        run: npm install

      - name: Wait for MongoDB to be ready
        run: |
          for i in {1..10}; do
            if nc -z localhost 27017; then
              echo "MongoDB is ready!"
              exit 0
            fi
            echo "Waiting for MongoDB..."
            sleep 3
          done
          echo "MongoDB did not start in time!"
          exit 1

      - name: Run setup
        run: npm run setup

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v5
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          directory: ./coverage
          fail_ci_if_error: true

      - name: Stop MongoDB (Clean Up)
        run: docker stop mongodb_container && docker rm mongodb_container

  # deploy:
  #   name: Deploy to Vercel
  #   runs-on: ubuntu-latest
  #   needs: build
  #   if: github.ref == 'refs/heads/main'
  #   steps:
  #     - name: Checkout code
  #       uses: actions/checkout@v4
  #     - name: Setup Node.js
  #       uses: actions/setup-node@v4
  #       with:
  #         node-version: "20"
  #     - name: Install dependencies
  #       run: npm install
  #     - name: Deploy to Vercel
  #       uses: amondnet/vercel-action@v20
  #       with:
  #         vercel-token: ${{ secrets.VERCEL_TOKEN }}
  #         vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
  #         vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
  #         working-directory: .
  #         vercel-args: '--prod'
  #       env:
  #         VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 7. Déploiement sur Vercel

- **Configuration :**
  - Dans le dashboard Vercel, définissez les variables d'environnement nécessaires (`MONGO_URI`, `JWT_SECRET`, etc.).
  - Le fichier `server.js` exporte l'application Express (sans `app.listen()`), permettant à Vercel de gérer l'exécution en mode serverless.
  - La configuration Swagger utilise la variable `VERCEL_URL` pour générer dynamiquement l'URL de production.
- **Déploiement :**
  - Utilisez la CLI Vercel pour déployer en production :
    ```bash
    vercel --prod
    ```
  - Votre API sera alors accessible via l'URL attribuée par Vercel, par exemple :  
    `https://backend-xxxxx.vercel.app/api`
  - La documentation Swagger sera accessible via :  
    `https://backend-xxxxx.vercel.app/api-docs`

---