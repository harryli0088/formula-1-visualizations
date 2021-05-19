<script lang="ts">
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
  import Icon from 'fa-svelte'

  import BarChart from "../BarChart.svelte"
  import Loading from "../Loading.svelte"
  import Popover from "../Popover.svelte"

  import processStatusData from "./processStatusData"

  import {
    results,
    statusIdMap,
  } from "../../stores/data"

  let logChecked: boolean = true

  const colorFunction = (key: string) => {
    if(key === "Finished" || key.indexOf("Lap")>=0) {
      return "green"
    }
    return "#E74C3C"
  }

  $: filteredResults = $results

  $: statusBarChartData = processStatusData(filteredResults, $statusIdMap)
</script>

<main>
  <section>
    <h3>
      Distribution of Race Finishes (and Failures)
      <Popover content="This bar chart shows the distribution of race results in which drivers did and did not finish.">
        <Icon icon={faQuestionCircle}/>
      </Popover>
    </h3>

    <div>
      <div>
        Log Scale
        <input
          bind:checked={logChecked}
          type="checkbox"
        />

        <Popover content="Scaling the value by the logarithm is useful for seeing smaller values that are overwhelmed by the larger ones.">
          <Icon icon={faQuestionCircle}/>
        </Popover>
      </div>
    </div>

    {#if results.length === 0}
      <Loading/>
    {:else}
      <BarChart
        {colorFunction}
        data={statusBarChartData}
        height={2000}
        rotated
        scale={logChecked ? "log" : ""}
        stackedTitle="Stacked Together"
        xTitle="Statuses"
        yTitle="Number of Races"
      />
    {/if}
  </section>
</main>

<style>
  
</style>
