<script lang="ts">
  import Router from 'svelte-spa-router'

  import QualifyingToResults from "./Components/QualifyingToResults/QualifyingToResults.svelte"
  import DNF from "./Components/DNF/DNF.svelte"
  import { latestRace } from './stores/data'


  const routes = {
    '/did-not-finish': DNF,
    '/qualifying': QualifyingToResults,
  }
</script>

<main>
  <Router {routes}/>
	
  <footer>
    <p>Data provided by <a href="https://www.kaggle.com/rohanrao" target="_blank" rel="noopener noreferrer">Vopani</a> on <a href="https://www.kaggle.com/rohanrao/formula-1-world-championship-1950-2020" target="_blank" rel="noopener noreferrer">Kaggle</a>. {#if $latestRace } (Up-to-date to the {$latestRace.date} {$latestRace.name}) {/if}</p>
    <p>Github Repo: <a href="https://github.com/harryli0088/formula-one-visualizations" target="_blank" rel="noopener noreferrer">https://github.com/harryli0088/formula-one-visualizations</a></p>
    <p>Built using <a href="https://svelte.dev/" target="_blank" rel="noopener noreferrer">Svelte</a> and <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">Typescript</a></p>
  </footer>

  
</main>

<style>
  :global([data-svelte-typeahead] label) {
    font-size: 1em;
  }
  :global(.svelte-typeahead-list) {
    margin: 0;
    z-index: 2;
  }

  :global(.popover-content) {
    background: white;
  }

  main {
    overflow-x: hidden;
  }
</style>
