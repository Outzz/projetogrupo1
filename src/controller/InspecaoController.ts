import { Request, Response } from "../server";
import { InspecaoRepository } from "../repositories/InspecaoRepository";
import { Inspecao } from "../models/Inspecao";

export function InspecaoController() {
  const repository = new InspecaoRepository();

  function criarInspecao(req: Request, res: Response): void {
    const inspecao: Inspecao = req.body;

    if (!inspecao.extintor_id || !inspecao.data_inspecao || !inspecao.responsavel) {
      res.status(400).json({ erro: "Campos obrigatórios ausentes: extintor_id, data_inspecao, responsavel." });
      return;
    }

    if (!Array.isArray(inspecao.checklist) || inspecao.checklist.length === 0) {
      res.status(400).json({ erro: "O checklist deve conter ao menos um item." });
      return;
    }

    const nova = repository.salvar(inspecao);
    res.status(201).json(nova);
  }

  function buscarInspecaoPorId(req: Request, res: Response): void {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ erro: "ID inválido." });
      return;
    }

    const inspecao = repository.buscarPorId(id);
    if (!inspecao) {
      res.status(404).json({ erro: "Inspeção não encontrada." });
      return;
    }

    res.status(200).json(inspecao);
  }

  function listarInspecoesPorExtintor(req: Request, res: Response): void {
    const extintor_id = Number(req.params.extintor_id);

    if (isNaN(extintor_id)) {
      res.status(400).json({ erro: "ID do extintor inválido." });
      return;
    }

    const inspecoes = repository.listarPorExtintorId(extintor_id);
    res.status(200).json(inspecoes);
  }

  function listarInspecoes(req: Request, res: Response): void {
    const inspecoes = repository.listar();
    res.status(200).json(inspecoes);
  }

  return {
    criarInspecao,
    buscarInspecaoPorId,
    listarInspecoesPorExtintor,
    listarInspecoes,
  };
}