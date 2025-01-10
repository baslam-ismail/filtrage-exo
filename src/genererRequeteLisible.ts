import { Critere } from "./types";

export function genererRequeteLisible<T>(condition: Critere<T>): string {
  if (!condition.criteres?.length && !condition.sousConditions?.length) {
    return "Aucun filtre";
  }

  const criteresStr = condition.criteres
    ?.map((critere) =>
      Object.entries(critere)
        .map(([cle, valeur]) => `"${cle}" = "${valeur}"`)
        .join(` AND `)
    )
    .join(` ${condition.type} `); 

  const sousConditionsStr = condition.sousConditions
    ?.map((sousCond) => `(${genererRequeteLisible(sousCond)})`)
    .join(` ${condition.type} `);

  const conditions = [criteresStr, sousConditionsStr].filter(Boolean).join(` ${condition.type} `);
  return `WHERE ${conditions}`;
}
