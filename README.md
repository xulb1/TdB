# escolis-dashboard


## Récupération du projet
> `git clone https://github.com/xulb1/TdB.git`


## Lancement du projet en local : 
> `npm start`
    ou
> `node server.js`


Si erreur : 
- supprimer le dossier /node_modules/
> rm -R node_modules/
- reinstaller les modules : 
> npm i

(et normalement ça marche...)


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
Mail et Mot de passe:
- example@etud.univ-ubs.fr
- password123


Une fois sur dashboard : 
- on peut accéder aux différents services (s'ils sont déployés, pour l'instant juste "Service Processus interne", "Service Maquette", "Service Mobilité Internationale", "Service Scolarité")
- mode sombre/clair
- quelques bugs d'interface aussi

