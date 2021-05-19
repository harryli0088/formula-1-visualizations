<script lang="ts">
  import { latestRaceText, results, statusIdMap } from "../../stores/data"

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

  let didFinishFilter = "all"

  $: filteredResults = $results.filter(r => (
    (didFinishFilter==="all" || didFinish(didFinishFilter)===didFinish($statusIdMap[r.statusId]?.status || ""))
  ))
</script>

<main>
  <header>
    <div class="img-container">
      <img src="bottas-russel-crash.jpeg" alt="redbull"/>
      <p>Photo from <a href="https://www.planetf1.com/news/valtteri-bottas-agreement-imola-crash/" target="_blank" rel="noopener noreferrer">planetf1</a></p>
    </div>
    <div class="heading-text">
      <h1>Why do drivers not finish their races?</h1>
    </div>
  </header>

  <section>
    <p>During Formula 1 races, not every driver actually finishes the race. Accidents are the most obvious reason, but often the cars break down or the driver simply didn't qualify. How often do drivers not finish? Why do they not finish? Explore the visualizations below! {$latestRaceText}</p>

    <div>
      <div class="radio-fitlers">
        <span><b>Show:</b></span>
        <span class="radio-filter"><label for="all">All Results</label> <input id="all" type="radio" bind:group={didFinishFilter} value="all"/></span>
        <span class="radio-filter"><label for="Finished">Only Finished Results</label> <input id="Finished" type="radio" bind:group={didFinishFilter} value="Finished"/></span>
        <span class="radio-filter"><label for="DNF">Only Did Not Finished Results</label> <input id="DNF" type="radio" bind:group={didFinishFilter} value="DNF"/></span>
      </div>
    </div>

    <hr/>
  </section>

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
  .radio-filter {
    cursor: pointer;
    margin-right: 1.5em;
  }
  .radio-filter label {
    cursor: pointer;
    display: inline-block;
  }
  .radio-filter input {
    cursor: pointer;
    margin-left: 0.25em;
    margin-bottom: 0;
  }
</style>
