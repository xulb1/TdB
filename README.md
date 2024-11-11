# escolis-dashboard

## Présentation du projet
Le tableau de bord sert à faire le lien entre les différents services de l'école et les utilisateurs. Il doit permettre à un utilisateur authentifié d'accéder aux services qui lui sont autorisés (en fonction de son niveau : administrateur, professeur, élève, intervenant, ...).

## Fonctionnalités

- Implémentées :
    - Sécurisation des routes
    - Intégration des différents services (dans des iframe)

- À faire :
    - S'authentificer via l'api RUGM
    - Afficher les informations en fonction des autorisations de l'utilisateur
    - Corriger les bug frontend (notammant la sidebar à droite)
    - Gérer le transfert de token aux services, pour que l'utilisateur n'ai pas besoin de s'authentifier à chaque fois qu'il accède à un service.



# Récupération du projet
Via github :
> `git clone https://github.com/xulb1/TdB.git`

## Lancement du projet en local : 
> `npm start`
    ou
> `node server.js`

Si vous rencontrez une erreur :
- supprimer le dossier /node_modules/
> `rm -R node_modules/`

- réinstaller les modules : 
> `npm i`
( et normalement tout fonctionne maintenant ... )

## Lancement en production

1. Installer docker (ou docker-compose)
2. Aller dans le répertoire /TdB
3. Lancer le docker :
    - Avec docker lancer :
        > `docker build -t tdb .`
        > `docker run -p 8000:8000 tdb`
    - Ou avec docker-compose : 
        > `docker-compose up --build`

## Accès à l'app :

Connexion en utilisant les informations suivantes :
- Mail         : example@etud.univ-ubs.fr
- Mot de passe : password123

Une fois sur dashboard :
- On peut accéder aux différents services (s'ils sont déployés, pour l'instant "Service Processus interne", "Service Maquette", "Service Mobilité Internationale", "Service Scolarité")
- Mode sombre/clair
- Quelques bugs d'UI persistent
