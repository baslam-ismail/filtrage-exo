# Projet de Filtrage en TypeScript (Type Générique)

Ce projet est un exercice permettant de filtrer des données (de tout type : utilisateurs, produits, transactions, etc.) en utilisant des critères dynamiques et des opérateurs logiques tels que **AND**, **OR**, **NOT**, **ANDNOT**, et **ORNOR**. Le projet est entièrement basé sur TypeScript.

---

## Fonctionnalités

- **Opérateurs Logiques** :
  - **AND** : Tous les critères doivent être remplis.
  - **OR** : Au moins un critère doit être rempli.
  - **NOT** : Exclut les résultats correspondant à certains critères.
  - **ANDNOT** : Tous les critères doivent être remplis tout en excluant certaines conditions.
  - **ORNOR** : Au moins une condition doit être remplie tout en excluant d'autres.

- **Type Générique** :
  - Le filtrage est applicable à n'importe quel type d'objet (par exemple, utilisateurs, produits, transactions).

- **Sources de Données Flexibles** :
  - **En Mémoire** : Liste d'objets définie dans le code.
  - **Depuis JSON** : Chargement de données à partir de fichiers externes.

- **Logs Lisibles** :
  - Les requêtes sont affichées dans un format lisible (similaire à SQL).
  - Exemple : `WHERE "age" = 25 AND "city" = "Paris"`

---

## Installation

### 1. Cloner le Projet

```bash
git clone https://github.com/baslam-ismail/Filtrage-TS.git
cd Filtrage-TS
