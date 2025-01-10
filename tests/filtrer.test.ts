import { filtrer } from "../src/filtrer";
import * as fs from "fs";
import { Critere } from "../src/types";
import { Produit } from "../src/types"; 


jest.mock("fs");

const mockDataUsers  = JSON.stringify([
  { nom: "John", age: 25, ville: "Paris" },
  { nom: "Jane", age: 30, ville: "Lyon" },
]);

const mockDataProduits = JSON.stringify([
  { nom: "Laptop", prix: 1500, categorie: "Électronique" },
  { nom: "Téléphone", prix: 800, categorie: "Électronique" },
  { nom: "Table", prix: 300, categorie: "Mobilier" },
  { nom: "Chaise", prix: 100, categorie: "Mobilier" },
  { nom: "Livre", prix: 20, categorie: "Papeterie" }
]);

describe("Tests pour la fonction 'filtrer'", () => {
  beforeAll(() => {
    jest.spyOn(fs, "readFileSync").mockImplementation((path: fs.PathOrFileDescriptor): string => {
      if (path === "users.json") {
        return mockDataUsers;
      }
      if (path === "produits.json") {
        return mockDataProduits;
      }
      throw new Error("Fichier introuvable");
    });
  });

  describe("Tests pour les utilisateurs", () => {
  test("Aucun critère - Retourne toute la liste", () => {
    const users = [
      { nom: "John", age: 25 },
      { nom: "Alice", age: 30 },
    ];
  
    const condition: Critere<{ nom: string; age: number }> = {
      type: "AND",
      criteres: [],
    };
  
    const resultat = filtrer(() => users, condition);
    expect(resultat).toEqual(users);
  });
  

  test("Critère unique - nom = 'John'", () => {
    const users = [
      { nom: "John", age: 25 },
      { nom: "Alice", age: 30 },
    ];
  
    const condition: Critere<{ nom: string; age: number }> = {
      type: "AND",
      criteres: [{ nom: "John" }],
    };
  
    const resultat = filtrer(() => users, condition);
    expect(resultat).toEqual([{ nom: "John", age: 25 }]);
  });
  

  test("Aucun résultat trouvé", () => {
    const users = [
      { nom: "John", age: 25 },
      { nom: "Alice", age: 30 },
    ];
  
    const condition: Critere<{ nom: string; age: number }> = {
      type: "AND",
      criteres: [{ nom: "Bob" }],
    };
  
    const resultat = filtrer(() => users, condition);
    expect(resultat).toEqual([]);
  });
  

  test("Deux critères en ET", () => {
    const users = [
      { nom: "John", age: 25 },
      { nom: "John", age: 30 },
    ];
  
    const condition: Critere<{ nom: string; age: number }> = {
      type: "AND",
      criteres: [{ nom: "John" }, { age: 25 }],
    };
  
    const resultat = filtrer(() => users, condition);
    expect(resultat).toEqual([{ nom: "John", age: 25 }]);
  });
  

  test("Deux critères en OU", () => {
    const users = [
      { nom: "John", age: 25 },
      { nom: "Alice", age: 30 },
    ];
  
    const condition: Critere<{ nom: string; age: number }> = {
      type: "OR",
      criteres: [{ nom: "John" }, { age: 30 }],
    };
  
    const resultat = filtrer(() => users, condition);
    expect(resultat).toEqual([
      { nom: "John", age: 25 },
      { nom: "Alice", age: 30 },
    ]);
  });
  

  test("NON - Exclusion d'un critère", () => {
    const users = [
      { nom: "John", age: 25 },
      { nom: "Alice", age: 30 },
    ];
  
    const condition: Critere<{ nom: string; age: number }> = {
      type: "NOT",
      criteres: [{ nom: "John" }],
    };
  
    const resultat = filtrer(() => users, condition);
    expect(resultat).toEqual([{ nom: "Alice", age: 30 }]);
  });

  test("Sous-conditions en ET", () => {
    const users = [
      { nom: "John", age: 25 },
      { nom: "John", age: 30 },
      { nom: "Alice", age: 30 },
    ];
  
    const condition: Critere<{ nom: string; age: number }> = {
      type: "AND",
      criteres: [{ nom: "John" }],
      sousConditions: [{ type: "OR", criteres: [{ age: 25 }, { age: 30 }] }],
    };
  
    const resultat = filtrer(() => users, condition);
    expect(resultat).toEqual([
      { nom: "John", age: 25 },
      { nom: "John", age: 30 },
    ]);
  });
  
  test("Sous-conditions en NON", () => {
    const users = [
      { nom: "John", age: 25 },
      { nom: "John", age: 30 },
      { nom: "Alice", age: 25 },
    ];
  
    const condition: Critere<{ nom: string; age: number }> = {
      type: "AND",
      criteres: [{ nom: "John" }],
      sousConditions: [{ type: "NOT", criteres: [{ age: 25 }] }],
    };
  
    const resultat = filtrer(() => users, condition);
    expect(resultat).toEqual([{ nom: "John", age: 30 }]);
  });

  test("ANDNOT - Exclusion d'une sous-condition", () => {
    const users = [
      { nom: "John", age: 25 },
      { nom: "John", age: 30 },
      { nom: "Alice", age: 25 },
    ];
  
    const condition: Critere<{ nom: string; age: number }> = {
      type: "ANDNOT",
      criteres: [{ nom: "John" }],
      sousConditions: [{ type: "AND", criteres: [{ age: 25 }] }],
    };
  
    const resultat = filtrer(() => users, condition);
    expect(resultat).toEqual([{ nom: "John", age: 30 }]);
  });

  test("Fichier JSON - Critère unique", () => {
    const sourceJson = () => "users.json";
  
    const condition: Critere<{ nom: string; age: number; ville?: string }> = {
      type: "AND",
      criteres: [{ age: 25 }],
    };
  
    const resultat = filtrer(sourceJson, condition);
    expect(resultat).toEqual([{ nom: "John", age: 25, ville: "Paris" }]);
  });

  test("Fichier JSON introuvable", () => {
    const sourceJson = () => "inexistant.json";
  
    const condition: Critere<{ nom: string; age: number; ville?: string }> = {
      type: "AND",
      criteres: [{ ville: "Paris" }],
    };
  
    const resultat = filtrer(sourceJson, condition);
    expect(resultat).toEqual([]);
  });

  test("Liste vide", () => {
    const users: { nom: string; age: number }[] = [];
  
    const condition: Critere<{ nom: string; age: number }> = {
      type: "AND",
      criteres: [{ nom: "John" }],
    };
  
    const resultat = filtrer(() => users, condition);
    expect(resultat).toEqual([]);
  });

  test("Critères imbriqués profondément", () => {
    const users = [
      { nom: "John", age: 30, ville: "Paris" },
      { nom: "Alice", age: 25, ville: "Lyon" },
    ];
  
    const condition: Critere<{ nom: string; age: number; ville?: string }> = {
      type: "AND",
      criteres: [],
      sousConditions: [
        {
          type: "OR",
          sousConditions: [
            { type: "AND", criteres: [{ nom: "John" }, { ville: "Paris" }] },
            { type: "AND", criteres: [{ age: 25 }] },
          ],
        },
      ],
    };
  
    const resultat = filtrer(() => users, condition);
    expect(resultat).toEqual([
      { nom: "John", age: 30, ville: "Paris" },
      { nom: "Alice", age: 25, ville: "Lyon" },
    ]);
  });

  });
  
  describe("Tests pour les produits", () => {
    test("Critère simple - catégorie = 'Électronique'", () => {
      const sourceJson = () => "produits.json";

      const condition: Critere<{ nom: string; prix: number; categorie?: string }> = {
        type: "AND",
        criteres: [{ categorie: "Électronique" }],
      };

      const resultat = filtrer(sourceJson, condition);
      expect(resultat).toEqual([
        { nom: "Laptop", prix: 1500, categorie: "Électronique" },
        { nom: "Téléphone", prix: 800, categorie: "Électronique" }
      ]);
    });

    test("Sous-conditions - catégorie = 'Mobilier' OU prix < 50", () => {
      const sourceJson = () => "produits.json";

      const condition: Critere<{ nom: string; prix: number; categorie?: string }> = {
        type: "OR",
        criteres: [{ categorie: "Mobilier" }],
        sousConditions: [{ type: "AND", criteres: [{ prix: 20 }] }],
      };

      const resultat = filtrer(sourceJson, condition);
      expect(resultat).toEqual([
        { nom: "Table", prix: 300, categorie: "Mobilier" },
        { nom: "Chaise", prix: 100, categorie: "Mobilier" },
        { nom: "Livre", prix: 20, categorie: "Papeterie" }
      ]);
    });
  });

  test("Log généré pour la requête", () => {
    const consoleSpy = jest.spyOn(console, "log");
  
    const condition: Critere<{ nom: string; age: number; ville?: string }> = {
      type: "AND",
      criteres: [{ nom: "John" }, { age: 25 }],
    };
  
    const users = [
      { nom: "John", age: 25, ville: "Paris" },
      { nom: "Alice", age: 30, ville: "Lyon" },
    ];
  
    filtrer(() => users, condition);
  
    expect(consoleSpy).toHaveBeenCalledWith(`Filtre en cours : WHERE "nom" = "John" AND "age" = "25"`);
    consoleSpy.mockRestore();
  });
  

  });
