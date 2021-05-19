<script lang="ts">
  import { results } from "../../stores/data"

  import DNFDistribution from "./DNFDistribution.svelte"
  import DNFFinishesVsFailures from "./DNFFinishesVsFailures.svelte"
  import DNFOverTime from "./DNFOverTime.svelte"

  const didFinish = (status: string) => status === "Finished" || status.indexOf("Lap") >= 0
  const colorFunction = (status: string) => {
    if(didFinish(status)) {
      return "green"
    }
    return "#E74C3C"
  }

  $: filteredResults = $results
</script>

<main>
  <DNFOverTime
    {colorFunction}
    {didFinish}
    results={filteredResults}
  />

  <DNFFinishesVsFailures
    {colorFunction}
    {didFinish}
    results={filteredResults}
  />
  
  <DNFDistribution
    {colorFunction}
    results={filteredResults}
  />
</main>

<style>
  
</style>
