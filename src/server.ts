import express, { Request, Response } from "express";
import "./database/database";

import { ExtintorController } from "./controller/ExtintorController";
import { InspecaoController } from "./controller/InspecaoController";
import { LocalizacaoController } from "./controller/LocalizacaoController";
import { ValidadeController } from "./controller/ValidadeController";
import { ChecklistController } from "./controller/ChecklistController";
import { UsuarioController } from "./controller/UsuarioController";

export type { Request, Response };

const app = express();
app.use(express.json());

const extintor = ExtintorController();
app.post("/extintores",          (req, res) => extintor.criarExtintor(req, res));
app.get("/extintores",           (req, res) => extintor.listarExtintores(req, res));
app.get("/extintores/:id",       (req, res) => extintor.buscarExtintorPorId(req, res));
app.put("/extintores/:id",       (req, res) => extintor.atualizarExtintor(req, res));
app.delete("/extintores/:id",    (req, res) => extintor.excluirExtintor(req, res));

const inspecao = InspecaoController();
app.post("/inspecoes",                              (req, res) => inspecao.criarInspecao(req, res));
app.get("/inspecoes",                               (req, res) => inspecao.listarInspecoes(req, res));
app.get("/inspecoes/:id",                           (req, res) => inspecao.buscarInspecaoPorId(req, res));
app.get("/extintores/:extintor_id/inspecoes",       (req, res) => inspecao.listarInspecoesPorExtintor(req, res));

const localizacao = LocalizacaoController();
app.post("/extintores/:extintor_id/localizacao",    (req, res) => localizacao.criarLocalizacao(req, res));
app.get("/extintores/:extintor_id/localizacao",     (req, res) => localizacao.buscarLocalizacaoPorExtintor(req, res));
app.put("/extintores/:extintor_id/localizacao",     (req, res) => localizacao.atualizarLocalizacao(req, res));
app.get("/localizacoes",                            (req, res) => {
  if (req.query.predio) return localizacao.listarPorPredio(req, res);
  if (req.query.setor)  return localizacao.listarPorSetor(req, res);
  res.status(400).json({ erro: "Informe o parâmetro 'predio' ou 'setor'." });
});

const validade = ValidadeController();
app.post("/extintores/:extintor_id/validade",       (req, res) => validade.criarValidade(req, res));
app.get("/extintores/:extintor_id/validade",        (req, res) => validade.buscarValidadePorExtintor(req, res));
app.put("/extintores/:extintor_id/validade",        (req, res) => validade.atualizarValidade(req, res));
app.get("/alertas/carga",                           (req, res) => validade.buscarAlertasCarga(req, res));
app.get("/alertas/teste-hidrostatico",              (req, res) => validade.buscarAlertasTesteHidrostatico(req, res));

const checklist = ChecklistController();
app.post("/checklist",                              (req, res) => checklist.criarItemChecklist(req, res));

const usuario = UsuarioController();
app.post("/usuarios",                               (req, res) => usuario.criarUsuario(req, res));

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});