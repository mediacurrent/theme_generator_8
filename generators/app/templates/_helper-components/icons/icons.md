---
title: Icons
---

These icons are used throughout the site.

## Usage:

Import the icons macro.

Call the `.get()` function passing it the icon name.

**Example:**
```
{% import '@<%= themeNameMachine %>/icons/icons-macro-twig' as icons %}
{{ icons.get('facebook') }}
```
This will render the svg inline.
```
<svg aria-hidden="true" class="icon icon--facebook">...</svg>
```
