# Sveature

Simple feature file watcher and design library for Svelte & Sapper projects.

## Overview

Sveature watches the file pattern of your choice and automatically compiles the Svelte files contained therein. If a `metadata` object containing a `component` and `feature` property is exported from module context, the component will be added to a map and saved to the location of your choice. You can then import this map to present a design library within an existing Sapper/Svelte project.

# Typical Usage

1. Add `sveature` and `sveature-layout` to your project.

```sh
yarn add sveature sveature-layout
```

2. Create `sveature.config.js`:

```js
module.exports = {
  dir: "src/routes/docs",
  filename: "_features.ts",
  pattern: "src/components/**/features/*.svelte",
};
```

3. Configure your design library routes, or copy the `SvelteKit` example:

```sh
npx degit aewing/sveature-route-template#main src/routes/docs
```

4. Start your application, and open a browser to your design library
