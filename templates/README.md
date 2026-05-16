# Tapify vCard Templates (42)

Each public vCard uses `template_id` from the database (e.g. `vcard16`) and loads the matching file:

```
templates/vcard16.php  →  _bootstrap.php  →  legacy or _render.php
```

## File layout

| File | Purpose |
|------|---------|
| `vcard1.php` … `vcard42.php` | Entry point per template ID (required) |
| `_bootstrap.php` | Loads registry, legacy include, or renderer |
| `_theme-registry.php` | Metadata + layout variant per ID |
| `_render.php` | HTML shell for non-legacy themes |
| `_theme-base.css` | Shared component styles |
| `_theme-layouts.css` | Per-layout visual overrides |
| `_sections.php` | Services, gallery, forms, etc. |
| `_shared-scripts.php` | Save contact, share, inquiry, appointment |
| `default.php`, `lawyer.php`, … | Legacy full templates (used by vcard1, 13, 16, 20, 35) |

## Legacy templates (unchanged designs)

| ID | File loaded |
|----|-------------|
| vcard1 | `default.php` |
| vcard13 | `doctor.php` |
| vcard16 | `lawyer.php` |
| vcard20 | `restaurant.php` |
| vcard35 | `real-estate.php` |

## Adding a new template

1. Add an entry to `_theme-registry.php` with a unique `layout` key.
2. Add layout rules in `_theme-layouts.css` if needed (`.layout-yourname`).
3. Create `vcard43.php` (or next ID) that sets `$TAPIFY_TEMPLATE_SLUG` and requires `_bootstrap.php`.
4. Add the template to `frontend/vcard-edit.js` `templates` array.
5. Deploy `backend/templates/` to Railway.

Regenerate all entry files (optional):

```bash
php backend/templates/generate-vcard-files.php
```

## Routing

`backend/vcard.php` resolves:

```
template_id  →  templates/{template_id}.php
```

No modulo fallback. Missing files return a 500 HTML error page.
