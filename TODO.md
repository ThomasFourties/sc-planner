Composant Overlay
- [ ] Mettre le composant opacity à opacity 1 quand showForm est true avec le store

Mes tâches
- [ ] Au clic sur le bouton "Ajouter une tâche", le composant CreateTaskForm doit apparaitre
- [ ] Possiblité de cliquer une tâche pour faire apparaitre le composant TaskDetailPanel (idem que le composant CreateTaskForm sauf champs modifiables)
- [ ] Afficher la photo de profil de l'utilisateur créateur de la tâche
- [ ] Elenler la colonne action

Page Profil 
- [ ] Afficher les informations du profil
- [ ] Possiblité de modifier les informations du profil
- [ ] Ajout photo de profil (stockage S3 ou cloudinary ou bdd base64)

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




