<script lang="ts">
  import { faGithub } from "@fortawesome/free-brands-svg-icons"
  import Icon from 'fa-svelte'
  import Router, {link} from 'svelte-spa-router'

  import DNF from "./Components/DNF/DNF.svelte"
  import Landing from './Components/Landing.svelte';
  import QualifyingToResults from "./Components/QualifyingToResults/QualifyingToResults.svelte"

  import { latestRaceText } from './stores/data'
  import ROUTES from './utils/routes';


  const routes = {
    [ROUTES.LANDING]: Landing,
    [ROUTES.DNF]: DNF,
    [ROUTES.QUALIFYING]: QualifyingToResults,
    '*': Landing,
  }
</script>

<main>
  <nav>
    <section>
      <a id="logo" use:link={ROUTES.LANDING}><h1>Formula 1 Visualizations</h1></a>
        
      <a id="github-icon" href="https://github.com/harryli0088/formula-one-visualizations" target="_blank" rel="noopener noreferrer">
        <Icon icon={faGithub}/>
      </a>
    </section>
  </nav>
  <Router {routes}/>
	
  <footer>
    <p>Data provided by <a href="https://www.kaggle.com/rohanrao" target="_blank" rel="noopener noreferrer">Vopani</a> on <a href="https://www.kaggle.com/rohanrao/formula-1-world-championship-1950-2020" target="_blank" rel="noopener noreferrer">Kaggle</a>. {$latestRaceText}</p>
    <p>Have feedback? Open an issue in the <a href="https://github.com/harryli0088/formula-one-visualizations" target="_blank" rel="noopener noreferrer">Github Repo</a>!</p>
    <p>Built using <a href="https://svelte.dev/" target="_blank" rel="noopener noreferrer">Svelte</a> and <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">Typescript</a></p>
  </footer>

  
</main>

<style>
  :global([data-svelte-typeahead] label, [data-svelte-search] label) {
    font-size: 1em !important;
    font-weight: bold;
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

  nav {
    background: #222;
    color: white;
  }

  nav section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #logo {
    color: inherit;
    text-decoration: none;
  }

  #logo h1 {
    margin: 0;
  }

  #github-icon {
    color: inherit;
    font-size: 2em;
  }
</style>
