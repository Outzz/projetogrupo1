CREATE TABLE IF NOT EXISTS extintores (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_serie     TEXT    NOT NULL UNIQUE,
  tipo             TEXT    NOT NULL,           -- ex: pó químico, CO2, água, espuma
  classe           TEXT    NOT NULL,           -- ex: A, B, C, D, K
  fabricante       TEXT    NOT NULL,
  altura_instalacao REAL   NOT NULL DEFAULT 0, -- em metros
  sinalizado       INTEGER NOT NULL DEFAULT 0  -- 0 = não, 1 = sim
);

CREATE TABLE IF NOT EXISTS localizacoes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  extintor_id  INTEGER NOT NULL UNIQUE,
  predio       TEXT    NOT NULL,
  andar        TEXT    NOT NULL,
  setor        TEXT    NOT NULL,
  mapa_planta  TEXT,                           -- caminho ou referência da planta/mapa
  FOREIGN KEY (extintor_id) REFERENCES extintores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS validades (
  id                        INTEGER PRIMARY KEY AUTOINCREMENT,
  extintor_id               INTEGER NOT NULL UNIQUE,
  validade_carga            TEXT    NOT NULL,  -- ISO 8601: YYYY-MM-DD
  validade_teste_hidrostatico TEXT  NOT NULL,  -- ISO 8601: YYYY-MM-DD
  FOREIGN KEY (extintor_id) REFERENCES extintores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inspecoes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  extintor_id  INTEGER NOT NULL,
  data_inspecao TEXT   NOT NULL,               -- ISO 8601: YYYY-MM-DD
  responsavel  TEXT    NOT NULL,
  observacoes  TEXT,
  FOREIGN KEY (extintor_id) REFERENCES extintores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS checklist_inspecao (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  inspecao_id  INTEGER NOT NULL,
  item         TEXT    NOT NULL,               -- ex: "Lacre intacto", "Pressão adequada"
  conforme     INTEGER NOT NULL DEFAULT 1,     -- 0 = não conforme, 1 = conforme
  FOREIGN KEY (inspecao_id) REFERENCES inspecoes(id) ON DELETE CASCADE
);
