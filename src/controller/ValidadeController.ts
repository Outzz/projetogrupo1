import { Request, Response } from "../server";
import { ValidadeRepository } from "../repositories/ValidadeRepository";
import { Validade } from "../models/Validade";

export function ValidadeController() {
  const repository = new ValidadeRepository();

  function criarValidade(req: Request, res: Response): void {
    const validade: Validade = req.body;

    if (!validade.extintor_id || !validade.validade_carga || !validade.validade_teste_hidrostatico) {
      res.status(400).json({ erro: "Campos obrigatórios ausentes: extintor_id, validade_carga, validade_teste_hidrostatico." });
      return;
    }

    const existente = repository.buscarPorExtintorId(validade.extintor_id);
    if (existente) {
      res.status(409).json({ erro: "Já existe uma validade cadastrada para este extintor." });
      return;
    }

    const nova = repository.salvar(validade);
    res.status(201).json(nova);
  }

  function buscarValidadePorExtintor(req: Request, res: Response): void {
    const extintor_id = Number(req.params.extintor_id);

    if (isNaN(extintor_id)) {
      res.status(400).json({ erro: "ID do extintor inválido." });
      return;
    }

    const validade = repository.buscarPorExtintorId(extintor_id);
    if (!validade) {
      res.status(404).json({ erro: "Validade não encontrada para este extintor." });
      return;
    }

    res.status(200).json(validade);
  }

  function atualizarValidade(req: Request, res: Response): void {
    const extintor_id = Number(req.params.extintor_id);

    if (isNaN(extintor_id)) {
      res.status(400).json({ erro: "ID do extintor inválido." });
      return;
    }

    const dados: Partial<Validade> = req.body;

    const atualizada = repository.atualizar(extintor_id, dados);
    if (!atualizada) {
      res.status(404).json({ erro: "Validade não encontrada para este extintor." });
      return;
    }

    res.status(200).json(atualizada);
  }

  function buscarAlertasCarga(req: Request, res: Response): void {
    const dias = Number(req.query.dias ?? 30);

    if (isNaN(dias) || dias <= 0) {
      res.status(400).json({ erro: "Parâmetro 'dias' deve ser um número positivo." });
      return;
    }

    const alertas = repository.buscarAlertasCarga(dias);
    res.status(200).json(alertas);
  }

  function buscarAlertasTesteHidrostatico(req: Request, res: Response): void {
    const dias = Number(req.query.dias ?? 30);

    if (isNaN(dias) || dias <= 0) {
      res.status(400).json({ erro: "Parâmetro 'dias' deve ser um número positivo." });
      return;
    }

    const alertas = repository.buscarAlertasTesteHidrostatico(dias);
    res.status(200).json(alertas);
  }

  return {
    criarValidade,
    buscarValidadePorExtintor,
    atualizarValidade,
    buscarAlertasCarga,
    buscarAlertasTesteHidrostatico,
  };
}