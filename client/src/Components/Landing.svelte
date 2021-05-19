<script lang="ts">
  import { faCarCrash, faFlagCheckered } from "@fortawesome/free-solid-svg-icons"
  import Icon from 'fa-svelte'
  import {link} from 'svelte-spa-router'

  import ROUTES from '../utils/routes'
</script>

<main>
  <section>
    <div>
      <p>I want to explore data about:</p>
      <a class="route" use:link={ROUTES.DNF}>Finishes and Failures <Icon icon={faCarCrash}/></a>
      <a class="route" use:link={ROUTES.QUALIFYING}>Qualifying vs Race Results <Icon icon={faFlagCheckered}/></a>
    </div>
  </section>
</main>

<style>
  main {
    min-height: calc(100vh - 71px - 150px);
  }

  .route {
    color: inherit;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    padding-left: 1em;
    padding-right: 1em;
    border: 1px solid black;
    text-decoration: none;
    border-radius: 5px;
  }
</style>
