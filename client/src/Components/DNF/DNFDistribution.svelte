<script lang="ts">
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
  import Icon from 'fa-svelte'

  import { statusIdMap } from "../../stores/data"

  import BarChart from "../BarChart/BarChart.svelte"
  import Loading from "../Loading.svelte"
  import Popover from "../Popover.svelte"

  import processStatusData from "./processStatusData"

  import type { ResultType } from "../../utils/types";

  export let colorFunction: (status: string) => string = () => "black"
  export let results: ResultType[] = []

  let hover = {labelIndex: -1, keyIndex: -1}
  let logChecked: boolean = false

  $: statusDistributionBarChartData = processStatusData(results, $statusIdMap)
</script>

<main>
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

  {#if results.length === 0}
    <Loading/>
  {:else}
    <BarChart
      bind:hover={hover}
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
</main>

<style>
  
</style>
