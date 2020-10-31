<script>
  export let components;
  export let brand = "sveature";

  let url = location.pathname;
  let component = null;
  let feature = null;

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
    const matches = [
      ...url.matchAll(/\/component\/(.[^\/]+)(?:\/feature\/(.[^\/]+))?/g),
    ];
    if (matches && matches[0]) {
      [[filename, component, feature]] = matches;
    }
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
    background: var(--sveature-header-bg, hsl(260, 70%, 30%));
    color: var(--sveature-header-fg, hsl(260, 70%, 97%));
    display: flex;
  }
  header .brand {
    width: 300px;
    text-align: center;
    background: var(--sveature-brand-bg, hsl(260, 70%, 40%));
  }
  header .brand > a {
    text-decoration: none;
    color: var(--sveature-brand-fg, hsl(260, 70%, 98%));
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
    border-top: 2px solid var(--sveature-hr-color, hsl(260, 10%, 90%));
  }
  .sidebar {
    width: 300px;
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
    color: var(--sveature-link-color, hsl(260, 70%, 30%));
  }
  .content {
    padding: 8px 16px;
    width: 100%;
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
  on:popstate={onPopState} />

<main>
  <div class="sidebar">
    <ul>
      {#each Object.entries(components) as [component, cdef]}
        <li>
          <a href={`/component/${component}`}>{component}</a>
          <ul>
            {#each Object.entries(cdef) as [feature, fdef]}
              <li>
                <a href={`/component/${component}/feature/${feature}`}>
                  {fdef.title}</a>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>
  <div class="content">
    {#if component && feature}
      <svelte:component this={components[component][feature].Component} />
    {:else if component}
      <h2>{component}</h2>
    {:else if !Object.keys(components).length}
      <h1>Oops!</h1>
      <p>No components were detected in your application.</p>
      <p>
        Double check your sveature.config.js and create some feature files using
        Svelte (default pattern is src/**/features/*.svelte)
      </p>
    {/if}
  </div>
</main>
