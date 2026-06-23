# Phase 3 — Persistência & Cache
> Sprint Goal: Conectar o domínio ao banco de dados PostgreSQL e implementar cache de redirects via Redis, tornando o sistema funcional de ponta a ponta.

---

## TASK-01 · Configurar Prisma e modelar o banco de dados

**Type:** Backend  
**Estimate:** 2 points  
**Priority:** 🔴 High  
**Dependencies:** none

### User Story
> Como desenvolvedor do time, preciso configurar o Prisma como ORM do projeto e definir o schema do banco de dados, para que as demais tasks da fase possam depender de uma fonte de dados real e consistente.

### Background
O domínio da Fase 2 foi construído com entidades puras e sem dependência de banco. Agora precisamos definir como esses dados serão persistidos. O Prisma será o ORM escolhido conforme RNF2, e o `schema.prisma` é a **fonte de verdade** do banco — nenhuma coluna ou tabela deve existir fora dele.

### Acceptance Criteria
- [x] Prisma instalado e inicializado no projeto (`npx prisma init`)
- [x] `schema.prisma` contém o model `Url` com os campos:
  - `id` — String, PK, UUID
  - `originalUrl` — String
  - `slug` — String, único
  - `isActive` — Boolean, default true
  - `createdAt` — DateTime, default now()
  - `expiresAt` — DateTime, nullable
- [x] `PrismaService` criado em `src/shared/database/prisma.service.ts` estendendo `PrismaClient` e implementando `OnModuleInit`
- [x] `DatabaseModule` criado em `src/shared/database/database.module.ts` exportando o `PrismaService` como global
- [x] Migration inicial gerada com `prisma migrate dev --name init`
- [x] `DATABASE_URL` no `.env` apontando para o container Docker da Fase 1
- [x] `app.module.ts` importando o `DatabaseModule`

### Technical Notes
- O `PrismaService` deve chamar `this.$connect()` no `onModuleInit`
- O `DatabaseModule` deve ser decorado com `@Global()` para que o `PrismaService` esteja disponível em qualquer módulo sem precisar reimportar
- Atenção: os nomes dos campos no Prisma seguem `camelCase` mas o banco usa `snake_case` — usar `@map` quando necessário

---

## TASK-02 · Implementar o `PrismaUrlRepository`

**Type:** Backend  
**Estimate:** 3 points  
**Priority:** 🔴 High  
**Dependencies:** TASK-01

### User Story
> Como desenvolvedor do time, preciso implementar o repositório concreto de URLs usando Prisma, para que os Use Cases da Fase 2 possam persistir e recuperar dados reais do PostgreSQL sem precisar conhecer detalhes de infraestrutura.

### Background
Na Fase 2 foi definida a interface `IUrlRepository` no domínio. Agora precisamos criar a implementação concreta dessa interface na camada de infraestrutura. Um ponto crítico é o **mapeamento**: os dados retornados pelo Prisma são objetos planos — precisam ser convertidos para entidades de domínio antes de sair do repositório.

### Acceptance Criteria
- [x] Arquivo criado em `src/modules/url/infrastructure/repositories/prisma-url.repository.ts`
- [x] A classe implementa todos os métodos de `IUrlRepository`:
  - `findBySlug(slug)` → busca por slug único
  - `findById(id)` → busca por PK
  - `findAll()` → lista todos os registros
  - `save(url)` → insere novo registro
  - `update(url)` → atualiza registro existente
  - `delete(id)` → remove registro por id
- [x] Método privado `toDomain(raw)` encapsula a conversão de Prisma model → `Url` entity
- [x] Método privado `toPrisma(url)` encapsula a conversão de `Url` entity → objeto Prisma
- [x] Nenhum dado do Prisma "vaza" para fora do repositório — todos os retornos públicos são entidades de domínio

### Technical Notes
- A rehydratação da entidade deve passar o `id` existente como segundo argumento: `Url.create(props, new UniqueEntityId(raw.id))`
- O `PrismaService` deve ser injetado via construtor, não instanciado diretamente
- Tratar o caso em que `Url.create()` retorna `Failure` na rehydratação — logar e lançar exceção de infraestrutura

---

## TASK-03 · Implementar cache de redirects com Redis

**Type:** Backend  
**Estimate:** 3 points  
**Priority:** 🟡 Medium  
**Dependencies:** TASK-01

### User Story
> Como desenvolvedor do time, preciso implementar um serviço de cache para os redirects usando Redis, para que URLs de alta frequência não gerem queries desnecessárias ao banco e o tempo de resposta do `GET /:slug` seja reduzido.

### Background
O redirect (RF2) é a operação mais executada do sistema — pode receber milhares de requisições por minuto para os mesmos slugs. Buscar no banco a cada request seria ineficiente. O Redis será usado como cache com TTL configurável via `.env` (já declarado na Fase 1 como `REDIS_TTL_SECONDS`).

### Acceptance Criteria
- [x] Pacote `ioredis` instalado
- [x] `RedisService` criado em `src/shared/cache/redis.service.ts` com os métodos:
  - `get(key: string): Promise<string | null>`
  - `set(key: string, value: string, ttlSeconds: number): Promise<void>`
  - `del(key: string): Promise<void>`
