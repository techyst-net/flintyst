# Upstream source

| Field | Value |
|---|---|
| Upstream project | Onyx (formerly Danswer) |
| Source | https://github.com/onyx-dot-app/onyx |
| Licence (core) | MIT Expat |
| Licence (`ee/` directories) | Onyx Enterprise License |
| Retained notices | `LICENSE`, `backend/ee/LICENSE`, `web/src/app/ee/LICENSE`, `web/src/ee/LICENSE` |

## Licence obligations

The core is **MIT**: rebranding and redistribution are permitted provided the
copyright notice and permission notice are retained. `LICENSE` is kept intact,
including `Copyright (c) 2023-present DanswerAI, Inc.` — Danswer is the
project's former name and remains the copyright holder's legal name, so that
line is a copyright notice, not branding.

## The `ee/` directories

Three directories are **not** MIT:

- `backend/ee/`
- `web/src/app/ee/`
- `web/src/ee/`

Each carries an identical copy of the Onyx Enterprise License. Files in them
were rebranded along with the rest of the tree **at the project owner's explicit
direction**, after the licensing split was raised. That is recorded here rather
than left implicit.

The example environment ships `ENABLE_PAID_ENTERPRISE_EDITION_FEATURES=false`,
which is the correct setting without an entitlement. If you intend to
redistribute this product, delete the three `ee/` directories rather than
shipping them.

`backend/ee/onyx/utils/license_notifications.py` exists to surface licence
state — expect it to behave oddly in a rebranded, unlicensed deployment.

## Pulling upstream fixes

```sh
git remote add upstream https://github.com/onyx-dot-app/onyx.git
git fetch upstream --depth=50
```

Expect conflicts in:

- `web/lib/shared/tokens/primitives.json` — the `blue-*` family
- `web/lib/shared/scripts/verify-opal-parity.mjs` — the fork note
- `backend/static/images/`, `web/public/`, `desktop/src-tauri/icons/`
- `mobile/src/icons/onyx-logo.tsx`, `widget/src/assets/logo.ts`

The bulk rename touched 566 files. Resolve in favour of upstream code and
re-apply the rename to display strings only.

**Two things to re-check on every merge:** that `primitives.json`'s `blue-*`
values have not been reset, and that no new `Onyx*` identifier was renamed by
mistake — the word-boundary rule protects them, but a hand-resolved conflict
might not.
