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

  import formatPercent from "../../utils/formatPercent";
  import type { ResultType } from "../../utils/types"
  import sum from "../../utils/sum";

  export let didFinish: (status: string) => boolean = () => true
  export let colorFunction: (status: string) => string = () => "black"
  export let results: ResultType[] = []

  let hover = {labelIndex: -1, keyIndex: -1}

  $: data = processStackedOverTimeData(results, $raceIdMap, $statusIdMap, didFinish)

  $: hoveredData = data[hover?.labelIndex]
  $: hoverSum = sum(hoveredData?.values || [])
  $: hoverValue = hoveredData?.values[hover?.keyIndex]

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

    <p>
      {#if hoveredData}
        Out of {hoverSum} race results in {hoveredData.label}, there were {hoverValue} ({formatPercent(hoverValue/hoverSum)}) instances in which drivers {hoveredData.keys[hover.keyIndex]} their races.
      {:else}
        Hover over the chart to see more!
      {/if}
    </p>
    

    <p>1989 was a crazy year, in which drivers Did Not Finish for many races. Check out the <a href="https://en.wikipedia.org/wiki/1989_Formula_One_World_Championship#Results_and_standings" target="_blank" rel="noopener noreferrer">Wikiepdia article</a>.</p>
  </section>
</main>

<style>
  
</style>
