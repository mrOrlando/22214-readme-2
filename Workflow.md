# Как работать над проектом

Краткая памятка по монорепозиторию **Nx**: все команды ниже — из каталога **`project`** (там лежит корневой `package.json`), если не сказано иначе.

## Содержание

1. [Окружение](#setup)
2. [Команды Nx](#nx-commands)
3. [Запуск и ссылки в браузере](#run-urls)
4. [Docker и env-файлы](#docker-env)
5. [PostgreSQL: Prisma, сиды, Studio](#prisma)
6. [Структура репозитория](#repo-layout)

---

<a id="setup"></a>

## 1. Окружение

- Нужны **Node.js** и **npm** (версию ориентируйте на курс или на то, что собирается у вас локально).
- Один раз после клонирования:

```bash
cd project
npm install
```

- В примерах целей Nx используется приложение **`blog`**. Другие проекты: `npx nx show projects`.

---

<a id="nx-commands"></a>

## 2. Команды Nx

| Задача | Команда |
|--------|---------|
| Проверка типов | `npx nx run blog:typecheck` |
| Сборка | `npx nx run blog:build` → артефакты в `apps/blog/dist` |
| Линт одного приложения | `npx nx run blog:lint` |
| Линт всего репозитория | `npx nx run-many -t lint` |
| Запуск приложения | `npx nx run blog:serve` (сначала build, затем процесс) |
| Сборка всех приложений | `npx nx run-many -t build` |
| Скрипт на TypeScript | `npx tsx путь/к/файлу.ts` |

**Очистка**

- Каталог сборки: `rm -rf apps/blog/dist` (при необходимости подставьте другое приложение).
- Кэш Nx (не то же самое, что `dist`): `npx nx reset`.

---

<a id="run-urls"></a>

## 3. Запуск и ссылки в браузере

| Сервис | Запуск | Что открыть |
|--------|--------|-------------|
| **blog** | `npx nx run blog:serve` | API: [http://localhost:3000/api](http://localhost:3000/api) (`GET`). Порт: **`PORT`**, по умолчанию **3000**. Префикс маршрутов: **`/api`**. Swagger UI в коде **не** подключён. |
| **@project/user** | `npx nx run @project/user:serve` | Swagger: **`/spec`** — например [http://localhost:3333/spec](http://localhost:3333/spec) (порт из **`apps/user/user.env`**, в примере **3333**). Если не открывается — попробуйте **`/api/spec`**. |

Точный URL после старта смотрите в логе приложения.

---

<a id="docker-env"></a>

## 4. Docker и env-файлы

### Перед первым `docker compose up`

1. Рядом с нужным **`docker-compose.yml`** должен быть **заполненный** env-файл; если его нет — скопируйте **`*.env.example`** и отредактируйте.
2. **Blog:** `DATABASE_URL` в **`project/.env`** должен совпадать с пользователем, паролем, хостом, портом и именем БД из **`apps/blog/blog.env`**.
3. **User:** **`apps/user/user.env`** должен совпадать с **`docker-compose.yml`** в `apps/user` (по умолчанию как в **`user.env.example`**: `admin` / `test`, база **`readme-users`**).

После смены учётных данных может понадобиться пересоздать контейнеры и тома (см. материалы курса).

### Blog — Postgres и pgAdmin

| | |
|--|--|
| Файлы | **`apps/blog/blog.env`** (из **`blog.env.example`**), плюс **`project/.env`** → **`DATABASE_URL`** |
| Запуск | `cd apps/blog` → при необходимости `cp blog.env.example blog.env` → правки → `docker compose up -d` |
| Postgres | `localhost:5432` (логин/пароль в `blog.env*`) |
| pgAdmin | [http://localhost:8082](http://localhost:8082) — email/пароль из **`PGADMIN_*`** в `blog.env*` |

**Мастер-пароль pgAdmin** («Unlock Saved Passwords») задаётся **в самом pgAdmin**, не в `blog.env`. В учебных примерах часто везде **`test`** — им же иногда задают мастер-пароль; если не подошёл — **Reset Master Password**, затем пароль сервера БД снова из `blog.env` (часто **`test`**).

### User — MongoDB и mongo-express

| | |
|--|--|
| Файлы | **`apps/user/user.env`** (из **`user.env.example`**) |
| Запуск | `cd apps/user` → при необходимости `cp user.env.example user.env` → `docker compose up -d` |
| MongoDB | `localhost:27017` |
| mongo-express | [http://localhost:8081](http://localhost:8081) |

---

<a id="prisma"></a>

## 5. PostgreSQL: Prisma, сиды, Studio

Цели Nx (из **`project`**): `blog:db:generate`, `blog:db:migrate`, `blog:db:seed`, `blog:db:lint`, `blog:db:reset` — полный список в **`apps/blog/package.json`** → **nx.targets**.

### Prisma Studio

```bash
cd libs/shared/blog/models
npx prisma studio --schema prisma/schema.prisma
```

Обычно откроется [http://localhost:5555](http://localhost:5555) (см. вывод в терминале).

### Сидирование (только blog)

В репозитории есть сид для Prisma (`libs/shared/blog/models/prisma/seed.ts`: категории, посты, комментарии). Для **MongoDB / user** отдельного сида нет.

**Условия:** Postgres в Docker запущен, **`DATABASE_URL`** согласован с **`blog.env`**, миграции применены.

```bash
npx nx run blog:db:generate
npx nx run blog:db:migrate
npx nx run blog:db:seed
```

**Если `DATABASE_URL is not set`:** задача работает из **`libs/shared/blog/models`**; положите туда **`.env`** с той же **`DATABASE_URL`**, что в **`project/.env`**, или экспортируйте переменную в терминале перед командой.

**Повторный `db:seed`** может упасть из‑за дубликатов постов. Очистка по правилам Prisma: **`npx nx run blog:db:reset`** (осторожно: сотрёт данные), затем при необходимости снова **`blog:db:seed`**.

---

<a id="repo-layout"></a>

## 6. Структура репозитория

| Путь | Назначение |
|------|------------|
| **`project/`** | Корень Nx: `package.json`, `nx.json`, `apps/`, `libs/` |
| **`project/apps/<имя>/src`** | Исходники сервиса (blog → `project/apps/blog/src`) |
| **`Readme.md`** (корень, рядом с `project`) | Памятка по учебному репозиторию |
| **`Contributing.md`** | Работа с Git и ветками |

Остальные файлы считайте служебными: не удаляйте и не меняйте без задания или указания наставника.
