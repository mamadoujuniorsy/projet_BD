**Prénom et Nom: Mamadou Sy**

**Classe: GLSIA**

**<u>D</u><u>é</u><u>ployer un cluster MongoDB sous Docker</u>**

**I) Installation de l'image Mongo de Docker**

On va excécuter la commande **docker pull mongo:5 **pour installer
l'image mongo sous docker

On va taper docker images pour vérifier si l'image est téléchagée ou
non.

Et on voit que notre image est belle et bien présente

**II) création réseau docker**

Utilisons la commande **docker network create **pour créer un réseau
Docker. Dans notre cas, le réseau s'appelle mongoCluster, comme indiqué
dans les instructions.

Après avoir exécuté la commande, on peut vérifier que le réseau a été
créé avec succès en utilisant **docker network ls**

**III) Démarrage des instances mongo**

On va maintenant démarrer 3 conteneurs mongo en utilisant les commandes
suivantes:

En tapant **docker ps **on voit bien que nos 3 conteneurs sont en marche

**IV)Réplication**

Là on a créé un jeu de répliques réels avec nos 3 clusters.

Cette commande indique à Docker d'exécuter l'outil mongosh dans le
conteneur nommé mongo1. mongosh essaiera alors d'évaluer la commande
rs.initiate() pour lancer le jeu de répliques. Dans le cadre de l'objet
de configuration transmis à rs.initiate(), on doit spécifier le nom du
jeu de répliques (myReplicaSet, dans ce cas), ainsi que la liste des
membres qui feront partie du jeu de répliques. Les noms d'hôte des
conteneurs sont les noms des conteneurs spécifiés par le paramètre
--name dans la commande docker run. On constate que ça renvoie {ok} donc
tout s'est bien passé

Les données seront toujours là. Vous pouvez voir que le cluster est
toujours en cours d'exécution en utilisant rs.status() sur le conteneur
mongo2 .

Nous verrons toujours le jeu de réplicas, mais faut savoir que le
premier membre est maintenant arrêté et que l'un des deux autres membres
a été élu comme noeud principal. Si on redémarre notre conteneur mongo1,
nous pourrons le revoir dans le jeu de répliques, mais en tant que
membre secondaire.

Maintenant que tout est ok on va pouvoir passer à la phase suivante qui
porte sur la manipulation de base.

**V) Manipulation de base**

On va utiliser la commande **docker exec -it mongo2 mongosh **pour se
connecter à notre serveur

\- Dans la figure ci-dessous on crée notre base de données qui s'appelle
DBLP puis on va créer une collection du nom de publis

-On va maintenant copier notre fichier json qui contient des données
pour alimenter notre base de données.

-Maintenant qu'on a copié notre fichie dblp.json, on va l'importer sur
notre base de données comme suit:

Voilà il semble que toutes nos données ont été importé, on va maintenant
tester des requétes:

1)Liste de tous les livres (type "Book") : db.publis.find({ type: "Book"
})

2)Liste des publications depuis 2011 : db.publis.find({ year: { $gte:
2011 } })

3\) Liste des livres depuis 2014 : db.publis.find({ type: "Book", year:
{ $gte: 2014 } })

4)Liste des publications de l'auteur "Toru Ishida" : db.publis.find({
authors: "Toru Ishida" })

5)Liste de tous les éditeurs (type "publisher"), distincts :
db.publis.distinct("publisher")

6\) Liste de tous les auteurs distincts : db.publis.distinct("authors")

7\) Trier les publications de "Toru Ishida" par titre de livre et par
page de début : db.publis.find({ authors: "Toru Ishida" }).sort({ title:
1, pages: 1 })

8)Projeter le résultat sur le titre de la publication et les pages :
db.publis.find({}, { title: 1, pages: 1, \_id: 0 })

9)Compter le nombre de ses publications : db.publis.count({ authors:
"Toru Ishida" })

10)Compter le nombre de publications depuis 2011 et par type :
db.publis.aggregate(\[

{ $match: { year: { $gte: 2011 } } },

{ $group: { \_id: "$type", count: { $sum: 1 } } }

\])

11)Compter le nombre de publications par auteur et trier le résultat par
ordre croissant : db.publis.aggregate(\[

{ $unwind: "$authors" },

{ $group: { \_id: "$authors", count: { $sum: 1 } } },

{ $sort: { count: 1 } }

\])

VI)Pratique de Map/Reduce

1)Pour chaque document de type livre, émettre le document avec pour clé
"title" :

2)Pour chacun de ses livres, donner le nombre de ses auteurs :

3)Pour chaque document ayant "booktitle" (chapitre) publié par Springer,
donner le nombre de ses chapitres :

FIN
