#  — API REST / GraphQL avec RxDB



---

## Présentation

Ce projet met en place une API **REST** et un service **GraphQL** partageant la même base de données [RxDB](https://rxdb.info/) (stockage en mémoire avec persistance JSON sur disque). Les deux interfaces exposent les mêmes opérations CRUD sur une ressource **User**, garantissant que les données créées d'un côté sont immédiatement accessibles de l'autre.

---

## Fonctionnalités

- CRUD complet sur les utilisateurs via **REST** (`Express`)
- CRUD complet sur les utilisateurs via **GraphQL** (`graphql-http`)
- Persistance locale au format JSON grâce à **RxDB** (snapshot automatique dans `data/users.snapshot.json`)
- Validation des données par schéma (AJV)
- Vérification de l'unicité de l'e-mail
- Schéma GraphQL séparé dans un fichier `schema.gql` dédié

---

## Prérequis

| Outil | Version recommandée |
|-------|-------------------|
| Node.js | LTS (≥ 18) |
| npm | ≥ 9 |

Vérification :

```bash
node -v
npm -v
```

---

## Installation

```bash
# 1. Cloner / créer le dossier du projet
mkdir api-rest-graphql-rxdb
cd api-rest-graphql-rxdb

# 2. Initialiser npm
npm init -y

# 3. Installer les dépendances
npm install express graphql graphql-http rxdb rxjs lokijs
```

---

## Structure du projet

```
api-rest-graphql-rxdb/
├── data/
│   └── users.snapshot.json   ← snapshot persisté automatiquement
├── db.js                     ← configuration RxDB
├── schema.gql                ← schéma GraphQL
├── userResolver.js           ← résolveurs GraphQL
└── server.js                 ← serveur Express (REST + GraphQL)
```

---

## Démarrage

```bash
node server.js
```

Le serveur écoute sur **http://localhost:5000**.

---

## API REST

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/users` | Lister tous les utilisateurs |
| `GET` | `/users/:id` | Obtenir un utilisateur par son ID |
| `POST` | `/users` | Créer un utilisateur |
| `PUT` | `/users/:id` | Mettre à jour un utilisateur |
| `DELETE` | `/users/:id` | Supprimer un utilisateur |

### Exemple — Créer un utilisateur

```http
POST http://localhost:5000/users
Content-Type: application/json

{
  "name": "Ali Ben Salah",
  "email": "ali@example.com",
  "password": "123456"
}
```

---

## API GraphQL

Point d'entrée : `POST http://localhost:5000/graphql`

### Schéma

```graphql
type User {
  id: String!
  name: String!
  email: String!
  password: String!
}

type Query {
  user(id: String!): User
  users: [User!]!
}

type Mutation {
  addUser(name: String!, email: String!, password: String!): User
  updateUser(id: String!, name: String!, email: String!, password: String!): User
  deleteUser(id: String!): Boolean!
}
```

### Exemples de requêtes

**Lister tous les utilisateurs**
```graphql
{
  users {
    id
    name
    email
  }
}
```

**Ajouter un utilisateur**
```graphql
mutation {
  addUser(name: "Amira", email: "amira@example.com", password: "abc123") {
    id
    name
    email
  }
}
```

**Mettre à jour un utilisateur**
```graphql
mutation {
  updateUser(id: "<id>", name: "Amira K.", email: "amira.k@example.com", password: "xyz789") {
    id
    name
    email
  }
}
```

**Supprimer un utilisateur**
```graphql
mutation {
  deleteUser(id: "<id>")
}
```

---

## Persistance des données

RxDB fonctionne en mémoire. À chaque création, mise à jour ou suppression, le contenu de la collection est automatiquement sauvegardé dans `data/users.snapshot.json`. Au prochain démarrage du serveur, ce snapshot est rechargé pour restaurer l'état précédent.

---

## Travail demandé (extensions)

- [ ] Créer ≥ 2 utilisateurs via REST et vérifier leur présence via GraphQL
- [ ] Créer ≥ 1 utilisateur via GraphQL et vérifier sa présence via REST
- [ ] Tester la mise à jour et la suppression avec les deux approches
- [ ] Ajouter un type **Device** (id, userId, name, type, serialNumber, status) en relation de composition avec User
- [ ] Étendre le schéma GraphQL avec les requêtes/mutations pour les devices
- [ ] Étendre l'API REST avec les routes CRUD pour les devices
- [ ] Garantir qu'un device ne peut pas exister sans utilisateur
- [ ] Supprimer automatiquement les devices lors de la suppression de l'utilisateur
- [ ] Refactoriser le code pour que REST et GraphQL partagent les mêmes fonctions métier
- [ ] Réorganiser le projet en séparant : accès aux données, logique métier, résolveurs et routes

---

## Outils de test recommandés

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- `curl`
- Navigateur (pour les requêtes `GET`)

---

## Dépendances principales

| Paquet | Rôle |
|--------|------|
| `express` | Serveur HTTP |
| `graphql` | Moteur GraphQL |
| `graphql-http` | Middleware GraphQL pour Express |
| `rxdb` | Base de données NoSQL orientée documents |
| `rxjs` | Programmation réactive (requis par RxDB) |
| `lokijs` | Adaptateur de stockage (optionnel) | 
