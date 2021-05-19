<script lang="ts">
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
  import Icon from 'fa-svelte'

  import BarChart from "../BarChart/BarChart.svelte"
  import Loading from "../Loading.svelte"
  import Popover from "../Popover.svelte"

  import processFinishVsFailureData from "./processFinishVsFailureData";
  import processStatusData from "./processStatusData"

  import {
    results,
    statusIdMap,
  } from "../../stores/data"

  let logChecked: boolean = false

  const didFinish = (status: string) => status === "Finished" || status.indexOf("Lap") >= 0
  const colorFunction = (status: string) => {
    if(didFinish(status)) {
      return "green"
    }
    return "#E74C3C"
  }

  $: filteredResults = $results

  $: finishVsFailureBarChartData = processFinishVsFailureData(filteredResults, $statusIdMap, didFinish)

  $: statusDistributionBarChartData = processStatusData(filteredResults, $statusIdMap)

  const fakeStackedData = [
    {keys: ["Finished", "DNF"], label: "2018", values: [20, 30]},
    {keys: ["Finished", "DNF"], label: "2019", values: [15, 25]},
    {keys: ["Finished", "DNF"], label: "2020", values: [43, 17]},
  ]
</script>

<main>
  <section>
    <h3>
      Race Finishes vs Failures
      <Popover content="This bar chart shows how many drivers did and did not finish their races.">
        <Icon icon={faQuestionCircle}/>
      </Popover>
    </h3>

    {#if $results.length === 0}
      <Loading/>
    {:else}
      <BarChart
        {colorFunction}
        data={fakeStackedData}
        height={500}
        rotated
        stackedTitle="Stacked Together"
        xTitle="Finished vs Did Not Finish"
        yTitle="Number of Race Results"
      />
      <BarChart
        {colorFunction}
        data={finishVsFailureBarChartData}
        height={500}
        rotated
        stackedTitle="Stacked Together"
        xTitle="Finished vs Did Not Finish"
        yTitle="Number of Race Results"
      />
    {/if}
  </section>
  <section>
    <h3>
      Distribution of Race Finishes and Failures
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

    {#if $results.length === 0}
      <Loading/>
    {:else}
      <BarChart
        {colorFunction}
        data={statusDistributionBarChartData}
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
