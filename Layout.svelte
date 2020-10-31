<script>
  export let components;
  export let brand = "sveature";

  let url = location.pathname;

  let component = null;
  let feature = null;
  let params = [];

  function onClick(e) {
    if (e.target.nodeName === "A") {
      e.stopPropagation();
      e.preventDefault();
      history.pushState({}, null, e.target.href);
      updateUrl();
    }
  }

  function onPushState() {
    updateUrl();
  }

  function onPopState() {
    updateUrl();
  }

  function updateUrl() {
    url = location.pathname;

    setTimeout(() => {
      onRouteChange();
    }, 0);
  }

  function onRouteChange() {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });
  }

  $: {
    [component, feature = null, ...params] = url.substring(1).split("/");
  }
</script>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 16px;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  header {
    height: 64px;
    line-height: 64px;
    background: var(--sveature-header-bg);
    color: var(--sveature-header-fg);
    display: flex;
  }
  header .brand {
    width: 300px;
    text-align: center;
    background: var(--sveature-brand-bg);
  }
  header .brand > a {
    text-decoration: none;
    color: var(--sveature-brand-fg);
  }
  header .brand > a > h1 {
    margin: 0;
    padding: 0;
  }
  header .title h2 {
    margin: 0;
    padding: 0 16px;
  }
  main {
    display: flex;
    height: calc(100vh - 64px);
    width: 100vw;
  }
  main :global(.theme) {
    background: transparent;
  }
  main :global(.theme h1) {
    margin: 0;
  }
  main :global(hr) {
    margin-top: 16px;
    border: none;
    border-top: 2px solid hsl(260, 10%, 90%);
  }
  .sidebar {
    width: 300px;
    flex-grow: 0;
    flex-shrink: 0;
    background: #eee;
  }
  .sidebar ul {
    list-style: none;
  }

  .sidebar > ul {
    margin: 0;
    padding: 0;
  }

  .sidebar > ul > li a {
    display: block;
    padding: 8px;
  }

  .sidebar > ul > li > ul {
    margin: 0;
    padding: 0 0 0 16px;
    border-bottom: 1px solid hsl(0, 0%, 85%);
    background: hsl(0, 0%, 98%);
  }

  .sidebar > ul > li > ul > li > a {
    display: block;
    background: hsl(0, 0, 0, 92%);
  }
  .sidebar > ul > li > ul > li > a:hover {
    background: hsl(0, 0, 0, 87%);
  }

  .sidebar > ul > li > a {
    font-size: 18px;
    font-weight: bold;

    color: #111;
    background: hsl(0, 0%, 90%);
  }

  .sidebar > ul > li > a:hover {
    background: hsl(0, 0%, 85%);
  }
  .sidebar a {
    text-decoration: none;
    color: var(--sveature-link-color);
  }
  .content {
    padding: 8px 16px;
    width: 100%;
    overflow: auto;
  }

  h2 {
    font-size: 42px;
    margin: 0;
  }

  h3 {
    background: var(--sveature-section-bg);
    color: var(--sveature-section-fg);
    font-size: 32px;
    padding: 8px 16px;
    margin: 0;
  }

  .feature {
    border: 2px solid var(--sveature-section-bg);
    margin-bottom: 8px;
  }

  .feature__content {
    padding: 8px 16px;
  }

  :root {
    --sveature-section-bg: hsl(260, 70%, 40%);
    --sveature-section-fg: white;
    --sveature-link-color: hsl(260, 70%, 30%);
    --sveature-header-bg: hsl(260, 70%, 30%);
    --sveature-header-fg: hsl(260, 70%, 97%);
    --sveature-brand-bg: hsl(260, 70%, 40%);
    --sveature-brand-fg: hsl(260, 70%, 98%);
  }
</style>

<header>
  <div class="brand">
    <a href="/"><h1>{brand}</h1></a>
  </div>
  <div class="title">
    {#if component || feature}
      <h2>{component}{feature ? ` / ${feature}` : ''}</h2>
    {:else}
      <h2>Home</h2>
    {/if}
  </div>
</header>

<svelte:window
  on:click={onClick}
  on:pushstate={onPushState}
  on:popstate={onPopState}
/>

<main>
  <div class="sidebar">
    <ul>
      {#each Object.entries(components) as [component, cdef]}
        <li>
          <a href={`/${component}`}>{component}</a>
          <ul>
            {#each Object.keys(cdef) as feature}
              <li><a href={`/${component}/${feature}`}>{feature}</a></li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>
  <div class="content">
    {#if component && feature && components[component] && components[component][feature]}
      <svelte:component this={components[component][feature].Component} />
    {:else if component && !feature && components[component]}
      <h2>{component}</h2>
      {#each Object.entries(components[component]) as [feature, fdef]}
        <div class="feature">
          <h3>{feature}</h3>
          <div class="feature__content">
            <svelte:component this={fdef.Component} />
          </div>
        </div>
      {/each}
    {:else if !Object.keys(components).length}
      <h1>Oops!</h1>
      <p>No components were detected in your application.</p>
      <p>
        Double check your sveature.config.js and create some feature files using
        Svelte (the default feature file matching pattern is
        src/**/features/*.svelte)
      </p>
    {:else if !component & !feature}
      <slot>
        <h1>{brand}</h1>
        <p>
          Use the navigation to the left to preview components and their
          features.
        </p>
      </slot>
    {:else}
      <h1>404</h1>
      <p>The feature or component you're looking for was not found.</p>
    {/if}
  </div>
</main>
