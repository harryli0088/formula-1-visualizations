<script lang="ts">
  import Typeahead from "svelte-typeahead"
  import Icon from 'fa-svelte'
  import { faTimes } from '@fortawesome/free-solid-svg-icons'

  export let data: T[] = []
  export let extract: (dataPoint: T) => string = () => ""
  export let filterButtons: string[] = []
  export let label: string = "Filter"
  export let setFilter: (dataPoint:T | null) => void = () => {}

  let inputValue: string = ""
  
  function setLocalFilter(dataPoint: T | null) {
    if(dataPoint) {
      setFilter(dataPoint)
      inputValue = extract(dataPoint)
    }
    else {
      setFilter(null)
      inputValue = ""
    }
  }

  $: dataForFilterButtons = (
    ():T[] => {
      const unordered = data.filter( //get the target drivers in an unordered array
        d => filterButtons.includes(extract(d))
      )
      return filterButtons.map(
        name => unordered.find(d => name===extract(d)) //order the drivers
      ).filter(d => d) //filter out any missing drivers
    }
  )()
</script>

<main class="typeahead-filters">
  <Typeahead
    bind:value={inputValue}
    {data}
    {extract}
    {label}
    limit={5}
    on:select={e => setLocalFilter(e.detail.original)}
    on:clear={() => setLocalFilter(null)}
  />

  <div class="filter-buttons-container">
    {#each dataForFilterButtons as d}
      <button class="filter-button" on:click={() => setLocalFilter(d)}>{extract(d)}</button>
    {/each}

    {#if inputValue}
      <span class="clear-filter-button" on:click={() => setLocalFilter(null)}>
        <Icon icon={faTimes}/>
      </span>
    {/if}
  </div>
</main>

<style>
  .typeahead-filters {
    display: flex;
    flex-wrap: wrap;
  }

  :global(.typeahead-filters [data-svelte-search]) {
    margin-right: 1em;
  }

  :global(.typeahead-filters [data-svelte-search] input) {
    width: 300px;
    display: block;
    border-radius: 3px;
  }

  @media only screen and (max-width: 600px) {
    .typeahead-filters {
      display: block;
    }

    :global(.typeahead-filters [data-svelte-search] input) {
      width: 100%;
    }
  }

  .filter-buttons-container {
    margin-top: 1.5em;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
  }

  .filter-button {
    margin-right: 0.5em;
    background-color: transparent;
    border-radius: 3px;
    border: 1px solid gray;
    color: #555;
  }

  .clear-filter-button {
    cursor: pointer;
    transition: 0.5s;
  }
  .clear-filter-button:hover {
    transform: scale(1.2);
  }
</style>
