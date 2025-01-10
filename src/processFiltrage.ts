import { Critere } from "./types";

export function processFiltrage<T>(liste: T[], condition: Critere<T>): T[] {
  return liste.filter((item) => appliquerCondition(item, condition));
}

function appliquerCondition<T>(item: T, condition: Critere<T>): boolean {
  switch (condition.type) {
    case "AND":
      return (
        (condition.criteres?.every((critere) => correspond(item, critere)) ?? true) &&
        (condition.sousConditions?.every((sousCond) => appliquerCondition(item, sousCond)) ?? true)
      );

    case "OR":
      return (
        (condition.criteres?.some((critere) => correspond(item, critere)) ?? false) ||
        (condition.sousConditions?.some((sousCond) => appliquerCondition(item, sousCond)) ?? false)
      );

    case "NOT":
      return !(
        (condition.criteres?.some((critere) => correspond(item, critere)) ?? false) ||
        (condition.sousConditions?.some((sousCond) => appliquerCondition(item, sousCond)) ?? false)
      );

    case "ANDNOT":
      return (
        (condition.criteres?.every((critere) => correspond(item, critere)) ?? true) &&
        !(condition.sousConditions?.some((sousCond) => appliquerCondition(item, sousCond)) ?? false)
      );

    case "ORNOR":
      return !(
        (condition.criteres?.some((critere) => correspond(item, critere)) ?? false) ||
        (condition.sousConditions?.some((sousCond) => appliquerCondition(item, sousCond)) ?? false)
      );

    default:
      return false;
  }
}

function correspond<T>(item: T, critere: Partial<T>): boolean {
  return Object.entries(critere).every(([cle, valeur]) => {
    return item[cle as keyof T] === valeur;
  });
}
