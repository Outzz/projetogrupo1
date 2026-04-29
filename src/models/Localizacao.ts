export interface Localizacao {
  id?: number;
  extintor_id: number;
  predio: string;
  andar: string;
  setor: string;
  mapa_planta?: string; // caminho ou referência da planta/mapa
}
