import { Request, Response } from "../server";
import { ChecklistRepository } from "../repositories/ChecklistRepository";
import { Checklist } from "../models/Checklist";

export function ChecklistController() {
  const repository = new ChecklistRepository();

  function criarItemChecklist(req: Request, res: Response): void {
    const checklist: Checklist = req.body;

    if (!checklist.inspecao_id || !checklist.item || checklist.conforme === undefined) {
      res.status(400).json({ erro: "Campos obrigatórios ausentes: inspecao_id, item, conforme." });
      return;
    }

    const novo = repository.salvar(checklist);
    res.status(201).json(novo);
  }

  return {
    criarItemChecklist,
  };
}