import { filtrer } from "./src/filtrer"; 
import { Critere } from "./src/types"; 

// Exemple 1 : Filtrage des utilisateurs
const sourceUsers = () => [
  { nom: "John", age: 25, ville: "Paris" },
  { nom: "Jane", age: 30, ville: "Lyon" },
  { nom: "Alice", age: 25, ville: "Marseille" }
];

const conditionUsers: Critere<{ nom: string; age: number; ville?: string }> = {
  type: "AND",
  criteres: [{ age: 25 }],
};

const resultatUsers = filtrer(sourceUsers, conditionUsers);
console.log("Résultat (Utilisateurs) :", resultatUsers);


const conditionUsersAnd: Critere<{ nom: string; age: number; ville?: string }> = {
  type: "AND", 
  criteres: [{ age: 30 }, { ville: "Paris" }]
};

const resultatUsersAnd = filtrer(sourceUsers, conditionUsersAnd);
console.log("Résultat (Utilisateurs avec AND) :", resultatUsersAnd);


// Exemple 2 : Filtrage des produits depuis un fichier JSON
const sourceProduits = () => "produits.json"; // Chemin vers le fichier JSON

const conditionProduits: Critere<{ nom: string; prix: number; categorie?: string }> = {
  type: "OR",
  criteres: [{ categorie: "Mobilier" }, { prix: 20 }],
};

const resultatProduits = filtrer(sourceProduits, conditionProduits);
console.log("Résultat (Produits) :", resultatProduits);


