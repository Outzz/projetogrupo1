import { Request, Response } from "../server";
import { LocalizacaoRepository } from "../repositories/LocalizacaoRepository";
import { Localizacao } from "../models/Localizacao";

export function LocalizacaoController() {
  const repository = new LocalizacaoRepository();

  function criarLocalizacao(req: Request, res: Response): void {
    const localizacao: Localizacao = req.body;

    if (!localizacao.extintor_id || !localizacao.predio || !localizacao.andar || !localizacao.setor) {
      res.status(400).json({ erro: "Campos obrigatórios ausentes: extintor_id, predio, andar, setor." });
      return;
    }

    const existente = repository.buscarPorExtintorId(localizacao.extintor_id);
    if (existente) {
      res.status(409).json({ erro: "Já existe uma localização cadastrada para este extintor." });
      return;
    }

    const nova = repository.salvar(localizacao);
    res.status(201).json(nova);
  }

  function buscarLocalizacaoPorExtintor(req: Request, res: Response): void {
    const extintor_id = Number(req.params.extintor_id);

    if (isNaN(extintor_id)) {
      res.status(400).json({ erro: "ID do extintor inválido." });
      return;
    }

    const localizacao = repository.buscarPorExtintorId(extintor_id);
    if (!localizacao) {
      res.status(404).json({ erro: "Localização não encontrada para este extintor." });
      return;
    }

    res.status(200).json(localizacao);
  }

  function atualizarLocalizacao(req: Request, res: Response): void {
    const extintor_id = Number(req.params.extintor_id);

    if (isNaN(extintor_id)) {
      res.status(400).json({ erro: "ID do extintor inválido." });
      return;
    }

    const dados: Partial<Localizacao> = req.body;

    const atualizada = repository.atualizar(extintor_id, dados);
    if (!atualizada) {
      res.status(404).json({ erro: "Localização não encontrada para este extintor." });
      return;
    }

    res.status(200).json(atualizada);
  }

  function listarPorPredio(req: Request, res: Response): void {
    const predio = req.query.predio as string;

    if (!predio) {
      res.status(400).json({ erro: "Parâmetro 'predio' é obrigatório." });
      return;
    }

    const localizacoes = repository.listarPorPredio(predio);
    res.status(200).json(localizacoes);
  }

  function listarPorSetor(req: Request, res: Response): void {
    const setor = req.query.setor as string;

    if (!setor) {
      res.status(400).json({ erro: "Parâmetro 'setor' é obrigatório." });
      return;
    }

    const localizacoes = repository.listarPorSetor(setor);
    res.status(200).json(localizacoes);
  }

  return {
    criarLocalizacao,
    buscarLocalizacaoPorExtintor,
    atualizarLocalizacao,
    listarPorPredio,
    listarPorSetor,
  };
}