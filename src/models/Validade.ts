export interface Validade {
  id?: number;
  extintor_id: number;
  validade_carga: string;               // ISO 8601: YYYY-MM-DD
  validade_teste_hidrostatico: string;  // ISO 8601: YYYY-MM-DD
}
