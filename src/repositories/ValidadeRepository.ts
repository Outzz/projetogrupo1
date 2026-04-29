import db from "../database/database";
import { Validade } from "../models/Validade";

export class ValidadeRepository {
  salvar(validade: Validade): Validade {
    const resultado = db
      .prepare(
        `INSERT INTO validades (extintor_id, validade_carga, validade_teste_hidrostatico)
         VALUES (?, ?, ?)`
      )
      .run(validade.extintor_id, validade.validade_carga, validade.validade_teste_hidrostatico);

    return { ...validade, id: Number(resultado.lastInsertRowid) };
  }

  buscarPorExtintorId(extintor_id: number): Validade | null {
    return (
      (db
        .prepare("SELECT * FROM validades WHERE extintor_id = ?")
        .get(extintor_id) as Validade) ?? null
    );
  }

  atualizar(extintor_id: number, dados: Partial<Validade>): Validade | null {
    const atual = this.buscarPorExtintorId(extintor_id);
    if (!atual) return null;

    const atualizado = { ...atual, ...dados };
    db.prepare(
      `UPDATE validades
       SET validade_carga = ?, validade_teste_hidrostatico = ?
       WHERE extintor_id = ?`
    ).run(atualizado.validade_carga, atualizado.validade_teste_hidrostatico, extintor_id);

    return atualizado;
  }

  // Retorna extintores cuja validade_carga vence em até X dias
  buscarAlertasCarga(dias: number): Validade[] {
    return db
      .prepare(
        `SELECT * FROM validades
         WHERE DATE(validade_carga) <= DATE('now', ? || ' days')
           AND DATE(validade_carga) >= DATE('now')`
      )
      .all(String(dias)) as Validade[];
  }

  // Retorna extintores cujo teste hidrostático vence em até X dias
  buscarAlertasTesteHidrostatico(dias: number): Validade[] {
    return db
      .prepare(
        `SELECT * FROM validades
         WHERE DATE(validade_teste_hidrostatico) <= DATE('now', ? || ' days')
           AND DATE(validade_teste_hidrostatico) >= DATE('now')`
      )
      .all(String(dias)) as Validade[];
  }
}
