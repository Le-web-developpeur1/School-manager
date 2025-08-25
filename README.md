# 🏫 Gestion-Scolaire

School-manager est une application web complète pour la gestion académique d’un établissement scolaire. 
Elle permet de suivre les élèves, les enseignants, les paiements, les statistiques et bien plus, avec une interface claire et dynamique.

# 🚀Fonctionnalités Principales

##    Espace Administrateur

    1. Tableau de bord

   - Statistiques globales : nombre d’élèves, enseignants, classes, événements

   - Graphiques interactifs : répartition par classe ou niveau

    2. Gestion des élèves

   - Ajouter, modifier ou supprimer un élève

   - Affichage par classe, recherche facile

   - Détails complets : matricule auto-généré, nom, prénom, date de naissance, classe

   - Option d’impression de la fiche élève

    3. Gestion des enseignants

   - Ajouter, modifier ou supprimer un enseignant

   - Affectation directe à une ou plusieurs matières et classes

   - Données clés : nom, prénom, email, adresse, téléphone

   - Option d’impression du profil

    4. Matières

   - Créer, modifier ou supprimer une matière

    5. Classes

   - Créer, modifier ou supprimer une classe

   - Définir un nombre maximal d’élèves par classe

    6. Paramètres & Gestion des administrateurs

   - Modification des informations personnelles de l’admin connecté

   - Création, modification, suppression ou désactivation d’un autre admin

   - Affichage des métadonnées : date de création, dernière connexion, statut

   - Définition des niveaux d’autorité (accès restreint ou total).

##    Espace Comptable

   - Accès dédié et sécurisé

   - Un espace réservé exclusivement au comptable

   - Accès contrôlé par rôle avec permissions limitées aux données financières

###    Enregistrement des paiements

   - Ajout manuel d’un paiement par élève : frais d’inscription, mensualités

###    Historique des transactions

   - Consultation filtrable par élève, date ou classe

   - Vue mensuelle ou annuelle des entrées financières

   - Possibilité d’export au format PDF ou CSV

   - Génération de reçus

   - Génération automatique d’un reçu imprimable après enregistrement

   - Affichage des détails : nom de l’élève, montant, type de paiement, date

   - Suivi de la situation financière

   - Statut de paiement pour chaque élève (à jour, solde dû…)

   - Calcul automatique des totaux encaissés et restant à encaisser

###   Tableau de bord financier

   - Graphiques de suivi : revenus par mois, par classe, ou par type de frais

   - Visualisation claire.

   - Accès uniquement visible par le comptable et l’admin général

#  🔜 Fonctionnalités Futur

##    Espace enseignant

    1. Sélection de classe et matière

    Affichage dynamique des classes et matières affectées à l’enseignant

    Sécurité : l’enseignant ne peut modifier que les notes des élèves dont il a la charge

    2. Ajout / Modification de notes

    Choix d’une période (semestre, trimestre, séquence…)

    Saisie des notes par élève (coefficient, type : devoir, examen, contrôle continu…)

    Ajout d’un commentaire facultatif (remarques pédagogiques)

    3. Calcul automatique de moyenne

    Moyennes calculées automatiquement par élève et par matière

    Possibilité de visualiser les résultats globaux de la classe

    4. Téléchargement / export

    Export des relevés de notes (PDF, Excel)

    Prévisualisation du bulletin par matière ou par élève

##  Système de messagerie interne (chat ou support)

-   Échanges en temps réel entre administration, enseignants

-   Historique de conversation intégré

##  Développement d'une application mobile

###  Pour l’administration
-   Consultation des tableaux de bord depuis mobile

-   Envoi de notifications urgentes

-   Suivi des paiements reçus et alertes financières

###  Pour les élèves
-   Reçus de paiement téléchargeables

-   Accès rapide à l’emploi du temps et aux notes

###  Pour les enseignants
-   Saisie des présences quotidienne en un clic

-   Ajout des notes / évaluations par élève

-   Historique par classe, par matière

-   Accès à leur emploi du temps et aux événements liés

#  🛠️ Stack technique

|------------Frontend----------|------------Backend-------------|----------Base de données-------|
      React + Vite + TS	              Node.js + Express	                  MongoDB + Mongoose
        Tailwind CSS	                   REST API	

# 📁 Structure du projet
```
/Gestion-Scolaire
├── back/                # Backend Express + Mongoose
│   ├── config/
│   ├── controllers/
│   ├── helpers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── front/               # Frontend React + Vite
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── utils/
└── README.md

# 📦 Installation

## Cloner le repo
git clone https://github.com/Le-web-developpeur1/School-manager

## Backend
cd back
npm install
npm start

## Frontend
cd front
npm install
npm run dev


# 👨🏾‍🏫 Auteur
Développée par Boubacar Bah, developpeur web fullStack et mobile, et formateur en développement web.