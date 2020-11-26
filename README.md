# DropShipping
## Lancer le serveur
#### Démarrer XAMPP
Dans la barre de recherche de windows rechercher XAMPP et lancer l'application.  
S'assurer que "Apache" et "MySQL" soient actifs (Arrière plan vert)

![alt text](https://github.com/BayDragon42/DropShipping/blob/master/readme_ressources/xampp.png?raw=true)

#### Lancer le terminal de git
Clique droit sur le dossier du projet et sélectionner l'option "GIT Bash Here"

![alt text](https://github.com/BayDragon42/DropShipping/blob/master/readme_ressources/gitbashhere.png?raw=true)

Le terminal est lancé directement dans le bon dossier.  
Pour démarrer le serveur, taper la commande : `node server -m 1`  
`-m 1` Permet d'avoir des informations complète sur l'exécution dans le terminal.

#### Ouvrir le navigateur
  Démarrer le navigateur et entrer l'adresse du serveur noté dans le terminal. En général ce sera : `localhost:8080`

## Informations complémentaires
#### Pages clées
- `/products` : Affichage des produits, accès au panier
- `/manage` : Accès à la partie administrative, configuration implémentées : (Menu) Configuration -> Catégories de produits/Produits/Localisations

#### Base de donnée
L'accès se fait vie le navigateur à l'adresse : `localhost/phpmyadmin`  

Sélectionner dans le menu de gauche la base de donnée : `mydb`
![alt text](https://github.com/BayDragon42/DropShipping/blob/master/readme_ressources/database.png?raw=true)
