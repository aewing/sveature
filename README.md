# sveature

Svelte component library and feature testing

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/sveature.svg)](https://npmjs.org/package/sveature)
[![Downloads/week](https://img.shields.io/npm/dw/sveature.svg)](https://npmjs.org/package/sveature)
[![License](https://img.shields.io/npm/l/sveature.svg)](https://github.com/aewing/sveature/blob/master/package.json)

<!-- toc -->
* [sveature](#sveature)
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
sveature/0.0.0 linux-x64 node-v14.9.0
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

_See code: [src/commands/build.ts](https://github.com/aewing/sveature/blob/v0.0.0/src/commands/build.ts)_

## `sveature component`

create a new component & related files

```
USAGE
  $ sveature component

EXAMPLE
  $ sveature component
       creating new component
```

_See code: [src/commands/component.ts](https://github.com/aewing/sveature/blob/v0.0.0/src/commands/component.ts)_

## `sveature dev`

start feature library in development mode

```
USAGE
  $ sveature dev

EXAMPLE
  $ sveature dev
       starting sveature
```

_See code: [src/commands/dev.ts](https://github.com/aewing/sveature/blob/v0.0.0/src/commands/dev.ts)_

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

_See code: [src/commands/init.ts](https://github.com/aewing/sveature/blob/v0.0.0/src/commands/init.ts)_
<!-- commandsstop -->
