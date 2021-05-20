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
  import sum from "../../utils/sum"

  export let colorFunction: (status: string) => string = () => "black"
  export let didFinish: (status: string) => boolean = () => true
  export let getHoverText: ( value: number, total: number, label: string, key: string, post: string ) => string = () => ""
  export let noFilters: boolean = true
  export let results: ResultType[] = []


  $: data = processStackedOverTimeData(results, $raceIdMap, $statusIdMap, didFinish)

  $: showLabel = (labelIndex: number) => parseInt(data[labelIndex].label) % 10 === 0

  $: sums = data.map(d => sum(d.values)) //sum the values for each label
  $: (
    {minValue, showLabelValueAtIndex} = sums.reduce((acc, sum, i) => {
      acc.minValue = Math.min(acc.minValue || sum, sum) //find the minimum sum

      const prevValue = sums[i-1]
      const nextValue = sums[i+1]
      acc.showLabelValueAtIndex.push(sum>prevValue && sum>nextValue) //show the value label if it is a local maximum
      return acc
    }, {minValue: null, showLabelValueAtIndex: []})
  )
  $: showLabelValue = (labelIndex: number, value: number) => value===minValue || showLabelValueAtIndex[labelIndex]

  let hover = {labelIndex: -1, keyIndex: -1}
  $: hoveredData = data[hover?.labelIndex]
  $: hoverKey = hoveredData?.keys[hover.keyIndex]
  $: hoverSum = sum(hoveredData?.values || [])
  $: hoverValue = hoveredData?.values[hover?.keyIndex]
  $: hoverText = (
    hoveredData
    ? getHoverText(hoverValue, hoverSum, ` in ${hoveredData.label}`, hoverKey,"")
    : "Hover over the chart to see more!"
  )
</script>

<main>
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
      bind:hover={hover}
      {colorFunction}
      {data}
      height={1000}
      showLabel={showLabel}
      showLabelValue={showLabelValue}
      stackedTitle="Stacked Together"
      xTitle="Finished vs Did Not Finish Over Time"
      yTitle="Number of Race Results"
    />
  {/if}

  <p>{hoverText}</p>
  

  {#if noFilters}
    <p>1989 seems like a crazy year, in that drivers Did Not Finish for many races. Check out the <a href="https://en.wikipedia.org/wiki/1989_Formula_One_World_Championship#Results_and_standings" target="_blank" rel="noopener noreferrer">Wikiepdia article</a>.</p>
  {/if}
</main>

<style>
  
</style>
