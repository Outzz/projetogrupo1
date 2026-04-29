import db from "../database/database";
import { Extintor } from "../models/Extintor";

type ExtintorRow = {
  id: number;
  numero_serie: string;
  tipo: string;
  classe: string;
  fabricante: string;
  altura_instalacao: number;
  sinalizado: number;
};

function rowToExtintor(row: ExtintorRow): Extintor {
  return {
    id: row.id,
    numero_serie: row.numero_serie,
    tipo: row.tipo,
    classe: row.classe,
    fabricante: row.fabricante,
    altura_instalacao: row.altura_instalacao,
    sinalizado: row.sinalizado === 1,
  };
}

export class ExtintorRepository {
  salvar(extintor: Extintor): Extintor {
    const resultado = db
      .prepare(
        `INSERT INTO extintores (numero_serie, tipo, classe, fabricante, altura_instalacao, sinalizado)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        extintor.numero_serie,
        extintor.tipo,
        extintor.classe,
        extintor.fabricante,
        extintor.altura_instalacao,
        extintor.sinalizado ? 1 : 0
      );

    return { ...extintor, id: Number(resultado.lastInsertRowid) };
  }

  listar(): Extintor[] {
    const rows = db.prepare("SELECT * FROM extintores").all() as ExtintorRow[];
    return rows.map(rowToExtintor);
  }

  buscarPorId(id: number): Extintor | null {
    const row = db.prepare("SELECT * FROM extintores WHERE id = ?").get(id) as ExtintorRow | undefined;
    return row ? rowToExtintor(row) : null;
  }

  buscarPorNumeroSerie(numero_serie: string): Extintor | null {
    const row = db
      .prepare("SELECT * FROM extintores WHERE numero_serie = ?")
      .get(numero_serie) as ExtintorRow | undefined;
    return row ? rowToExtintor(row) : null;
  }

  atualizar(id: number, dados: Partial<Extintor>): Extintor | null {
    const atual = this.buscarPorId(id);
    if (!atual) return null;

    const atualizado = { ...atual, ...dados };
    db.prepare(
      `UPDATE extintores
       SET numero_serie = ?, tipo = ?, classe = ?, fabricante = ?, altura_instalacao = ?, sinalizado = ?
       WHERE id = ?`
    ).run(
      atualizado.numero_serie,
      atualizado.tipo,
      atualizado.classe,
      atualizado.fabricante,
      atualizado.altura_instalacao,
      atualizado.sinalizado ? 1 : 0,
      id
    );

    return { ...atualizado, id };
  }

  excluir(id: number): boolean {
    const resultado = db.prepare("DELETE FROM extintores WHERE id = ?").run(id);
    return resultado.changes > 0;
  }
}
