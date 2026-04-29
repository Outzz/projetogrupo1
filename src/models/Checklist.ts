export interface Checklist {
  id?: number;
  inspecao_id: number;
  item: string;      // ex: "Lacre intacto", "Pressão adequada", "Sinalização visível"
  conforme: boolean;
}
