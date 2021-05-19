<script lang="ts">
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
  import Icon from 'fa-svelte'

  import BarChart from "../BarChart/BarChart.svelte"
  import Loading from "../Loading.svelte"
  import Popover from "../Popover.svelte"

  import processStackedOverTimeData from "./processStackedOverTimeData"

  import {
    raceIdMap,
    statusIdMap,
  } from "../../stores/data"
  import type { ResultType } from "../../utils/types"

  export let didFinish: (status: string) => boolean = () => true
  export let colorFunction: (status: string) => string = () => "black"
  export let results: ResultType[] = []

  $: stackedOverTimeBarChartData = processStackedOverTimeData(results, $raceIdMap, $statusIdMap, didFinish)
  const showLabel = (label: string) => parseInt(label) % 10 === 0
  const showLabelValue = (label: string, value: number, maxValue: number, minValue: number) => value===minValue || value===maxValue
</script>

<main>
  <section>
    <h3>
      Race Finishes vs Failures
      <Popover content="This bar chart shows how many drivers did and did not finish their races in each year.">
        <Icon icon={faQuestionCircle}/>
      </Popover>
    </h3>

    {#if results.length === 0}
      <Loading/>
    {:else}
      <BarChart
        {colorFunction}
        data={stackedOverTimeBarChartData}
        height={1000}
        showLabel={showLabel}
        showLabelValue={showLabelValue}
        stackedTitle="Stacked Together"
        xTitle="Finished vs Did Not Finish Over Time"
        yTitle="Number of Race Results"
      />
    {/if}

    <p>1989 was a crazy year, in which many drivers Did Not Qualify or Pre-Qualify for many races. Check out the <a href="https://en.wikipedia.org/wiki/1989_Formula_One_World_Championship#Results_and_standings" target="_blank" rel="noopener noreferrer">Wikiepdia article</a>.</p>
  </section>
</main>

<style>
  
</style>
