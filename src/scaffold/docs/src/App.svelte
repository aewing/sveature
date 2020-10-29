<script context="module">
  import { getComponentFeatures } from "sveature/svelte";
  const components = getComponentFeatures();
</script>

<script>
  import Layout from "sveature/Layout.svelte";
</script>

<Layout {components} />