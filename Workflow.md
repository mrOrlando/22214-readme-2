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
| **blog** | `npx nx run blog:serve` | API: [http://localhost:3000/api](http://localhost:3000/api) (`GET`). Порт: **`PORT`**, по умолчанию **3000**. Префикс маршрутов: **`/api`**. Swagger: [http://localhost:3000/spec](http://localhost:3000/spec). После `db:generate` запускайте с **`--skip-nx-cache`**, иначе Nx может взять сборку со старым Prisma Client. |
| **@project/user** | `npx nx run @project/user:serve` | Swagger: **`/spec`** — например [http://localhost:3333/spec](http://localhost:3333/spec) (порт из **`apps/user/user.env`**, в примере **3333**). Если не открывается — попробуйте **`/api/spec`**. |
| **notification** | `npx nx run notification:serve` | Swagger: [http://localhost:3334/spec](http://localhost:3334/spec) (порт из **`apps/notification/notification.env`**). Сервис слушает очередь RabbitMQ и содержит один HTTP-обработчик рассылки: `POST /api/notifications/send`. |
| **file-server** | `npx nx run file-server:serve` | Swagger: [http://localhost:3335/spec](http://localhost:3335/spec) (порт из **`apps/file-server/file-server.env`**). Загрузка аватара (до 500 КБ) и фото поста (до 1 МБ), только jpg и png; тип проверяется по содержимому файла. Файлы лежат в **`UPLOAD_DIRECTORY`** (по умолчанию `apps/file-server/uploads`, в git не попадает). |

Точный URL после старта смотрите в логе приложения.

---

<a id="docker-env"></a>

## 4. Docker и env-файлы

### Перед первым `docker compose up`

1. Рядом с нужным **`docker-compose.yml`** должен быть **заполненный** env-файл; если его нет — скопируйте **`*.env.example`** и отредактируйте.
2. **Blog:** `DATABASE_URL` в **`project/.env`** должен совпадать с пользователем, паролем, хостом, портом и именем БД из **`apps/blog/blog.env`**.
3. **User:** учётные данные MongoDB задаются в **`apps/user/user.env`** (по умолчанию как в **`user.env.example`**: `admin` / `test`, база **`readme-users`**). Docker подхватывает их через `env_file`, поэтому **`MONGO_USER`/`MONGO_PASSWORD`** должны совпадать с **`MONGO_INITDB_ROOT_*`** и **`ME_CONFIG_MONGODB_ADMIN*`** в том же файле. Для notification то же самое: **`MONGO_*`** и **`RABBIT_*`** синхронизируйте с **`MONGO_INITDB_*`** и **`RABBITMQ_DEFAULT_*`** в **`notification.env`**.
   В **`user.env`** также нужны переменные JWT (см. **`user.env.example`**): **`JWT_ACCESS_TOKEN_SECRET`**, **`JWT_ACCESS_TOKEN_EXPIRES_IN`**, **`JWT_REFRESH_TOKEN_SECRET`**, **`JWT_REFRESH_TOKEN_EXPIRES_IN`**. Без них сервис не стартует.

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

Вход в **веб-интерфейс** mongo-express (окно логина в браузере): по умолчанию у образа обычно **`admin`** / **`pass`**. Учётка **`admin`** / **`test`** в `user.env` относится к **подключению к MongoDB**, а не к этой странице.

### Notification — RabbitMQ, MongoDB, fake SMTP

| | |
|--|--|
| Файлы | **`apps/notification/notification.env`** (из **`notification.env.example`**) |
| Запуск | `cd apps/notification` → при необходимости `cp notification.env.example notification.env` → `docker compose up -d` |
| RabbitMQ | AMQP `localhost:5672`, веб-интерфейс [http://localhost:15672](http://localhost:15672) (`admin` / `test`) |
| MongoDB | `localhost:27018`, база **`readme-notification`** (порт отличается от user: 27017) |
| Fake SMTP (MailDev) | SMTP `localhost:1025`, веб-интерфейс с полученными письмами [http://localhost:1080](http://localhost:1080) |

**Как это работает.** Сервисы общаются с notification асинхронно через очередь **`RABBIT_QUEUE`** (по умолчанию `readme.notification`):

| Событие | Кто публикует | Что делает notification |
|---------|---------------|-------------------------|
| `user.registered` | user — после регистрации | сохраняет email получателя (повтор события ничего не меняет) |
| `post.published` | blog — при создании, репосте или публикации черновика | кладёт публикацию в список неотправленных (черновики не попадают) |

Публикация события не ломает и не задерживает основную операцию: событие отправляется в фоне, при недоступном RabbitMQ попытка повторяется несколько раз с паузами (около полутора минут), ошибки пишутся в лог. Обработчики notification идемпотентны, поэтому повторная доставка безопасна. Сообщение, которое не удалось обработать, повторяется с паузами и один раз возвращается в очередь; сообщение, не прошедшее валидацию, отклоняется сразу.

**Рассылка.** `POST http://localhost:3334/api/notifications/send` отправляет всем подписчикам одно письмо со списком публикаций, появившихся с прошлой рассылки. Публикации помечаются отправленными, только если ушли все письма; при ошибке SMTP повторный вызов отправит их только тем, кто письмо ещё не получил. Если новых публикаций нет, письма не уходят. Сам сервис ничего не планирует: запускать обработчик должен внешний планировщик, например `cron` (раз в час):

```bash
0 * * * * curl -s -X POST http://localhost:3334/api/notifications/send
```

**Переменные** в `notification.env`: `MONGO_*`, `RABBIT_HOST`, `RABBIT_PORT`, `RABBIT_USER`, `RABBIT_PASSWORD`, `RABBIT_QUEUE`, `MAIL_SMTP_HOST`, `MAIL_SMTP_PORT`, `MAIL_USER_NAME`, `MAIL_USER_PASSWORD`, `MAIL_FROM`, `PORT`. В **`user.env`** и **`blog.env`** нужны **`RABBIT_*`** (те же значения), иначе сервисы не стартуют.

**Ручная проверка:** зарегистрируйте пользователя (`apps/user/src/app/auth/auth.http`), создайте пост (`apps/blog/src/app/blog-post/blog-post.http`), вызовите `apps/notification/src/app/notification/notification.http` и откройте письмо в MailDev.

---

### User — подписки и данные пользователей

Эндпоинты сервиса user (примеры в `apps/user/src/app/user/user.http`):

| Запрос | Что делает |
|--------|-----------|
| `GET /api/users?ids=a,b` | имя и аватар нескольких пользователей (до 100), например авторов постов |
| `GET /api/users/:id` | дата регистрации и число подписчиков; число публикаций хранит blog, его добавляет API Gateway (`GET /api/posts?userId=…`, поле `totalItems`) |
| `POST` и `DELETE /api/users/:id/subscription` | подписаться и отписаться (нужен access-токен; на себя подписаться нельзя) |
| `GET /api/users/me/subscriptions` | id авторов, на которых подписан пользователь |

Лента строится в API Gateway: id подписок из user плюс свой id передаются в blog как `GET /api/posts?userIds=a,b,c`. Посты, которые лайкнул пользователь: `GET /api/posts?likedBy=<id>`. Аватар при регистрации передаётся путём файла (`avatar`), который вернул file-server.

---

---

<a id="prisma"></a>

## 5. PostgreSQL: Prisma, сиды, Studio

Команды выполняются из каталога **`project`**. Цели для Prisma/БД объявлены в **`apps/blog/package.json`** → **nx.targets** (ниже); остальные цели **`blog`** (**`build`**, **`serve`**, **`lint`** и т.д.) смотрите там же.

| Цель Nx | Команда | Назначение |
|---------|---------|------------|
| **`blog:db:generate`** | `npx nx run blog:db:generate` | Сгенерировать **Prisma Client** по схеме (`prisma generate`). |
| **`blog:db:migrate`** | `npx nx run blog:db:migrate` | Применить миграции в режиме разработки (`prisma migrate dev`). |
| **`blog:db:seed`** | `npx nx run blog:db:seed` | Заполнить БД тестовыми данными (`prisma/seed.ts` через **tsx**). |
| **`blog:db:lint`** | `npx nx run blog:db:lint` | Проверить схему Prisma (`prisma validate`). |
| **`blog:db:reset`** | `npx nx run blog:db:reset` | Сбросить БД и заново накатить миграции (`prisma migrate reset --force`); **удаляет данные**. |

Все эти задачи запускают команды из **`libs/shared/blog/models`** (см. **nx** в **`apps/blog/package.json`**).

### Prisma Studio

Конфиг **`prisma.config.ts`** подхватывает **`project/.env`** (корень монорепозитория), поэтому **`DATABASE_URL`** не обязан дублироваться в **`libs/shared/blog/models/.env`**.

```bash
cd project/libs/shared/blog/models
npx prisma studio
```

В **Prisma 7** у команды **`studio`** нет флага **`--schema`** — путь к схеме задаётся в **`prisma.config.ts`**. При запуске из другой папки укажите конфиг явно: `npx prisma studio --config=путь/к/prisma.config.ts`.

Либо из **`project`**: сначала `cd project`, затем `cd libs/shared/blog/models`.

Адрес Studio **не фиксирован**: в **Prisma 7** в терминале выводится строка вида **`Prisma Studio is running at: http://localhost:<порт>`** (у вас может быть, например, **51212**, если **5555** занят или CLI выбрал другой порт). Открывайте именно тот URL из вывода.

Чтобы задать порт явно: `npx prisma studio --port 5555` (или другой свободный порт).

Если ошибка про **`DATABASE_URL`** всё же есть — проверьте, что файл **`project/.env`** существует и в нём задана строка подключения.

### Сидирование (только blog)

В репозитории есть сид для Prisma (`libs/shared/blog/models/prisma/seed.ts`: теги, посты, комментарии, лайки). Сид для **MongoDB / user** описан ниже.

**Условия:** Postgres в Docker запущен, **`DATABASE_URL`** согласован с **`blog.env`**, миграции применены.

```bash
npx nx run blog:db:generate
npx nx run blog:db:migrate
npx nx run blog:db:seed
```

**Если `DATABASE_URL is not set`:** убедитесь, что в **`project/.env`** задан **`DATABASE_URL`** (его подхватывают и Prisma CLI, и **`prisma-client`** при сидировании). При необходимости можно дублировать переменную в **`libs/shared/blog/models/.env`** или экспортировать её в терминале.

**Повторный `db:seed`** безопасен: существующие записи пропускаются.

### Сидирование user (MongoDB)

Сид `apps/user/src/seed/seed.ts` создаёт трёх пользователей; их id совпадают с авторами постов из сида blog. Параметры подключения берутся из **`apps/user/user.env`**, тестовый пароль задан в самом файле сида.

**Условия:** MongoDB в Docker запущена, **`user.env`** создан.

```bash
npx nx run @project/user:db:seed
```

Повторный запуск безопасен: существующие пользователи не изменяются.

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
