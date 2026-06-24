# Fellowship Belong — Desafio 2 (Grupo 1)

API construída com **NestJS + TypeScript + Prisma + PostgreSQL**.

## Stack

- [NestJS 11](https://docs.nestjs.com/) (Node.js / TypeScript)
- [Prisma 7](https://www.prisma.io/docs) ORM
- PostgreSQL
- JWT para autenticação
- Rate limiting via `@nestjs/throttler`

## Pré-requisitos

- Node.js 20+
- npm
- PostgreSQL em execução

## Setup do projeto

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# edite o .env com seus valores locais

# 3. Gerar o Prisma Client e aplicar as migrations
npx prisma generate
npx prisma migrate dev
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `JWT_SECRET` | Segredo usado para assinar os tokens JWT |
| `JWT_EXPIRES_IN` | Tempo de expiração do token (ex.: `3600s`, `1d`) |
| `THROTTLE_TTL` | Janela de tempo do rate limit (em segundos) |
| `THROTTLE_LIMIT` | Nº máximo de requisições por janela |

> O `.env` está no `.gitignore` e **nunca** deve ser commitado. Versione apenas o `.env.example`.

## Scripts

```bash
npm run start:dev    # modo desenvolvimento (watch)
npm run build        # compila o projeto
npm run start:prod   # modo produção
npm run test         # executa os testes
npm run test:cov     # testes com cobertura
```

## Fluxo de branches

```
feat/*  ──PR──▶  dev  ──PR──▶  main
```

| Branch | Descrição |
|---|---|
| `main` | Produção, protegida. Nenhum push direto permitido. |
| `dev` | Desenvolvimento, base para todas as features. |
| `feat/auth` | Autenticação e usuários |
| `feat/movies` | Gestão de filmes |
| `feat/my-list` | Lista pessoal |
| `feat/ratings` | Avaliações |
| `feat/infra` | Infraestrutura (Docker, CI, logs) |
| `feat/docs` | Documentação (README, Swagger, CHANGELOG) |

**Regras:**

- Toda feature parte da `dev` (`git checkout dev && git pull && git checkout -b feat/...`).
- `feat/*` é integrada na `dev` somente via **Pull Request aprovado**.
- `dev` chega à `main` somente via **Pull Request aprovado**.
- A `main` é protegida — sem push direto.

## Convenção de commits

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo | Quando usar |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `refactor:` | Mudança de código sem alterar comportamento |
| `docs:` | Documentação |
| `test:` | Adição/ajuste de testes |
| `chore:` | Tarefas de manutenção (configs, deps, build) |

Exemplo: `feat(auth): adiciona login com JWT`
