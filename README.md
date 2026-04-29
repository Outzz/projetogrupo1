# Extintor Manager API

API REST para gerenciamento de extintores de incêndio — cadastro, localização, inspeções com checklist e controle de validade.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Executando o Servidor](#executando-o-servidor)
- [Banco de Dados](#banco-de-dados)
- [Endpoints](#endpoints)
  - [Extintores](#extintores)
  - [Localizações](#localizações)
  - [Validades](#validades)
  - [Inspeções](#inspeções)
  - [Checklist](#checklist)
  - [Usuários](#usuários)
- [Modelos](#modelos)

---

## Tecnologias

- **Node.js** + **TypeScript**
- **Express** — framework HTTP
- **better-sqlite3** — banco de dados SQLite embutido, sem dependências externas

---

## Estrutura do Projeto

```
src/
├── controller/
│   ├── ChecklistController.ts
│   ├── ExtintorController.ts
│   ├── InspecaoController.ts
│   ├── LocalizacaoController.ts
│   ├── UsuarioController.ts
│   └── ValidadeController.ts
├── database/
│   ├── database.ts       # Inicialização e criação das tabelas
│   └── schema.sql        # Schema de referência
├── models/
│   ├── Checklist.ts
│   ├── Extintor.ts
│   ├── Inspecao.ts
│   ├── Localizacao.ts
│   ├── Usuario.ts
│   └── Validade.ts
├── repositories/
│   ├── ChecklistRepository.ts
│   ├── ExtintorRepository.ts
│   ├── InspecaoRepository.ts
│   ├── LocalizacaoRepository.ts
│   ├── UsuarioRepository.ts
│   └── ValidadeRepository.ts
└── server.ts
```

---

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd extintor-manager

# Instale as dependências
npm install
```

---

## Executando o Servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

O servidor sobe na porta **3000** por padrão. Para mudar, defina a variável de ambiente `PORT`:

```bash
PORT=8080 npm run dev
```

---

## Banco de Dados

O banco SQLite (`banco.db`) é criado automaticamente na raiz do projeto na primeira execução. As tabelas são criadas via `database.ts` com `CREATE TABLE IF NOT EXISTS`, então não há necessidade de rodar migrations manualmente.

**Tabelas:**

| Tabela               | Descrição                                      |
|----------------------|------------------------------------------------|
| `extintores`         | Dados cadastrais do extintor                   |
| `localizacoes`       | Prédio, andar e setor de cada extintor         |
| `validades`          | Datas de validade da carga e teste hidrostático|
| `inspecoes`          | Registro de inspeções realizadas               |
| `checklist_inspecao` | Itens verificados em cada inspeção             |

---

## Endpoints

### Extintores

| Método   | Rota                  | Descrição                        |
|----------|-----------------------|----------------------------------|
| `POST`   | `/extintores`         | Cadastrar novo extintor          |
| `GET`    | `/extintores`         | Listar todos os extintores       |
| `GET`    | `/extintores/:id`     | Buscar extintor por ID           |
| `PUT`    | `/extintores/:id`     | Atualizar dados do extintor      |
| `DELETE` | `/extintores/:id`     | Excluir extintor                 |

**POST /extintores — Body:**
```json
{
  "numero_serie": "EXT-001",
  "tipo": "pó químico",
  "classe": "ABC",
  "fabricante": "Amerex",
  "altura_instalacao": 1.5,
  "sinalizado": true
}
```

---

### Localizações

| Método | Rota                                      | Descrição                                        |
|--------|-------------------------------------------|--------------------------------------------------|
| `POST` | `/extintores/:extintor_id/localizacao`    | Cadastrar localização de um extintor             |
| `GET`  | `/extintores/:extintor_id/localizacao`    | Buscar localização de um extintor                |
| `PUT`  | `/extintores/:extintor_id/localizacao`    | Atualizar localização de um extintor             |
| `GET`  | `/localizacoes?predio=<nome>`             | Listar localizações filtrando por prédio         |
| `GET`  | `/localizacoes?setor=<nome>`              | Listar localizações filtrando por setor          |

**POST /extintores/:extintor_id/localizacao — Body:**
```json
{
  "extintor_id": 1,
  "predio": "Bloco A",
  "andar": "2º andar",
  "setor": "RH",
  "mapa_planta": "plantas/bloco-a.pdf"
}
```

---

### Validades

| Método | Rota                                         | Descrição                                              |
|--------|----------------------------------------------|--------------------------------------------------------|
| `POST` | `/extintores/:extintor_id/validade`          | Cadastrar validade de um extintor                      |
| `GET`  | `/extintores/:extintor_id/validade`          | Buscar validade de um extintor                         |
| `PUT`  | `/extintores/:extintor_id/validade`          | Atualizar validade de um extintor                      |
| `GET`  | `/alertas/carga?dias=<n>`                    | Extintores com carga vencendo em até N dias (padrão 30)|
| `GET`  | `/alertas/teste-hidrostatico?dias=<n>`       | Extintores com teste vencendo em até N dias (padrão 30)|

**POST /extintores/:extintor_id/validade — Body:**
```json
{
  "extintor_id": 1,
  "validade_carga": "2025-12-31",
  "validade_teste_hidrostatico": "2027-06-30"
}
```

---

### Inspeções

| Método | Rota                                          | Descrição                              |
|--------|-----------------------------------------------|----------------------------------------|
| `POST` | `/inspecoes`                                  | Registrar nova inspeção com checklist  |
| `GET`  | `/inspecoes`                                  | Listar todas as inspeções              |
| `GET`  | `/inspecoes/:id`                              | Buscar inspeção por ID                 |
| `GET`  | `/extintores/:extintor_id/inspecoes`          | Listar inspeções de um extintor        |

**POST /inspecoes — Body:**
```json
{
  "extintor_id": 1,
  "data_inspecao": "2025-04-29",
  "responsavel": "João Silva",
  "observacoes": "Extintor em bom estado geral.",
  "checklist": [
    { "item": "Lacre intacto", "conforme": true },
    { "item": "Pressão adequada", "conforme": true },
    { "item": "Sinalização visível", "conforme": false }
  ]
}
```

---

### Checklist

| Método | Rota          | Descrição                              |
|--------|---------------|----------------------------------------|
| `POST` | `/checklist`  | Adicionar item avulso a uma inspeção   |

**POST /checklist — Body:**
```json
{
  "inspecao_id": 1,
  "item": "Bico desobstruído",
  "conforme": true
}
```

---

### Usuários

| Método | Rota        | Descrição             |
|--------|-------------|-----------------------|
| `POST` | `/usuarios` | Cadastrar novo usuário|

**POST /usuarios — Body:**
```json
{
  "nome": "Maria Souza",
  "email": "maria@empresa.com",
  "senha": "senha123",
  "role": "inspetor"
}
```

> **Roles disponíveis:** `admin` | `inspetor`  
> A senha **não é retornada** na resposta.

---

## Modelos

### Extintor
| Campo              | Tipo      | Descrição                              |
|--------------------|-----------|----------------------------------------|
| `id`               | `number`  | Gerado automaticamente                 |
| `numero_serie`     | `string`  | Identificador único do equipamento     |
| `tipo`             | `string`  | Ex: `pó químico`, `CO2`, `água`        |
| `classe`           | `string`  | Ex: `A`, `B`, `C`, `ABC`              |
| `fabricante`       | `string`  | Nome do fabricante                     |
| `altura_instalacao`| `number`  | Em metros                              |
| `sinalizado`       | `boolean` | Se possui sinalização visível          |

### Inspeção
| Campo          | Tipo          | Descrição                      |
|----------------|---------------|--------------------------------|
| `id`           | `number`      | Gerado automaticamente         |
| `extintor_id`  | `number`      | Referência ao extintor         |
| `data_inspecao`| `string`      | Formato ISO 8601 `YYYY-MM-DD`  |
| `responsavel`  | `string`      | Nome do inspetor               |
| `observacoes`  | `string?`     | Opcional                       |
| `checklist`    | `Checklist[]` | Itens verificados              |

### Checklist
| Campo        | Tipo      | Descrição                                     |
|--------------|-----------|-----------------------------------------------|
| `id`         | `number`  | Gerado automaticamente                        |
| `inspecao_id`| `number`  | Referência à inspeção                         |
| `item`       | `string`  | Ex: `Lacre intacto`, `Pressão adequada`       |
| `conforme`   | `boolean` | `true` = conforme, `false` = não conforme     |

### Validade
| Campo                        | Tipo     | Descrição                    |
|------------------------------|----------|------------------------------|
| `extintor_id`                | `number` | Referência ao extintor       |
| `validade_carga`             | `string` | Formato ISO 8601 `YYYY-MM-DD`|
| `validade_teste_hidrostatico`| `string` | Formato ISO 8601 `YYYY-MM-DD`|

---

## Licença

MIT