- [x] `CacheModule` criado em `src/shared/cache/cache.module.ts` exportando o `RedisService` como global
- [x] O `RedirectUrlUseCase` atualizado para:
  1. Verificar o cache antes de consultar o banco
  2. Popular o cache após encontrar no banco
  3. Usar a chave no formato `redirect:{slug}`
- [x] O `ShortenUrlUseCase` **não** interage com o cache (apenas persiste)
- [x] Quando uma URL é deletada ou desativada, o cache da chave correspondente deve ser invalidado
- [x] `REDIS_HOST`, `REDIS_PORT` e `REDIS_TTL_SECONDS` consumidos via `ConfigService`

### Technical Notes
- O `RedisService` deve fechar a conexão no `onModuleDestroy` para não deixar conexões abertas em testes
- O cache deve armazenar apenas a `originalUrl` como string — não serializar a entidade inteira
- Cuidado com o acoplamento: o Use Case deve depender de uma interface `ICacheService`, não diretamente do `RedisService`

---

## TASK-04 · Montar o `UrlModule` e registrar os providers

**Type:** Backend  
**Estimate:** 2 points  
**Priority:** 🔴 High  
**Dependencies:** TASK-02, TASK-03

### User Story
> Como desenvolvedor do time, preciso montar o módulo NestJS de URLs registrando todos os providers, use cases e repositórios corretamente, para que o sistema de injeção de dependência do NestJS resolva tudo automaticamente.

### Background
Até agora os use cases foram testados com repositórios in-memory. Agora precisamos conectar as peças reais: o `PrismaUrlRepository` como implementação de `IUrlRepository`, os use cases como providers injetáveis e o módulo organizado conforme Clean Architecture.

### Acceptance Criteria
- [x] Arquivo criado em `src/modules/url/url.module.ts`
- [x] `PrismaUrlRepository` registrado com o token `URL_REPOSITORY`:
  ```
  { provide: URL_REPOSITORY, useClass: PrismaUrlRepository }
  ```
- [x] `ShortenUrlUseCase` e `RedirectUrlUseCase` registrados como providers
- [x] O módulo importa `DatabaseModule` e `CacheModule`
- [x] `app.module.ts` importa o `UrlModule`
- [x] Aplicação sobe sem erros com `npm run start:dev`

### Technical Notes
- Não exportar o `PrismaUrlRepository` diretamente — quem precisar do repositório deve depender da interface via token
- Verificar que o `URL_REPOSITORY` token bate exatamente com o usado nos `@Inject()` dos use cases

---

## TASK-05 · Implementar os endpoints HTTP

**Type:** Backend  
**Estimate:** 3 points  
**Priority:** 🔴 High  
**Dependencies:** TASK-04

### User Story
> Como desenvolvedor do time, preciso expor os use cases via HTTP, para que clientes externos possam encurtar URLs e ser redirecionados através de uma API REST.

### Background
Com domínio, infraestrutura e módulo montados, a camada de apresentação é o último passo. O controller é responsável apenas por receber a requisição, chamar o use case e mapear o resultado para a resposta HTTP correta — nenhuma regra de negócio deve existir aqui.

### Acceptance Criteria
- [x] `ShortenUrlDto` criado com validações via `class-validator`:
  - `originalUrl` — string, IsUrl, obrigatório
  - `customSlug` — string, IsOptional, MinLength(3), MaxLength(50)
  - `expiresAt` — Date, IsOptional, IsDateString
- [x] `UrlController` criado em `src/modules/url/presentation/controllers/url.controller.ts`
- [x] Endpoint `POST /urls`:
  - Chama `ShortenUrlUseCase`
  - Retorna `201 Created` com `{ id, originalUrl, slug, shortUrl, expiresAt, createdAt }`
  - `shortUrl` = `APP_BASE_URL + '/' + slug`
  - Retorna `409 Conflict` se slug já está em uso
  - Retorna `400 Bad Request` se URL ou slug são inválidos
- [ ] Endpoint `GET /:slug`:
  - Chama `RedirectUrlUseCase`
  - Retorna `301 Redirect` para a URL original
  - Retorna `404 Not Found` se slug não existe
  - Retorna `410 Gone` se URL expirada
- [ ] `ValidationPipe` global habilitado no `main.ts`

### Technical Notes
- O status `301` é permanente (cacheado pelo browser) — considerar usar `302` por ora para facilitar testes durante o desenvolvimento
- O `shortUrl` deve ser montado no controller consumindo `ConfigService` para o `APP_BASE_URL`
- Usar `@Res()` do Express para o redirect: `res.redirect(302, originalUrl)`
- Nenhuma lógica de negócio no controller — apenas mapeamento de erros para exceções HTTP

---

## Resumo da Sprint

| Task | Descrição | Pontos | Depende de |
|------|-----------|--------|------------|
| TASK-01 | Prisma + schema + PrismaService | 2 | — |
| TASK-02 | PrismaUrlRepository | 3 | TASK-01 |
| TASK-03 | Redis cache service | 3 | TASK-01 |
| TASK-04 | UrlModule + providers | 2 | TASK-02, TASK-03 |
| TASK-05 | Controller + endpoints HTTP | 3 | TASK-04 |

**Total: 13 pontos**

> ℹ️ TASK-02 e TASK-03 podem ser desenvolvidas em paralelo após TASK-01 estar concluída.