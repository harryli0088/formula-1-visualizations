<script lang="ts">
  import { latestRaceText, raceIdMap, results, statusIdMap } from "../../stores/data"

  import CircuitsFilter from "../Filters/CircuitsFilter.svelte"
  import DriverFilter from "../Filters/DriverFilter.svelte"

  import DNFDistribution from "./DNFDistribution.svelte"
  import DNFFinishesVsFailures from "./DNFFinishesVsFailures.svelte"
  import DNFOverTime from "./DNFOverTime.svelte"

  import type { CircuitType, DriverType } from "../../utils/types"
  import isMatchingCircuit from "../../utils/isMatchingCircuit"
  import isMatchingDriver from "../../utils/isMatchingDriver"

  const didFinish = (status: string) => status === "Finished" || status.indexOf("Lap") >= 0
  const colorFunction = (status: string) => {
    if(didFinish(status)) {
      return "green"
    }
    return "#E74C3C"
  }

  let circuitFilter: CircuitType | null = null
  let didFinishFilter = null
  let driverFilter: DriverType | null = null

  $: filteredResults = $results.filter(r => (
    (didFinishFilter===null || didFinish(didFinishFilter)===didFinish($statusIdMap[r.statusId]?.status || ""))
    && isMatchingCircuit(circuitFilter, $raceIdMap[r.raceId]?.circuitId)
    && isMatchingDriver(driverFilter, r.driverId)
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
        <span class="radio-filter" style="background-color: gray"><input id="all" type="radio" bind:group={didFinishFilter} value={null}/> <label for="all">All Results</label></span>
        <span class="radio-filter" style="background-color: green"><input id="Finished" type="radio" bind:group={didFinishFilter} value="Finished"/> <label for="Finished">Only Finished Results</label></span>
        <span class="radio-filter" style="background-color: #E74C3C"><input id="DNF" type="radio" bind:group={didFinishFilter} value="DNF"/> <label for="DNF">Only Did Not Finished Results</label></span>
      </div>
    </div>

    <br/>

    <CircuitsFilter bind:circuitFilter={circuitFilter}/>
    <DriverFilter bind:driverFilter={driverFilter}/>

    <hr/>

    <DNFOverTime
      {colorFunction}
      {didFinish}
      results={filteredResults}
    />

    <hr/>

    <DNFFinishesVsFailures
      {colorFunction}
      {didFinish}
      results={filteredResults}
    />

    <hr/>
    
    <DNFDistribution
      {colorFunction}
      results={filteredResults}
    />
  </section>
</main>

<style>
  .radio-filter {
    cursor: pointer;
    margin-right: 1.5em;
    padding: 0.5em;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    color: white;
    font-weight: bold;
    border-radius: 3px;
    transition: 0.5s;
    display: inline-block;
  }
  .radio-filter:hover {
    transform: scale(1.05);
  }
  .radio-filter:active {
    transform: scale(1);
  }

  .radio-filter label {
    cursor: pointer;
    display: inline-block;
  }
  .radio-filter input {
    cursor: pointer;
    margin-bottom: 0;
  }
</style>
