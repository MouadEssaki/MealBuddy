# MealBuddy

Application mobile de suivi nutritionnel : journal alimentaire, recettes, plans de repas et listes de courses, avec assistance IA (Groq).


## Architecture

| Composant | Technologie | Hébergement |
|-----------|-------------|-------------|
| **Frontend** | React Native (Expo 52, Expo Router) | Appareil / Expo Go / build natif |
| **Backend** | Flask 3, Gunicorn | [Azure App Service](https://mealbuddy-smartgroup2025.azurewebsites.net) |
| **Base de données** | MongoDB (PyMongo) | [MongoDB Atlas](https://www.mongodb.com/atlas) — base `MealBuddyDb` |
| **IA** | Groq API | Appels depuis le backend |

```
[ App mobile ]  --HTTPS REST-->  [ Flask sur Azure ]  --mongodb+srv-->  [ MongoDB Atlas ]
                                        |
                                        +----> [ Groq API ]
```

**API de production :** `https://mealbuddy-smartgroup2025.azurewebsites.net/api`

## Fonctionnalités

- **Comptes** — inscription, connexion (JWT + bcrypt)
- **Journal alimentaire (MealLogs)** — repas par date, calories
- **Aliments (Foods)** — catalogue nutritionnel
- **Recettes (Recipes)** — CRUD + génération IA à partir d’ingrédients
- **Plans de repas (MealPlans)** — plans hebdomadaires générés par IA
- **Listes de courses (ShoppingLists)**
- **Utilitaires** — calcul d’apport calorique (Mifflin–St Jeor), recherche alimentaire IA

## Structure du projet

```
MealBuddy/
├── backend/                 # API REST Flask
│   ├── main.py              # Point d’entrée, connexion Atlas, routes utils
│   ├── Users/               # Auth, CRUD utilisateurs
│   ├── MealLogs/            # Journal des repas
│   ├── Foods/               # Aliments
│   ├── Recipes/             # Recettes + recepeGenerator (IA)
│   ├── MealPlans/           # Plans de repas
│   ├── ShoppingLists/       # Listes de courses
│   ├── Research/            # Recherche alimentaire (Groq)
│   ├── requirements.txt
│   └── startup.txt          # Commande Gunicorn (Azure)
└── frontend/MealBuddy/      # App Expo / React Native
    ├── app/                 # Écrans (Expo Router)
    ├── composants/          # Login, inscription, etc.
    └── package.json
```

## Prérequis

- **Python** 3.10+
- **Node.js** 18+ et npm
- Compte **MongoDB Atlas**
- Clé API **Groq**
- **Expo CLI** (`npx expo`)

## Installation

### Backend

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
# source venv/bin/activate

pip install -r requirements.txt
```

Variables d’environnement :

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | URI Atlas (`mongodb+srv://...`) |
| `GROQ_API_KEY` | Clé API Groq |
| `JWT_SECRET_KEY` | Secret pour les tokens JWT |

Lancer en local :

```bash
python main.py
```

Le serveur écoute sur `http://0.0.0.0:8000`.

### Frontend

```bash
cd frontend/MealBuddy
npm install
npx expo start
```

Ouvrez l’app via Expo Go, un émulateur Android/iOS ou le web (`w` dans le terminal Expo).

## API REST

Toutes les routes sont préfixées par `/api`.

### Authentification

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/users` | Créer un compte |
| `POST` | `/login` | Connexion → `{ token, user }` |
| `GET` | `/users/<id>` | Profil (header `Authorization: Bearer <token>`) |
| `PUT` | `/users/<id>` | Mettre à jour le profil |
| `DELETE` | `/users/<id>` | Supprimer le compte |

### Ressources principales

| Ressource | Routes |
|-----------|--------|
| **MealLogs** | `GET/POST /MealLogs`, `GET /MealLogs/current`, `GET /MealLogs?date=...`, `PATCH /MealLogs/<id>` |
| **Foods** | `GET/POST /foods`, `GET/PUT/DELETE /foods/<id>` |
| **Recipes** | `GET/POST /recipes`, `GET/PUT/DELETE /recipes/<id>` |
| **MealPlans** | `GET/POST /MealPlans`, `GET /MealPlans/<id>`, `DELETE /MealPlans/<name>` |
| **ShoppingLists** | CRUD sur `/ShoppingLists` |

### Utilitaires (IA & calculs)

| Méthode | Route | Body (exemple) |
|---------|-------|----------------|
| `POST` | `/utils/calculerApportCal` | `sexe`, `poids`, `taille`, `age`, `activite`, `objectif` |
| `POST` | `/utils/search_food` | `search_term` |
| `POST` | `/utils/generate_recipe` | `user_id`, `mandatory_ingredients`, `theme` |
| `POST` | `/utils/generate_meal_plan` | `user_id`, `sexe`, `poids`, `taille`, `age`, `niveau_activite`, `objectif`, `preferences` |

### Collections MongoDB

- `users`, `MealLogs`, `Foods`, `Recipes`, `MealPlans`, `ShoppingLists`

## Déploiement backend (Azure)

- Hébergement : **Azure App Service**
- Démarrage : `gunicorn --bind=0.0.0.0 --timeout 600 main:app` (voir `backend/startup.txt`)
- Fichier `backend/.deployment` : build activé au déploiement

