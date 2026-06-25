# Guia de Contribuição

Obrigado por contribuir com o **Fellowship Belong — Desafio 2**! Siga este guia para manter o projeto organizado e o histórico limpo.

## 1. Clonar e configurar o projeto

```bash
git clone https://github.com/paulocsa/fellowship-belong-desafio-2.git
cd fellowship-belong-desafio-2

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# edite o .env com seus valores locais

# Gerar o Prisma Client e aplicar as migrations
npx prisma generate
npx prisma migrate dev
```

## 2. Criar branches

Toda branch de trabalho **parte da `dev`**:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/nome-da-feature
```

Branches existentes do projeto:

| Branch | Descrição |
|---|---|
| `main` | Produção, protegida (sem push direto) |
| `dev` | Base de desenvolvimento |
| `feat/auth` | Autenticação e usuários |
| `feat/movies` | Gestão de filmes |
| `feat/my-list` | Lista pessoal |
| `feat/ratings` | Avaliações |
| `feat/infra` | Infraestrutura (Docker, CI, logs) |
| `feat/docs` | Documentação |

## 3. Padrão de commits (Conventional Commits)

Use o formato `tipo: descrição`:

| Tipo | Quando usar |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `refactor:` | Mudança de código sem alterar comportamento |
| `docs:` | Documentação |
| `test:` | Adição/ajuste de testes |
| `chore:` | Manutenção (configs, deps, build) |

Exemplo: `feat(auth): adiciona login com JWT`

## 4. Fluxo de Pull Request

```
feat/*  ──PR──▶  dev  ──PR──▶  main
```

- Abra o PR da sua `feat/*` para a `dev`.
- O PR precisa de **pelo menos 1 aprovação** e do **CI verde** (`build-and-test`).
- A `main` é protegida: só recebe código via PR aprovado vindo da `dev`.
- Mantenha o PR **pequeno e focado** em uma única coisa.
- Preencha o template de PR (descrição, issue relacionada com `Closes #XX`, checklist).

## 5. Antes de abrir o PR

Garanta que tudo está passando localmente:

```bash
npm run lint    # análise estática
npm run build   # compilação
npm run test    # testes
```

Não suba código com `console.log` e atualize o Swagger se alterou algum endpoint.
