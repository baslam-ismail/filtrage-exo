export type Operateur = "AND" | "OR" | "NOT" | "ANDNOT" | "ORNOR";

export interface Critere<T> {
  type: Operateur; 
  criteres?: Partial<T>[]; 
  sousConditions?: Critere<T>[]; 
}

export interface Produit {
  nom: string;
  prix: number;
  categorie?: string;
}