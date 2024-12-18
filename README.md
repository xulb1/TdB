# escolis-dashboard

## Présentation du projet
Le tableau de bord sert à faire le lien entre les différents services de l'école et les utilisateurs. Il doit permettre à un utilisateur authentifié d'accéder aux services auxquels il est autorisé (en fonction de son niveau : administrateur, professeur, élève, intervenant, ...).


# Lancement du projet
## En local : 
Après avoir récupéré le projet, installer les modules npm nécessaire (N.B. : Si ils sont déjà présents, il est préférable de les supprimer et de les réinstaller, car il peut y avoir des conflits en fonction de la version de npm installée sur votre OS): 
$ `npm i`
Lancer ensuite un audit des modules installés, pour vérifier qu'ils sont bien à jour (dernière version) : 
$ `npm audit`
Si besoin, corrigé les versions des modules obsolètes via : 
$ `npm audit fix`
Après cela, vous pouvez lancer le projet : 
$ `npm start`
    ou
$ `node server.js`


## En production

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
