<script lang="ts">
  import { faCarCrash, faFlagCheckered } from "@fortawesome/free-solid-svg-icons"
  import Icon from 'fa-svelte'
  import {link} from 'svelte-spa-router'

  import ROUTES from '../utils/routes'
</script>

<main>
  <section>
    <div>
      <h3>Explore data about:</h3>
  
      <div><a class="route" use:link={ROUTES.DNF}>Finishes vs Failures <Icon icon={faCarCrash}/></a></div>
      <div><a class="route" use:link={ROUTES.QUALIFYING}>Qualifying vs Race Results <Icon icon={faFlagCheckered}/></a></div>
    </div>
  </section>
</main>

<style>
  main {
    height: calc(100vh - 71px - 150px);
  }

  section {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
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
    display: inline-block;
    margin-bottom: 1em;
  }
</style>
