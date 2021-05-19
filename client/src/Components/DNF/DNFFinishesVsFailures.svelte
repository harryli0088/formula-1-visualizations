<script lang="ts">
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
  import Icon from 'fa-svelte'

  import { statusIdMap } from "../../stores/data"
  import type { ResultType } from "../../utils/types"

  import BarChart from "../BarChart/BarChart.svelte"
  import Loading from "../Loading.svelte"
  import Popover from "../Popover.svelte"

  import processFinishVsFailureData from "./processFinishVsFailureData"

  export let didFinish: (status: string) => boolean = () => true
  export let colorFunction: (status: string) => string = () => "black"
  export let results: ResultType[] = []


  $: finishVsFailureBarChartData = processFinishVsFailureData(results, $statusIdMap, didFinish)

</script>

<main>
  <section>
    <h3>
      Race Finishes vs Failures
      <Popover content="This bar chart shows how many drivers did and did not finish their races.">
        <Icon icon={faQuestionCircle}/>
      </Popover>
    </h3>

    {#if results.length === 0}
      <Loading/>
    {:else}
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
</main>

<style>
  
</style>
