import db from "../database/database";
import { Localizacao } from "../models/Localizacao";

export class LocalizacaoRepository {
  salvar(localizacao: Localizacao): Localizacao {
    const resultado = db
      .prepare(
        `INSERT INTO localizacoes (extintor_id, predio, andar, setor, mapa_planta)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(
        localizacao.extintor_id,
        localizacao.predio,
        localizacao.andar,
        localizacao.setor,
        localizacao.mapa_planta ?? null
      );

    return { ...localizacao, id: Number(resultado.lastInsertRowid) };
  }

  buscarPorExtintorId(extintor_id: number): Localizacao | null {
    return (
      (db
        .prepare("SELECT * FROM localizacoes WHERE extintor_id = ?")
        .get(extintor_id) as Localizacao) ?? null
    );
  }

  atualizar(extintor_id: number, dados: Partial<Localizacao>): Localizacao | null {
    const atual = this.buscarPorExtintorId(extintor_id);
    if (!atual) return null;

    const atualizado = { ...atual, ...dados };
    db.prepare(
      `UPDATE localizacoes
       SET predio = ?, andar = ?, setor = ?, mapa_planta = ?
       WHERE extintor_id = ?`
    ).run(atualizado.predio, atualizado.andar, atualizado.setor, atualizado.mapa_planta ?? null, extintor_id);

    return atualizado;
  }

  listarPorPredio(predio: string): Localizacao[] {
    return db
      .prepare("SELECT * FROM localizacoes WHERE predio LIKE ?")
      .all(`%${predio}%`) as Localizacao[];
  }

  listarPorSetor(setor: string): Localizacao[] {
    return db
      .prepare("SELECT * FROM localizacoes WHERE setor LIKE ?")
      .all(`%${setor}%`) as Localizacao[];
  }
}
