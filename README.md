# sveature

Sveature is an opinionated component feature testing and library utility for Sapper and Svelte projects.

The goal of this project is to offer an alternative to Storybook that enables developers to easily demonstrate and test features of their Svelte components.

Currently this is accomplished with a wrapper around Rollup and livereload, but the intent is to leverage Snowpack and the upcoming svelte kit and adapters.

---

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/sveature.svg)](https://npmjs.org/package/sveature)
[![Downloads/week](https://img.shields.io/npm/dw/sveature.svg)](https://npmjs.org/package/sveature)
[![License](https://img.shields.io/npm/l/sveature.svg)](https://github.com/aewing/sveature/blob/master/package.json)

---

# Getting Started

## Install the package globally

```sh-session
$ yarn global add sveature
```

or

```sh-session
$ npm i -g sveature
```

## Initialize Sveature

In an empty directory or an existing Sapper application:

```sh-session
$ sveature init
```

#### What it Does

`sveature init` does a few things to configure your project for you:

1. If the directory is empty:

- Uses degit to copy the Sapper Rollup template
- Configures Sapper for TypeScript
- Installs Sapper dependencies

2. Updates/Installs Testing Dependencies:

- yarn upgrade
- installs latest versions of testing packages
- installs sveature locally

3. Copies project files:

- creates the docs folder as configured
- populates the docs folder with default configuration

## Starting Sveature

Now that your project is configured, you're ready to start Sveature!

```sh-session
$ sveature dev
Starting Sveature in development mode
⌚ Bundling
LiveReload enabled
http://localhost:10001 -> /home/example/projects/sveature-test/docs/dist
✔ Bundled
```

This will start Rollup in watch mode and serve the bundle with livereload.

The URL for the application will be printed in the console.

## Creating components

Now that you have your Sveature development server listening, you can start creating components.

`sveature component` allows you to quickly scaffold new components with example unit test and feature files.

```sh-session
$ sveature component
What do you want to call this component?: Dropdown
Creating component at /home/example/projects/sveature-test/src/components/Dropdown
✔ Component created
```

As you make changes to the component and feature files, livereload will automatically refresh the page and reflect your changes.

Feature files can be imported in unit tests to assert that specific features deliver the intended results.

In a default configuration, tests can be executed by running `yarn jest` in the project directory.

## Building the Component Library

Once your component library is ready to be published, you can bundle the component library into the configured docs directory:

```sh-session
$ sveature build
⌚ Building Sveature
✔ Build completed
```

Your component library can now be served using static pages or from within your Sapper application.
Future builds of Sveature will enable you to generate true static bundles including HTML.

## How it Works

Sveature is essentially a wrapper around [rollup-plugin-glob-files](https://www.npmjs.com/package/rollup-plugin-glob-files).
A glob of your choosing is imported as `@features` within the code, presenting metadata that is exported within the `.svelte` or `.svx` files.
This metadata is used within a [simple Svelte layout](https://github.com/aewing/sveature/blob/main/Layout.svelte) to present a SPA within which they can be viewed.
This layout can be replaced within the [App.svelte](https://github.com/aewing/sveature/blob/main/src/scaffold/docs/src/App.svelte) that is included in `docs/src` directory after `init`.

<!-- toc -->
* [sveature](#sveature)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g sveature
$ sveature COMMAND
running command...
$ sveature (-v|--version|version)
sveature/0.0.5 linux-x64 node-v14.9.0
$ sveature --help [COMMAND]
USAGE
  $ sveature COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`sveature build`](#sveature-build)
* [`sveature component`](#sveature-component)
* [`sveature dev`](#sveature-dev)
* [`sveature help [COMMAND]`](#sveature-help-command)
* [`sveature init`](#sveature-init)

## `sveature build`

build feature library

```
USAGE
  $ sveature build

EXAMPLE
  $ sveature build
       building feature library
```

_See code: [src/commands/build.ts](https://github.com/aewing/sveature/blob/v0.0.5/src/commands/build.ts)_

## `sveature component`

create a new component & related files

```
USAGE
  $ sveature component

EXAMPLE
  $ sveature component
       creating new component
```

_See code: [src/commands/component.ts](https://github.com/aewing/sveature/blob/v0.0.5/src/commands/component.ts)_

## `sveature dev`

start feature library in development mode

```
USAGE
  $ sveature dev

EXAMPLE
  $ sveature dev
       Starting Sveature in development mode
```

_See code: [src/commands/dev.ts](https://github.com/aewing/sveature/blob/v0.0.5/src/commands/dev.ts)_

## `sveature help [COMMAND]`

display help for sveature

```
USAGE
  $ sveature help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `sveature init`

initialize sveature in a new or existing project

```
USAGE
  $ sveature init

OPTIONS
  -d, --dir=dir          directory of sveature project
  -p, --pattern=pattern  pattern for feature file matching

EXAMPLE
  $ sveature init
```

_See code: [src/commands/init.ts](https://github.com/aewing/sveature/blob/v0.0.5/src/commands/init.ts)_
<!-- commandsstop -->
