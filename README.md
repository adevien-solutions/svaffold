# Adevien - Svelte Scaffold

Scaffold a monorepo to collect projects of a new client.

⚠️ **Warning** ⚠️ This is a highly opinionated tool, but PRs are welcome to make it more
generalised. Refer to [Contributing](#contributing) for more information.

The following assumptions are made:

- The package manager is _pnpm_
- All projects are using _TypeScript_
- All web projects are using _SvelteKit_ and _TailwindCSS_
- If no design system was selected, the _forms_ and _typography_ Tailwind plugins will be installed

## Requirements

- node.js >= 14
- pnpm >= 7
- git

## Usage

```bash
npx run @adevien/svelte-scaffold root-dir
```

**Arguments:**

| Name      | Description          |
| --------- | -------------------- |
| directory | root of the monorepo |

**Options:**

| Option            | Description                                 |
| ----------------- | ------------------------------------------- |
| `--force`         | overwrite existing files (default: `false`) |
| `-h`, `--help`    | display help for command                    |
| `-V`, `--version` | output the version number                   |

## Contributing
