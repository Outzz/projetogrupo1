import { ChecklistItem } from "./Checklist";

export interface Inspecao {
  id?: number;
  extintor_id: number;
  data_inspecao: string;   // ISO 8601: YYYY-MM-DD
  responsavel: string;
  observacoes?: string;
  checklist: ChecklistItem[];
}
