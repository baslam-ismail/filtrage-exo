import * as fs from "fs";

export function chargerJSON<T>(chemin: string): T[] {
  try {
    const contenu = fs.readFileSync(chemin, "utf-8");
    return JSON.parse(contenu) as T[];
  } catch (error) {

    console.error(`Erreur lors de la lecture du fichier JSON : ${(error as Error).message}`);
    return [];
  }
}