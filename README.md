# Adevien - Svelte Scaffold

Scaffold a monorepo to collect projects of a new client.

⚠️ **Warning** ⚠️ This is a highly opinionated tool, but PRs are welcome to make it more
generalised. Refer to [Contributing](#contributing) for more information.

The following assumptions are made:

- The package manager is _pnpm_
- All projects are using _TypeScript_
- All web projects are using _SvelteKit_ and _TailwindCSS_
- If no design system was selected, the _forms_ and _typography_ Tailwind plugins will be installed

## What can be generated

A monorepo that uses [Turborepo](https://turbo.build/repo/). It can generate the following _empty_
projects:

**SvelteKit:**

- [x] Landing page
- [x] Blog
- [x] Custom app
- [x] Component library

**Other:**

- [x] CMS
- [x] CLI
- [x] Assets (shared static files)
- [x] Config (shared configuration files)

### Options

[TailwindCSS](https://tailwindcss.com/) will be installed, but you can extend it with the following
design systems:

- [x] DaisyUI
- [x] SkeletonUI
- [x] None

You can select the following deployment methods:

- [x] Auto
- [x] Cloudflare

  _(A GitHub Workflow will be created to redeploy when the package has changes)_

- [x] Vercel
- [x] Docker (Node.js)

  _(A Dockerfile will be generated)_

In case you select "Component library", you can choose between the following story builders:

- [ ] Storybook
- [ ] Histoire
- [x] None

In case you select "CMS", you can select from the following:

- [x] Payload
- [ ] Sanity
- [ ] Storyblok

In case you select "Assets", you can select the following bucket providers:

_(A GitHub Workflow will be created to sync the assets with your bucket)_

- [x] GCP Cloud Storage
- [ ] AWS S3
- [ ] Cloudflare R2
- [x] None

## Requirements

- node.js >= 16
- pnpm >= 7
- git

## Usage

```bash
npx @adevien/svelte-scaffold@latest root-dir
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
