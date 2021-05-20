<script lang="ts">
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
  import Icon from 'fa-svelte'

  import { statusIdMap } from "../../stores/data"

  import type { ResultType } from "../../utils/types"
  import sum from "../../utils/sum";


  import BarChart from "../BarChart/BarChart.svelte"
  import Loading from "../Loading.svelte"
  import Popover from "../Popover.svelte"

  import processFinishVsFailureData from "./processFinishVsFailureData"

  export let colorFunction: (status: string) => string = () => "black"
  export let didFinish: (status: string) => boolean = () => true
  export let getHoverText: ( value: number, total: number, label: string, key: string, post: string ) => string = () => ""
  export let results: ResultType[] = []

  let width: number = 0
  $: rotated = width > 700

  $: data = processFinishVsFailureData(results, $statusIdMap, didFinish)

  let hover = {labelIndex: -1, keyIndex: -1}
  $: hoveredData = data[hover.labelIndex]
  $: hoverSum = sum(data.map(d => d.values).flat())
  $: hoverValue = hoveredData?.values[hover?.keyIndex]
  $: hoverText = (
    hoveredData
    ? getHoverText(hoverValue, hoverSum, "", hoveredData.keys[hover.keyIndex],"")
    : "Hover over the chart to see more!"
  )
</script>

<main bind:clientWidth={width}>
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
      bind:hover={hover}
      {colorFunction}
      {data}
      height={300}
      {rotated}
      stackedTitle="Stacked Together"
      xTitle="Finished vs Did Not Finish"
      yTitle="Number of Race Results"
    />

    <p>{hoverText}</p>
  {/if}
</main>

<style>
  
</style>
