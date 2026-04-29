export interface Extintor {
  id?: number;
  numero_serie: string;
  tipo: string;        // ex: "pó químico", "CO2", "água", "espuma"
  classe: string;      // ex: "A", "B", "C", "D", "K"
  fabricante: string;
  altura_instalacao: number; // em metros
  sinalizado: boolean;
}
