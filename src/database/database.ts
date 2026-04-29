import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "../../banco.db");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS extintores (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_serie      TEXT    NOT NULL UNIQUE,
    tipo              TEXT    NOT NULL,
    classe            TEXT    NOT NULL,
    fabricante        TEXT    NOT NULL,
    altura_instalacao REAL    NOT NULL DEFAULT 0,
    sinalizado        INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS localizacoes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    extintor_id INTEGER NOT NULL UNIQUE,
    predio      TEXT    NOT NULL,
    andar       TEXT    NOT NULL,
    setor       TEXT    NOT NULL,
    mapa_planta TEXT,
    FOREIGN KEY (extintor_id) REFERENCES extintores(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS validades (
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    extintor_id                 INTEGER NOT NULL UNIQUE,
    validade_carga              TEXT    NOT NULL,
    validade_teste_hidrostatico TEXT    NOT NULL,
    FOREIGN KEY (extintor_id) REFERENCES extintores(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS inspecoes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    extintor_id   INTEGER NOT NULL,
    data_inspecao TEXT    NOT NULL,
    responsavel   TEXT    NOT NULL,
    observacoes   TEXT,
    FOREIGN KEY (extintor_id) REFERENCES extintores(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS checklist_inspecao (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    inspecao_id INTEGER NOT NULL,
    item        TEXT    NOT NULL,
    conforme    INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (inspecao_id) REFERENCES inspecoes(id) ON DELETE CASCADE
  );
`);

export default db;
