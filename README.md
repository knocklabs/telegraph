![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

# Telegraph

> The design system at [Knock](https://knock.app)

## Installation Instructions

```
npm install @telegraph/tokens
```

### Add stylesheets

Pick one:

Via CSS (preferred):

```
@import "@telegraph/tokens"; (option: default.css, dark.css, light.css)
```

Via Javascript:

```
import "@telegraph/tokens/default.css"; (options: default.css, dark.css, light.css)
```

Scope styles:

```
<body className="tgph">
```

> Note: If you only want to use telegraph in a certain part of your app, you would wrap that part in an element with the `tgph` class.

## Developing Locally

Here is how to run the Storybook and development server locally:

1. Clone the repository

```bash
git clone https://github.com/knocklabs/telegraph.git
```

2. Install dependencies

```bash
asdf install
yarn install
```

3. Compile the packages and watch for changes

```bash
yarn dev:packages
```

4. In another terminal tab, run the Storybook server

```bash
yarn dev:storybook
```

5. Open `http://localhost:3005` in your browser. You can now make changes to the code and see them refresh automatically.

6. Running tests

```bash
yarn test:watch
```

### Before committing changes

Before committing, run the following commands to ensure the code is formatted and linted:

```bash
yarn format
yarn lint
```

### Releasing

We use [changesets](https://github.com/changesets/changesets) to manage releases. Each time a PR is opened, make sure to include a changeset. A changeset bot will add a comment to your PR prompting you to do so with a template, click that and commit it to your PR.

#### Publishing to npm

Releases publish from [`release.yml`](.github/workflows/release.yml) through npm trusted publishing (OIDC). CI holds no npm token: each run gets a short-lived token from GitHub, and every published version carries a signed provenance statement. Only runs in the `production-release` environment can publish, and that environment only allows `main`.

Each package needs a trusted publisher on npm that points at this repo, `release.yml`, and the `production-release` environment. Before you add any, check that the `production-release` environment (repo Settings → Environments) only allows the `main` branch, and that admins can't bypass it. npm doesn't check the branch, so until that policy is in place, any branch that runs `release.yml` in this environment can publish.

Then set up the trusted publishers from your machine:

```bash
npm install -g npm@11       # npm trust needs 11.15.0+
npm login                   # your npm account needs 2FA
yarn release:bootstrap      # all publishable packages, or name specific ones
```

`npm trust` asks for 2FA once, and its 5-minute skip window covers every package. npm drops a new trusted publisher that doesn't publish within 2 days, so run this while the Version PR that releases the packages is open, and merge it within 2 days. Add `--dry-run` to print the npm commands without running them.

#### Adding a new package

npm can't publish the first version of a new package name through trusted publishing. `yarn release:bootstrap` works around this:

1. Create the package with `yarn generate:package`, and add a changeset for it.
2. Once the Version PR that releases it is open, run `yarn release:bootstrap @telegraph/<name>`. It publishes a `0.0.0-placeholder` prerelease so the name exists, then adds the trusted publisher.
3. Merge the Version PR within 2 days. The real first version publishes from CI like every other package.

If a release includes a package that isn't on npm yet, `release:publish` fails before it publishes anything and names the command to run.

## Packages

### Core Packages

| Name                                                                                                        | Version                                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [@telegraph/appearance](https://github.com/knocklabs/telegraph/tree/main/packages/appearance)               | [![npm version](https://img.shields.io/npm/v/@telegraph/appearance.svg)](https://www.npmjs.com/package/@telegraph/appearance)               |
| [@telegraph/button](https://github.com/knocklabs/telegraph/tree/main/packages/button)                       | [![npm version](https://img.shields.io/npm/v/@telegraph/typography.svg)](https://www.npmjs.com/package/@telegraph/button)                   |
| [@telegraph/combobox](https://github.com/knocklabs/telegraph/tree/main/packages/combobox)                   | [![npm version](https://img.shields.io/npm/v/@telegraph/combobox.svg)](https://www.npmjs.com/package/@telegraph/combobox)                   |
| [@telegraph/icon](https://github.com/knocklabs/telegraph/tree/main/packages/icon)                           | [![npm version](https://img.shields.io/npm/v/@telegraph/typography.svg)](https://www.npmjs.com/package/@telegraph/icon)                     |
| [@telegraph/input](https://github.com/knocklabs/telegraph/tree/main/packages/input)                         | [![npm version](https://img.shields.io/npm/v/@telegraph/input.svg)](https://www.npmjs.com/package/@telegraph/input)                         |
| [@telegraph/layout](https://github.com/knocklabs/telegraph/tree/main/packages/layout)                       | [![npm version](https://img.shields.io/npm/v/@telegraph/layout.svg)](https://www.npmjs.com/package/@telegraph/layout)                       |
| [@telegraph/link](https://github.com/knocklabs/telegraph/tree/main/packages/link)                           | [![npm version](https://img.shields.io/npm/v/@telegraph/link.svg)](https://www.npmjs.com/package/@telegraph/link)                           |
| [@telegraph/menu](https://github.com/knocklabs/telegraph/tree/main/packages/menu)                           | [![npm version](https://img.shields.io/npm/v/@telegraph/menu.svg)](https://www.npmjs.com/package/@telegraph/menu)                           |
| [@telegraph/modal](https://github.com/knocklabs/telegraph/tree/main/packages/modal)                         | [![npm version](https://img.shields.io/npm/v/@telegraph/modal.svg)](https://www.npmjs.com/package/@telegraph/modal)                         |
| [@telegraph/popover](https://github.com/knocklabs/telegraph/tree/main/packages/popover)                     | [![npm version](https://img.shields.io/npm/v/@telegraph/popover.svg)](https://www.npmjs.com/package/@telegraph/popover)                     |
| [@telegraph/radio](https://github.com/knocklabs/telegraph/tree/main/packages/radio)                         | [![npm version](https://img.shields.io/npm/v/@telegraph/radio.svg)](https://www.npmjs.com/package/@telegraph/radio)                         |
| [@telegraph/segmented-control](https://github.com/knocklabs/telegraph/tree/main/packages/segmented-control) | [![npm version](https://img.shields.io/npm/v/@telegraph/segmented-control.svg)](https://www.npmjs.com/package/@telegraph/segmented-control) |
| [@telegraph/tag](https://github.com/knocklabs/telegraph/tree/main/packages/tag)                             | [![npm version](https://img.shields.io/npm/v/@telegraph/tag.svg)](https://www.npmjs.com/package/@telegraph/tag)                             |
| [@telegraph/tokens](https://github.com/knocklabs/telegraph/tree/main/packages/tokens)                       | [![npm version](https://img.shields.io/npm/v/@telegraph/tokens.svg)](https://www.npmjs.com/package/@telegraph/tokens)                       |
| [@telegraph/tooltip](https://github.com/knocklabs/telegraph/tree/main/packages/tooltip)                     | [![npm version](https://img.shields.io/npm/v/@telegraph/tooltip.svg)](https://www.npmjs.com/package/@telegraph/tooltip)                     |
| [@telegraph/typography](https://github.com/knocklabs/telegraph/tree/main/packages/typography)               | [![npm version](https://img.shields.io/npm/v/@telegraph/typography.svg)](https://www.npmjs.com/package/@telegraph/typography)               |

### Internal Packages

| Name                                                                                                    | Version                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [@telegraph/compose-refs](https://github.com/knocklabs/telegraph/tree/main/packages/compose-refs)       | [![npm version](https://img.shields.io/npm/v/@telegraph/compose-refs.svg)](https://www.npmjs.com/package/@telegraph/compose-refs)       |
| [@telegraph/helpers](https://github.com/knocklabs/telegraph/tree/main/packages/helpers)                 | [![npm version](https://img.shields.io/npm/v/@telegraph/helpers.svg)](https://www.npmjs.com/package/@telegraph/helpers)                 |
| [@telegraph/postcss-config](https://github.com/knocklabs/telegraph/tree/main/packages/postcss-config)   | [![npm version](https://img.shields.io/npm/v/@telegraph/postcss-config.svg)](https://www.npmjs.com/package/@telegraph/postcss-config)   |
| [@telegraph/prettier-config](https://github.com/knocklabs/telegraph/tree/main/packages/prettier-config) | [![npm version](https://img.shields.io/npm/v/@telegraph/prettier-config.svg)](https://www.npmjs.com/package/@telegraph/prettier-config) |
| [@telegraph/style-engine](https://github.com/knocklabs/telegraph/tree/main/packages/style-engine)       | [![npm version](https://img.shields.io/npm/v/@telegraph/style-engine.svg)](https://www.npmjs.com/package/@telegraph/style-engine)       |
| [@telegraph/vite-config](https://github.com/knocklabs/telegraph/tree/main/packages/vite-config)         | [![npm version](https://img.shields.io/npm/v/@telegraph/vite-config.svg)](https://www.npmjs.com/package/@telegraph/vite-config)         |

### Upcoming Packages

| Name                    | Status  |
| ----------------------- | ------- |
| @telegraph/color-picker | Planned |
| @telegraph/data-list    | Planned |
| @telegraph/dialog       | Planned |
| @telegraph/divider      | Planned |
| @telegraph/form-control | Planned |
| @telegraph/spinner      | Planned |
| @telegraph/tab          | Planned |
| @telegraph/textarea     | Planned |
| @telegraph/toast        | Planned |
| @telegraph/toggle       | Planned |
