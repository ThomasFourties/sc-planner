Composant Overlay
- [x] Mettre le composant opacity à opacity 1 quand showForm est true avec le store

Mes tâches
- [x] Au clic sur le bouton "Ajouter une tâche", le composant CreateTaskForm doit apparaitre
- [x] Possiblité de cliquer une tâche pour faire apparaitre le composant TaskDetailPanel (idem que le composant CreateTaskForm sauf champs modifiables)
- [0] Afficher la photo de profil de l'utilisateur créateur de la tâche (plus tard)
- [x] Enlever la colonne action
- [x] Pouvoir changer le statut d'une tâche directement depuis la liste des tâches, pas besoin de cliquer sur la tâche
- [x] Pouvoir cliquer sur toutes la tache pour ouvrir pas seulement sur le titre de la tache
- [x] Mettre en place le vrai delete sans l'alert
- [x] Mettre un petit label en dessous des fichiers crée par en gris
- [x] Enlever le message tache créer en appuyant sur le bouton ajouter une tâche, de plus il faut fermer la modal
- [x] Rajouter dans le tableau des tâches, la colonne "priorité"
- [x] Rajouter le même style de la scrollbar wekbit du tableau taches aux listes des priorité, status, etc.

Profil 
- [ ] Afficher les informations du profil
- [ ] Possiblité de modifier les informations du profil
- [ ] Ajout photo de profil (stockage S3 ou cloudinary ou bdd base64)

Planning
- [ ] Faire la table Planning (BDD + API)
- [ ] Une vue planning sur les taches de la semaine et semaine suivante ou precedente
- [ ] En fonction de la date de la tache, afficher la date de fin prevue de la tache
- [ ] En fonction de la durée de la tache, positionner sur le planning -> Une journée 8.75h , une tache peut avoir une durée incrémenté de 0.25h
- [ ] Drag and drop des taches sur le planning -> Ce qui peut changer la durée (si on l'allonge ou raccourcir) -> Changer de date de debut et de fin
- [ ] Possiblité de cliquer sur une tache pour faire apparaitre le composant TaskDetailPanel (idem que le composant CreateTaskForm sauf champs modifiables)

Navbar 
- [ ] Au clic sur le bouton "Projets", afficher la page Projets (à venir)
- [ ] Au clic sur le bouton "Clients", afficher la page Clients (à venir)
- [ ] Faire remonter la photo de profil de l'utilisateur dans la navbar

Client 
- [ ] Faire la table Clients (BDD + API) -> Un client est lié à unutilisateur, il a un nom, description, logo.. Il a aussi un ou plusieurs projets

Projets
- [ ] Faire la table Projets (BDD + API) -> Un projet est lié à un client, il a un nom, description, statut, date de début, date de fin, temps vendus, tâches (table tasks), etc.

Recherche
- [ ] Lorsque l'utilisateur tape dans la barre de recherche, afficher les tâches, les projets, les clients, les utilisateurs qui contiennent le texte tapé dans la barre de recherche..
- [ ] Au clic des ses infos rediriger vers la page profil de l'utilisateur, ou la page de la tâche, projet, client...

Paramètres
- [ ] Afficher les paramètres de l'application (langue, thème, etc.)
- [ ] Possiblité de modifier les paramètres de l'application

Aide
- [ ] Afficher l'aide de l'application

UI/UX
- [ ] Améliorer le bouton de deconnexion

Spec 
- [ ] Trouver une solution pour l'attribution des roles (admin, user, etc.) -> Secret link ? Ou depuis le dashboard du chef de projet ?
- [ ] Dashbaord équipe -> Tous les membres de l'équipe
- [ ] Vue Chef de proejt avec plus de droit sur les profil utilisateur (changer de role, supprimer, assigné à un projet, etc.)




