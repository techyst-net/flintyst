# Flintyst Search

Enterprise search and AI chat over your own data: 40+ connectors (Confluence,
Salesforce, Slack, Google Drive, GitHub, …), hybrid vector search, an agentic
research mode, custom assistants and an MCP server.

## Architecture

| Component | Detail |
|---|---|
| `web/` | Next.js frontend |
| `web/lib/opal`, `web/lib/shared` | **Vendored** design system and design tokens |
| `backend/` | FastAPI API server, Celery workers, connector framework |
| `backend/ee/` | Enterprise features under a separate licence |
| `desktop/` | Tauri desktop app |
| `mobile/` | React Native app |
| `widget/`, `extensions/chrome/` | Embeddable chat widget and browser extension |
| `cli/`, `terraform-provider-onyx/` | Go CLI and Terraform provider |
| Data | PostgreSQL, Redis, Vespa (search index), S3/MinIO (file store) |

## Local setup

```sh
cd deployment/docker_compose
cp env.template .env
docker compose up -d
```

See [OPERATIONS.md](./OPERATIONS.md) for configuration, ports and deployment
requirements.

## Branding

| Surface | Where |
|---|---|
| Design tokens | `web/lib/shared/tokens/primitives.json` |
| Backend-served logos (emails, API pages) | `backend/static/images/` |
| Web logos, wordmarks, favicon | `web/public/` |
| Desktop icons | `desktop/src-tauri/icons/` — 37 PNGs, the `.ico`, and the macOS `.icns` |
| Mobile app icon and inline logo | `mobile/assets/images/icon.png`, `mobile/src/icons/onyx-logo.tsx` |
| Chrome extension icons | `extensions/chrome/public/` |
| Widget default logo | `widget/src/assets/logo.ts` — a base64 data URL, regenerated |
| Product name | swept across 566 files |

### The design system is vendored, so tokens were edited at source

Unlike several other products here, `@onyx-ai/opal` and `@onyx-ai/shared` are
**local packages** (`file:./lib/opal`, `file:./lib/shared`), not npm
dependencies. The palette could therefore be changed properly rather than
overridden by cascade.

`web/lib/shared/tokens/primitives.json` is the source of truth, compiled to CSS
by `bun run build:tokens` (style-dictionary). Reading the semantic layer shows
what actually needed changing:

- `theme-primary-*` → `onyx-ink-*`, which are **black and greys**. Upstream's
  primary ramp is deliberately monochrome, so it carries no brand identity and
  was left alone.
- `action-selection-*` and `action-text-link-05` → the **`blue-*`** family.
  That is the real interactive accent, so its 12 steps were remapped onto the
  brand indigo ramp.

`#E02D27`, which looks like a brand red in a naive colour census, is the
**Canvas LMS connector's logo** — a third party's mark, correctly left alone.

### One check will now report differences

`web/lib/shared/scripts/verify-opal-parity.mjs` is a migration gate that asserts
token values are *identical to the base branch*. Since the brand colours changed
deliberately, its value comparison now flags them. The script was **annotated
rather than deleted** — its other assertions (variable-name parity, no
duplicate definitions between the two packages) remain useful. See the note at
the top of that file.

### Deliberately left unchanged

- **`Onyx*` CamelCase identifiers** — `OnyxError` (1,711 uses),
  `OnyxErrorCode`, `OnyxCeleryTask`, `OnyxApiClient`, `OnyxRedisLocks` and
  many more. Real code symbols.
- **Terraform resource type names** — `onyx_persona`, `onyx_connector`,
  `onyx_document_set` and the rest. These are the public API of the provider:
  they appear in users' `.tf` files, so renaming them breaks every existing
  Terraform configuration.
- **The `onyx` Python package** and `LOG_ONYX_MODEL_INTERACTIONS` /
  `ENABLE_PAID_ENTERPRISE_EDITION_FEATURES` environment variable names.
- **`LICENSE`** and the three `ee/LICENSE` files, verbatim, including the
  `Copyright (c) 2023-present DanswerAI, Inc.` line (Danswer was this project's
  former name, and remains the copyright holder's name).

### Removed

`docs/` held upstream's internal planning documents and runbooks
(`craft-main-plan.md`, EKS runbooks, feature plans) — not product documentation.

## Provenance and licence

MIT for the core; **three `ee/` directories are under the Onyx Enterprise
License.** See [UPSTREAM.md](./UPSTREAM.md).
