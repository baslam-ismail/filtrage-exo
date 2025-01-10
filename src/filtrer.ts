import { processFiltrage } from "./processFiltrage";
import { chargerJSON } from "./utils";
import { genererRequeteLisible } from "./genererRequeteLisible"; 
import { Critere } from "./types";

export function filtrer<T>(
  sourceFn: () => T[] | string, 
  condition: Critere<T>       
): T[] {
  const source = sourceFn();


  const requeteLisible = genererRequeteLisible(condition);
  console.log(`Filter : ${requeteLisible}`);


  const data = typeof source === "string"
    ? chargerJSON<T>(source)
    : source;


  return processFiltrage(data, condition);
}
