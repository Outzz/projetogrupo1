import { Request, Response } from "../server";
import { ExtintorRepository } from "../repositories/ExtintorRepository";
import { Extintor } from "../models/Extintor";

export function ExtintorController() {
  const repository = new ExtintorRepository();

  function criarExtintor(req: Request, res: Response): void {
    const extintor: Extintor = req.body;

    if (!extintor.numero_serie || !extintor.tipo || !extintor.classe || !extintor.fabricante) {
      res.status(400).json({ erro: "Campos obrigatórios ausentes: numero_serie, tipo, classe, fabricante." });
      return;
    }

    const existente = repository.buscarPorNumeroSerie(extintor.numero_serie);
    if (existente) {
      res.status(409).json({ erro: "Já existe um extintor com esse número de série." });
      return;
    }

    const novo = repository.salvar(extintor);
    res.status(201).json(novo);
  }

  function listarExtintores(req: Request, res: Response): void {
    const extintores = repository.listar();
    res.status(200).json(extintores);
  }

  function buscarExtintorPorId(req: Request, res: Response): void {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ erro: "ID inválido." });
      return;
    }

    const extintor = repository.buscarPorId(id);
    if (!extintor) {
      res.status(404).json({ erro: "Extintor não encontrado." });
      return;
    }

    res.status(200).json(extintor);
  }

  function atualizarExtintor(req: Request, res: Response): void {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ erro: "ID inválido." });
      return;
    }

    const dados: Partial<Extintor> = req.body;

    if (dados.numero_serie) {
      const existente = repository.buscarPorNumeroSerie(dados.numero_serie);
      if (existente && existente.id !== id) {
        res.status(409).json({ erro: "Número de série já está em uso por outro extintor." });
        return;
      }
    }

    const atualizado = repository.atualizar(id, dados);
    if (!atualizado) {
      res.status(404).json({ erro: "Extintor não encontrado." });
      return;
    }

    res.status(200).json(atualizado);
  }

  function excluirExtintor(req: Request, res: Response): void {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ erro: "ID inválido." });
      return;
    }

    const excluido = repository.excluir(id);
    if (!excluido) {
      res.status(404).json({ erro: "Extintor não encontrado." });
      return;
    }

    res.status(204).send();
  }

  return {
    criarExtintor,
    listarExtintores,
    buscarExtintorPorId,
    atualizarExtintor,
    excluirExtintor,
  };
}