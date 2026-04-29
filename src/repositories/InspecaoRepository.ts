import db from "../database/database";
import { Inspecao } from "../models/Inspecao";
import { Checklist } from "../models/Checklist";

type InspecaoRow = {
  id: number;
  extintor_id: number;
  data_inspecao: string;
  responsavel: string;
  observacoes: string | null;
};

type ChecklistRow = {
  id: number;
  inspecao_id: number;
  item: string;
  conforme: number;
};

function rowToChecklist(row: ChecklistRow): Checklist {
  return {
    id: row.id,
    inspecao_id: row.inspecao_id,
    item: row.item,
    conforme: row.conforme === 1,
  };
}

function montarInspecao(row: InspecaoRow, checklist: Checklist[]): Inspecao {
  return {
    id: row.id,
    extintor_id: row.extintor_id,
    data_inspecao: row.data_inspecao,
    responsavel: row.responsavel,
    observacoes: row.observacoes ?? undefined,
    checklist,
  };
}

export class InspecaoRepository {
  salvar(inspecao: Inspecao): Inspecao {
    const insertInspecao = db.prepare(
      `INSERT INTO inspecoes (extintor_id, data_inspecao, responsavel, observacoes)
       VALUES (?, ?, ?, ?)`
    );
    const insertItem = db.prepare(
      `INSERT INTO checklist_inspecao (inspecao_id, item, conforme) VALUES (?, ?, ?)`
    );

    const executar = db.transaction(() => {
      const resultado = insertInspecao.run(
        inspecao.extintor_id,
        inspecao.data_inspecao,
        inspecao.responsavel,
        inspecao.observacoes ?? null
      );
      const inspecaoId = Number(resultado.lastInsertRowid);

      const checklistSalvo: Checklist[] = inspecao.checklist.map((item) => {
        const res = insertItem.run(inspecaoId, item.item, item.conforme ? 1 : 0);
        return {
          id: Number(res.lastInsertRowid),
          inspecao_id: inspecaoId,
          item: item.item,
          conforme: item.conforme,
        };
      });

      return montarInspecao(
        {
          id: inspecaoId,
          extintor_id: inspecao.extintor_id,
          data_inspecao: inspecao.data_inspecao,
          responsavel: inspecao.responsavel,
          observacoes: inspecao.observacoes ?? null,
        },
        checklistSalvo
      );
    });

    return executar();
  }

  buscarPorId(id: number): Inspecao | null {
    const row = db.prepare("SELECT * FROM inspecoes WHERE id = ?").get(id) as InspecaoRow | undefined;
    if (!row) return null;

    const checklistRows = db
      .prepare("SELECT * FROM checklist_inspecao WHERE inspecao_id = ?")
      .all(id) as ChecklistRow[];

    return montarInspecao(row, checklistRows.map(rowToChecklist));
  }

  // Histórico completo de inspeções de um extintor
  listarPorExtintorId(extintor_id: number): Inspecao[] {
    const rows = db
      .prepare("SELECT * FROM inspecoes WHERE extintor_id = ? ORDER BY data_inspecao DESC")
      .all(extintor_id) as InspecaoRow[];

    const buscarChecklist = db.prepare(
      "SELECT * FROM checklist_inspecao WHERE inspecao_id = ?"
    );

    return rows.map((row) => {
      const checklistRows = buscarChecklist.all(row.id) as ChecklistRow[];
      return montarInspecao(row, checklistRows.map(rowToChecklist));
    });
  }

  listar(): Inspecao[] {
    const rows = db
      .prepare("SELECT * FROM inspecoes ORDER BY data_inspecao DESC")
      .all() as InspecaoRow[];

    const buscarChecklist = db.prepare(
      "SELECT * FROM checklist_inspecao WHERE inspecao_id = ?"
    );

    return rows.map((row) => {
      const checklistRows = buscarChecklist.all(row.id) as ChecklistRow[];
      return montarInspecao(row, checklistRows.map(rowToChecklist));
    });
  }
}
