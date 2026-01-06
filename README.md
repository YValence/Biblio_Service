# Projet Bibliothèque - Architecture Microservices

Ce projet est une application de gestion de bibliothèque basée sur une architecture microservices avec Spring Boot et Next.js.

## 🏗 Architecture

Le projet est composé des services suivants :

*   **eureka-register** (Port 8761) : Serveur d'enregistrement (Service Discovery).
*   **api-gateway** (Port 8762) : Point d'entrée unique pour toutes les requêtes API.
*   **ms-users** (Port 8030) : Gestion des utilisateurs (Adhérents).
*   **ms-livre** (Port 8029) : Gestion du catalogue de livres (Titres, Auteurs, ISBN, Stock).
*   **ms-emprunt** (Port 8031) : Gestion des emprunts et retours.
*   **frontend** (Port 3000) : Interface utilisateur développée en Next.js.
*   **mysql** (Port 3307 externe / 3306 interne) : Base de données unique (avec 3 schémas : `userdb`, `livredb`, `empruntdb`).
*   **phpmyadmin** (Port 8081) : Interface d'administration pour la base de données.

## 🚀 Démarrage Rapide

La méthode recommandée pour lancer le projet est d'utiliser Docker Compose.

### Prérequis
*   Docker Desktop installé et lancé.

### Lancer l'application

À la racine du projet, exécutez :

```powershell
docker-compose up -d --build
```

Cette commande va compiler les projets Java (via les Dockerfile multi-stage), construire l'image du frontend, et lancer tous les conteneurs.

### Accès

*   **Frontend** : [http://localhost:3000](http://localhost:3000)
*   **Eureka Dashboard** : [http://localhost:8761](http://localhost:8761)
*   **PhpMyAdmin** : [http://localhost:8081](http://localhost:8081) (Login: `root`, Mdp: `rootpassword`)
*   **API Gateway** : [http://localhost:8762](http://localhost:8762)

## 🛠 Commandes Utiles

### Reconstruire un service spécifique
Si vous modifiez le code d'un service (ex: `ms-emprunt`), vous devez reconstruire son conteneur :

```powershell
docker-compose up -d --build --force-recreate ms-emprunt
```

### Voir les logs
Pour voir les logs de tous les services ou d'un service précis :

```powershell
docker-compose logs -f
# ou
docker-compose logs -f ms-emprunt
```

### Arrêter l'application

```powershell
docker-compose down
```

## 🐛 Debugging / Actions Spéciales

*   **Mise à jour force des retards** : Les retards sont vérifiés automatiquement toutes les minutes. Pour forcer une vérification immédiate :
    ```powershell
    curl -X POST http://localhost:8031/api/emprunts/force-update-retards
    ```

## 📝 Fonctionnalités Implémentées

1.  **Gestion des Utilisateurs** : Ajout, modification, suppression.
2.  **Gestion des Livres** : Ajout (avec catégories variées), modification, suppression, gestion du stock.
3.  **Gestion des Emprunts** :
    *   Emprunt d'un livre (vérification disponibilité, limite de 3 emprunts/adhérent, pas de doublon).
    *   Retour de livre (libération du stock).
    *   Statuts : EN_COURS, RETOURNE, EN_RETARD.
    *   Calcul automatique des dates de retour.
