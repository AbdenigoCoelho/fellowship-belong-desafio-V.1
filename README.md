# Fellowship Belong — Desafio 2 (Grupo 1)

API REST construída com **NestJS + TypeScript + Prisma + PostgreSQL**, com toolchain completa de qualidade (ESLint, Prettier, Husky, commitlint), CI no GitHub Actions e `main` protegida por ruleset.

Este README é a fonte de verdade para qualquer pessoa do time dar continuidade ao projeto: explica **como rodar**, **como o projeto está organizado** e **como contribuir** sem quebrar o fluxo.

---

## Sumário

- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Setup rápido](#setup-rápido)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Banco de dados (Prisma)](#banco-de-dados-prisma)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Qualidade de código](#qualidade-de-código)
- [Git hooks (Husky + lint-staged + commitlint)](#git-hooks-husky--lint-staged--commitlint)
- [Fluxo de branches](#fluxo-de-branches)
- [Convenção de commits](#convenção-de-commits)
- [Fluxo de Pull Request](#fluxo-de-pull-request)
- [CI (GitHub Actions)](#ci-github-actions)
- [Proteção da branch main](#proteção-da-branch-main)
- [Troubleshooting](#troubleshooting)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 24 (ver [`.nvmrc` / CI](#ci-github-actions)) |
| Framework | [NestJS 11](https://docs.nestjs.com/) (TypeScript) |
| ORM | [Prisma 7](https://www.prisma.io/docs) |
| Banco | PostgreSQL |
| Auth | JWT |
| Rate limiting | `@nestjs/throttler` |
| Testes | Jest |
| Lint/Format | ESLint 9 (flat config) + Prettier |
| Git hooks | Husky + lint-staged + commitlint |
| CI | GitHub Actions |

---

## Pré-requisitos

- **Node.js 24** (o CI roda em Node 24; usar a mesma versão evita divergência de lockfile)
- **npm** (gerenciador de pacotes do projeto)
- **PostgreSQL** em execução (local ou container)

---

## Setup rápido

```bash
# 1. Clonar
git clone https://github.com/paulocsa/fellowship-belong-desafio-2.git
cd fellowship-belong-desafio-2

# 2. Instalar dependências (isto também ativa os Git hooks via "prepare": "husky")
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# edite o .env com seus valores locais (ver seção abaixo)

# 4. Gerar o Prisma Client e aplicar as migrations
npx prisma generate
npx prisma migrate dev

# 5. Rodar em modo desenvolvimento
npm run start:dev
```

A API sobe por padrão em `http://localhost:3000` (porta configurável via `PORT`).

---

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha. **O `.env` está no `.gitignore` e nunca deve ser commitado** — versione apenas o `.env.example` (sem valores reais).

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL | `postgresql://user:pass@localhost:5432/fellowship?schema=public` |
| `JWT_SECRET` | Segredo para assinar os tokens JWT | `uma-string-secreta-longa` |
| `JWT_EXPIRES_IN` | Expiração do token | `3600s`, `1d` |
| `THROTTLE_TTL` | Janela do rate limit (segundos) | `60` |
| `THROTTLE_LIMIT` | Máx. de requisições por janela | `10` |

> ℹ️ No Prisma 7, a `DATABASE_URL` é lida em [`prisma.config.ts`](prisma.config.ts) via `dotenv`. Por isso o `dotenv` é uma devDependency do projeto.

---

## Banco de dados (Prisma)

O projeto usa **Prisma 7**, que tem algumas particularidades em relação a tutoriais antigos:

- O schema fica em [`prisma/schema.prisma`](prisma/schema.prisma) com `provider = "postgresql"`.
- A configuração (schema path, migrations, `DATABASE_URL`) fica em [`prisma.config.ts`](prisma.config.ts).
- O Prisma Client é **gerado em `generated/prisma`** (pasta ignorada no Git) pelo generator `prisma-client`.

Comandos úteis:

```bash
npx prisma generate        # gera o Prisma Client (rode após mudar o schema)
npx prisma migrate dev     # cria/aplica migrations em desenvolvimento
npx prisma migrate deploy  # aplica migrations em produção
npx prisma studio          # abre a UI para inspecionar o banco
```

> Ao alterar o `schema.prisma`, **sempre** rode `npx prisma migrate dev` e commite a migration gerada junto com a mudança do schema.

---

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run start` | Inicia a aplicação |
| `npm run start:dev` | Desenvolvimento com hot-reload (watch) |
| `npm run start:debug` | Desenvolvimento com debug + watch |
| `npm run start:prod` | Produção (`node dist/main`) |
| `npm run build` | Compila o projeto (`nest build`) |
| `npm run test` | Testes unitários (Jest) |
| `npm run test:watch` | Testes em watch |
| `npm run test:cov` | Testes com cobertura |
| `npm run test:e2e` | Testes end-to-end |
| `npm run lint` | Roda o ESLint (sem corrigir) |
| `npm run lint:fix` | Roda o ESLint corrigindo o que dá |
| `npm run format` | Formata `src/**/*.ts` com Prettier |

---

## Estrutura de pastas

```
.
├── .github/
│   ├── workflows/ci.yml          # pipeline de CI (lint, build, testes)
│   ├── ISSUE_TEMPLATE/           # templates de issue (feature, bug)
│   ├── PULL_REQUEST_TEMPLATE.md  # template de PR
│   └── CONTRIBUTING.md           # guia de contribuição
├── .husky/                       # Git hooks (pre-commit, commit-msg)
├── prisma/
│   └── schema.prisma             # schema do banco
├── src/                          # código da aplicação (NestJS)
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                   # bootstrap da aplicação
├── test/                         # testes e2e
├── .editorconfig                 # padronização de editores
├── .env.example                  # exemplo de variáveis (sem valores)
├── .prettierrc                   # config do Prettier
├── .prettierignore
├── commitlint.config.js          # regras de mensagem de commit
├── eslint.config.mjs             # ESLint 9 (flat config)
├── prisma.config.ts              # config do Prisma 7
└── package.json
```

---

## Qualidade de código

### ESLint (flat config — ESLint 9)

A configuração fica em [`eslint.config.mjs`](eslint.config.mjs) (formato **flat config**, padrão do NestJS 11 — não usamos `.eslintrc.js`). Regras-chave:

- estende `@typescript-eslint` (type-checked) + integração com Prettier;
- `@typescript-eslint/no-explicit-any`: **error** (proibido usar `any`);
- `@typescript-eslint/no-unused-vars`: **error** (variável não usada quebra o lint).

```bash
npm run lint       # verifica
npm run lint:fix   # verifica e corrige
```

### Prettier

Configuração em [`.prettierrc`](.prettierrc):

```json
{ "singleQuote": true, "tabWidth": 2, "trailingComma": "all", "printWidth": 100, "semi": true }
```

```bash
npm run format
```

### EditorConfig

[`.editorconfig`](.editorconfig) padroniza indentação, fim de linha (LF), charset e afins entre VS Code, WebStorm, etc.

> **Recomendado:** instale as extensões **ESLint** e **Prettier** no seu editor e ative *format on save*.

---

## Git hooks (Husky + lint-staged + commitlint)

Os hooks são ativados automaticamente após `npm install` (via script `"prepare": "husky"`). Eles rodam **localmente, antes do commit**:

| Hook | Arquivo | O que faz |
|---|---|---|
| `pre-commit` | [`.husky/pre-commit`](.husky/pre-commit) | Roda `lint-staged`: aplica `eslint --fix` + `prettier --write` nos arquivos `*.ts` em stage |
| `commit-msg` | [`.husky/commit-msg`](.husky/commit-msg) | Roda `commitlint`: valida a mensagem do commit contra o Conventional Commits |

Configuração do `lint-staged` (em `package.json`):

```json
"lint-staged": { "*.ts": ["eslint --fix", "prettier --write"] }
```

Configuração do commitlint ([`commitlint.config.js`](commitlint.config.js)): estende `@commitlint/config-conventional`, com os tipos permitidos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`.

**Exemplos:**

```bash
git commit -m "meu commit"            # ❌ rejeitado (sem tipo)
git commit -m "feat: add auth module" # ✅ aceito
```

---

## Fluxo de branches

```
feat/*  ──PR──▶  dev  ──PR──▶  main
```

| Branch | Descrição |
|---|---|
| `main` | Produção. **Protegida** — sem push direto, só via PR aprovado + CI verde. |
| `dev` | Base de desenvolvimento. Toda feature parte daqui. |
| `feat/auth` | Autenticação e usuários |
| `feat/movies` | Gestão de filmes |
| `feat/my-list` | Lista pessoal |
| `feat/ratings` | Avaliações |
| `feat/infra` | Infraestrutura (Docker, CI, hooks, lint) |
| `feat/docs` | Documentação (README, Swagger, CHANGELOG) |

Criando uma branch de trabalho:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/nome-da-feature
```

---

## Convenção de commits

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/) (validado pelo commitlint):

| Tipo | Quando usar |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `refactor:` | Mudança de código sem alterar comportamento |
| `docs:` | Documentação |
| `test:` | Adição/ajuste de testes |
| `chore:` | Manutenção (configs, deps, build) |
| `style:` | Formatação/estilo (sem mudar lógica) |
| `perf:` | Melhoria de performance |

Formato: `tipo(escopo opcional): descrição` — ex.: `feat(auth): adiciona login com JWT`.

---

## Fluxo de Pull Request

1. Abra o PR da sua `feat/*` **para a `dev`**.
2. O PR usa automaticamente o [template de PR](.github/PULL_REQUEST_TEMPLATE.md) — preencha descrição, `Closes #XX` e checklist.
3. O PR precisa de **CI verde** (`build-and-test`) e **1 aprovação**.
4. Depois de acumular features na `dev`, abra um PR **`dev → main`** para liberar em produção.

> 🔔 **Importante sobre o fechamento de issues:** o `Closes #XX` só fecha a issue quando o commit chega na branch **default (`main`)**. Um merge em `dev` **não** fecha a issue — ela fecha quando o PR `dev → main` for mergeado.

---

## CI (GitHub Actions)

O workflow [.github/workflows/ci.yml](.github/workflows/ci.yml) roda em todo `push` e `pull_request` para `main` e `dev`. Job `build-and-test` (Ubuntu, Node 24):

1. `npm install` — instala dependências
2. `npx prisma generate` — gera o Prisma Client
3. `eslint` — análise estática
4. `npm run build` — compila
5. `npm run test` — testes

> Usamos `npm install` (e não `npm ci`) no CI porque o Prisma 7 traz peer dependencies opcionais (do Prisma Studio) que geram divergência de lockfile entre Windows e Linux com o `npm ci`.

---

## Proteção da branch main

A `main` é protegida por um **ruleset** com:

- **Pull request obrigatório** antes do merge;
- **1 aprovação** obrigatória, de alguém **diferente** de quem fez o último push;
- **Status check obrigatório:** `build-and-test` (CI verde);
- **Push direto, force push e deleção bloqueados**;
- Aprovações descartadas quando novos commits são enviados ao PR.

> Trabalhando sozinho? O papel **Repository admin** está na *bypass list* do ruleset, permitindo o merge solo. Quando o time crescer, o ideal é remover o bypass e exigir revisão de outra pessoa de verdade.

---

## Troubleshooting

| Problema | Causa / solução |
|---|---|
| Commit rejeitado com erro do commitlint | A mensagem não segue Conventional Commits. Use `tipo: descrição` (ex.: `fix: corrige X`). |
| Hooks não rodam ao commitar | Rode `npm install` (ativa o Husky via `prepare`). Verifique se `git config core.hooksPath` aponta para `.husky/_`. |
| `npm ci` falha com "Missing react from lock file" | Peer deps opcionais do Prisma 7. Use `npm install`. O CI já faz isso. |
| `prisma generate` não acha a `DATABASE_URL` | Confira o `.env` e que `prisma.config.ts` carrega o `dotenv`. |
| Lint reclama de formatação em `test/` | `npm run format` cobre só `src/`. Rode `npm run lint:fix` para corrigir `test/` também. |

---

Para o guia detalhado de contribuição, veja [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md).
