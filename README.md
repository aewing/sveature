# Sveature

Simple feature file watcher and design library for Svelte & Sapper projects.

## Overview

Sveature watches the file pattern of your choice and automatically compiles the Svelte components contained therein. If a `metadata` object is exported from module context, the component will be added to a mapping this metadata and saved to the location of your choice. You can then import this map to present a design library (or plenty of other things) within an existing Sapper/Svelte project.

# Typical Usage

1. Add `sveature` to your project.

```sh
yarn add sveature
```

2. Create `sveature.config.cjs`:

```js
module.exports = {
  dir: "src/routes/docs",
  filename: "_features.ts",
  pattern: "src/components/**/features/*.svelte",
};
```

3. Run `sveature build` or `sveature watch`, or add the following to your `snowpack.config.js`:

```json
   plugins: [[
      "@snowpack/plugin-run-script",
      {
        cmd: "sveature build",
        watch: "sveature watch",
      },
  ]],
```

4. In your application, import the `filename` used to generate your feature mapping, and use it as needed.

Usage examples:
[sveature-layout](https://github.com/aewing/sveature-layout)
[sveature-route-template](https://github.com/aewing/sveature-route-template)

# Example Metadata

```svelte
<script lang="ts" context="module">
  export const metadata = {
    title: "Page Wrapper Component",
    navigation: ["Page"], // Heirarchy of parent categories
    label: "FooBar", // The label of the anchor tag to this feature
    slug: "cms/article", // The slug to use for this feature
  };
</script>
```

# Building a Display Library

Using the metadata example above, you could `import { navigation } from "./_features";`, and present a layout with navigation links to your feature files. Then, in `[...slug.svelte]` you could `import { routes } from "./_features";`, and dynamically load the desired feature file.

Example:

```svelte
<script context="module">
  import { routes } from "./_features";
  export async function load({ page }) {
    const slug = page.params.slug.join("/");
    const [name, loader] = routes[slug];
    const component = await loader();
    return { props: { slug, name, component } };
  }
</script>

<script>
  export let slug, name, component;
</script>

<svelte:component this={component} />
```
