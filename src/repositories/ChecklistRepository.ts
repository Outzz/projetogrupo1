import db from "../database/database";
import { Checklist } from "../models/Checklist";

export class ChecklistRepository { 
    salvar(checklist: Checklist): Checklist {
        const insertChecklist = db.prepare(
            `INSERT INTO checklist_inspecao (inspecao_id, item, conforme)
             VALUES (?, ?, ?)`
        );
        const resultado = insertChecklist.run(
            checklist.inspecao_id,
            checklist.item,
            checklist.conforme
        );
        return { ...checklist, id: Number(resultado.lastInsertRowid) };
    }
}