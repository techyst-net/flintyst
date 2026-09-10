# Zeshan Search — Operations

> Shared infrastructure (Postgres, Redis, S3, SMTP, LLM …) is wired in
> already — see [../INFRA.md](../INFRA.md). This app runs at http://localhost:3050, http://localhost:8085.

## Generated configuration

A ready-to-run configuration has been generated in this directory:

- `deployment/docker_compose/.env`

Signing and encryption secrets in it are **real random values**, generated
per-file. Anything only you can supply — API keys, OAuth credentials — is
marked `CHANGE_ME`. Search for it:

```sh
grep -rn CHANGE_ME .
```

These files are gitignored and must not be committed.

## Services and ports

| Service | Port | Notes |
|---|---|---|
| Web (Next.js) | `3000` | |
| API server | `8080` | |
| Inference model server | `9000` | embedding/rerank models |
| Indexing model server | `9000` | separate instance |
| PostgreSQL | `5432` | |
| Redis | `6379` | |
| **Vespa** (search index) | `8081`, `19071` | the heaviest component |
| MinIO (file store) | `9004` | when using the bundled S3 |
| nginx | `80`/`443` | |

Compose lives in `deployment/docker_compose/`; Helm charts in
`deployment/helm/`.

## Required

| Variable | Purpose |
|---|---|
| `USER_AUTH_SECRET` | **Signs sessions.** Generate a long random value; empty means insecure sessions. |
| `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Database |
| `REDIS_HOST` | Cache and Celery broker |
| `VESPA_HOST` | Search index host |
| `MODEL_SERVER_HOST`, `INDEXING_MODEL_SERVER_HOST` | Embedding/rerank servers |
| `INTERNAL_URL` | How the web app reaches the API server |
| `WEB_DOMAIN` | Absolute public origin. Email links and OAuth callbacks derive from it. |

## File store

| Variable | Purpose |
|---|---|
| `FILE_STORE_BACKEND` | `s3` or local |
| `S3_ENDPOINT_URL`, `S3_FILE_STORE_BUCKET_NAME` | Bucket location |
| `S3_AWS_ACCESS_KEY_ID`, `S3_AWS_SECRET_ACCESS_KEY` | Credentials |
| `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD` | Bundled MinIO credentials — **change from `minioadmin`** |
| `USE_IAM_AUTH` | Use instance IAM instead of static keys |
| `COMPOSE_PROFILES` | `s3-filestore` starts the bundled MinIO |

Uploaded and indexed documents live in the file store, not the database. Back it
up separately.

## Authentication

| Variable | Purpose |
|---|---|
| `AUTH_TYPE` | `disabled`, `basic`, `google_oauth` or `oidc` |
| `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` | Google sign-in |
| `OPENID_CONFIG_URL`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET` | Generic OIDC |
| `SESSION_EXPIRE_TIME_SECONDS` | Session lifetime |
| `VALID_EMAIL_DOMAINS` | Restrict sign-up to your own domains |
| `REQUIRE_EMAIL_VERIFICATION` | With SMTP configured |
| `SMTP_SERVER`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | Outbound mail |

**`AUTH_TYPE=disabled` leaves the instance completely open.** It is convenient
locally and wrong anywhere reachable.

## Models

`GEN_AI_MODEL_PROVIDER`, `GEN_AI_API_KEY`, `GEN_AI_MODEL_VERSION`,
`FAST_GEN_AI_MODEL_VERSION`, `DOCUMENT_ENCODER_MODEL`, `NORMALIZE_EMBEDDINGS`,
`ENABLE_RERANKING_REAL_TIME_FLOW`.

The agentic research mode is tuned by roughly 45 `AGENT_*` variables (token
budgets, retrieval counts and per-call LLM timeouts). All have working defaults;
change them only to address a specific problem.

## Connectors

Credentials for the 40+ connectors are entered **in the admin UI** and stored
encrypted in the database — not in environment variables. Related settings:

`DISABLE_INDEX_UPDATE_ON_SWAP`, `CONTINUE_ON_CONNECTOR_FAILURE`,
`EXPERIMENTAL_CHECKPOINTING_ENABLED`, `INDEX_BATCH_SIZE`,
`POLL_CONNECTOR_OFFSET`.

## Enterprise features

`ENABLE_PAID_ENTERPRISE_EDITION_FEATURES` — **keep `false`** unless you hold an
entitlement. See `UPSTREAM.md`; the `ee/` directories are separately licensed.

## Observability

`LOG_LEVEL`, `LOG_ONYX_MODEL_INTERACTIONS` (logs full prompts and completions —
leave `False`, it writes user content to logs), `SENTRY_DSN`.

## Deployment requirements

- **Vespa is mandatory and is the resource-hungry component.** Budget several GB
  of RAM and persistent disk for the index; the product cannot search without it.
- **PostgreSQL, Redis and a file store** are all required.
- **Celery workers must run** — indexing, connector polling, pruning and
  document-set syncing are all background work. Without them connectors appear
  configured but never ingest anything.
- **Two model servers**: inference and indexing. Running one for both starves
  interactive queries during a large re-index.
- Run migrations (`alembic upgrade head`) before serving a new release.
- Set `USER_AUTH_SECRET`, a real `AUTH_TYPE`, `WEB_DOMAIN`, and change the
  MinIO credentials from their defaults.
- Persistent volumes for Postgres, Vespa and the file store.
