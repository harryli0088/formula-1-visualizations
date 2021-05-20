<script lang="ts">
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
  import Icon from 'fa-svelte'

  import { statusIdMap } from "../../stores/data"

  import BarChart from "../BarChart/BarChart.svelte"
  import Loading from "../Loading.svelte"
  import Popover from "../Popover.svelte"

  import processStatusData from "./processStatusData"

  import type { ResultType } from "../../utils/types";
  import sum from "../../utils/sum";

  export let colorFunction: (status: string) => string = () => "black"
  export let didFinish: (status: string) => boolean = () => true
  export let getHoverText: ( value: number, total: number, label: string, key: string, post: string ) => string = () => ""
  export let results: ResultType[] = []

  let logChecked: boolean = false

  $: data = processStatusData(results, $statusIdMap)

  let hover = {labelIndex: -1, keyIndex: -1}
  $: hoveredData = data[hover.labelIndex]
  $: hoverDidFinish = didFinish(hoveredData?.keys[hover.keyIndex] || "")
  $: hoverKey = hoveredData?.keys[hover.keyIndex]
  $: hoverSum = sum(data.map(d => d.values).flat())
  $: hoverValue = hoveredData?.values[hover?.keyIndex]
  $: hoverPost = (
    hoverKey==="Finished" ? "" : (
      hoverDidFinish 
      ? ` with ${hoverKey}`
      : ` for reason: ${hoverKey}`
    )
  )
  $: hoverText = (
    hoveredData
    ? getHoverText(hoverValue, hoverSum, "", hoverDidFinish ? "Finished" : "Did Not Finish", hoverPost)
    : "Hover over the chart to see more!"
  )
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
      {data}
      height={2000}
      rotated
      maxHeight={500}
      scale={logChecked ? "log" : ""}
      stackedTitle="Stacked Together"
      xTitle="Statuses"
      yTitle="Number of Races"
    />

    <p>{hoverText}</p>
  {/if}
</main>

<style>
  
</style>
