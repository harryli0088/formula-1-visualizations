<script lang="ts">
  import { scaleBand, scaleLinear } from 'd3'

  import sum from "../../utils/sum"
  import type { BarChartDataType } from './types';

  export let colorFunction: (key: string) => string = () => "black"
  export let data: BarChartDataType[] = []
  export let font:string = "16px Arial"
  export let height: number = 500
  export let keyHoverIndex: number = -1
  export let rotated: boolean = false
  export let scale: "log" | "" = ""
  export let stackedTitle: string = ""
  export let xTitle: string = ""
  export let yTitle: string = ""

  //constants
  const ctx = document.createElement('canvas').getContext("2d")
  $: ctx.font = font
  const gap = 50
  const stackedBarsWidth = 25
  const textHeight = 20

  function setKeyHoverIndex(index: number) {
    keyHoverIndex = index
  }

  //scaling
  $: valueScale = scale==="log" ? (value: number) => Math.log(value + 1) : (value: number) => value
  $: scaledData = data.map(d => {
    const values = d.values.map(valueScale), //used for scale caluculations
    const displayValues = d.values //used to display the label
    return {
      ...d, 
      values,
      valuesSum: sum(values),
      displayValues,
      displayValuesSum: sum(displayValues),
    }
  })

  //data calculations
  $: labels = scaledData.map(d => d.label)
  $: longestKey = labels.reduce( (acc, k) => acc.length > k.length ? acc : k, "" )
  $: valuesSums = scaledData.map(d => d.valuesSum)
  $: maxDisplayValue = Math.max(...scaledData.map(d => d.displayValuesSum))
  $: maxValue = Math.max(...valuesSums)
  $: totalValuesSum = valuesSums.reduce((acc, v) => acc + v, 0)

  //pixel calculations
  let width = 500
  $: rotatedHeight = rotated ? width: height
  $: rotatedWidth = rotated ? height: width

  $: paddingBottom = (
    (rotated ? ctx.measureText(longestKey).width + 10 : textHeight)
    + (xTitle ? textHeight : 0)
  )
  $: paddingLeft = (stackedTitle ? textHeight : 0)
  $: paddingTop = (rotated ? ctx.measureText(maxDisplayValue.toString()).width + 10 : textHeight)

  $: effectiveBottom = rotatedHeight - paddingBottom
  $: chartLeftOffset = stackedBarsWidth + gap + paddingLeft
  $: xScale = scaleBand().domain(labels).range([chartLeftOffset, rotatedWidth])
  $: yScale = scaleLinear().domain([0, maxValue]).range([effectiveBottom, paddingTop])
  $: stackedScale = scaleLinear().domain([0, totalValuesSum || 0]).range([effectiveBottom, paddingTop]) //need to log scale this

  $: barBandWidth = xScale.bandwidth()

  $: stackedData = scaledData.map(d => ({ ...d, lastSum: 0 }))
  $: scaledData.reduce((acc, d, i) => { //calculate last sums
    stackedData[i].lastSum = acc
    acc += d.valuesSum
    return acc
  }, 0)

  $: extendedData = scaledData.map(d => ({
    ...d,
    height: yScale(0) - yScale(d.valuesSum),
    width: barBandWidth,
    x: xScale(d.label),
    y: yScale(d.valuesSum),
  }))
</script>

<main>
  <div bind:clientWidth={width} style={`height: ${height}px`}>
    <svg 
      height={rotatedHeight}
      style={`margin-top: ${(rotatedWidth - width)/2}px; margin-left: ${Math.min((width - rotatedWidth)/2, 0)}px; transform: rotate(${rotated?"90":"0"}deg)`}
      width={rotatedWidth}
    >
      <g>
        {#each stackedData as d, i}
          <rect
            fill={colorFunction(d.label)}
            height={stackedScale(totalValuesSum - d.valuesSum) - stackedScale(totalValuesSum)}
            on:mouseover={e => setKeyHoverIndex(i)}
            on:mouseout={e => setKeyHoverIndex(-1)}
            opacity={keyHoverIndex===i || keyHoverIndex===-1 ? 1 : 0.5}
            width={stackedBarsWidth}
            x={paddingLeft}
            y={stackedScale(d.valuesSum + d.lastSum)}
          />
        {/each}
      </g>
      <g>
        {#each extendedData as d, i}
          <rect 
            fill={colorFunction(d.label)}
            height={d.height}
            on:mouseover={e => setKeyHoverIndex(i)}
            on:mouseout={e => setKeyHoverIndex(-1)}
            opacity={keyHoverIndex===i || keyHoverIndex===-1 ? 1 : 0.5}
            width={d.width} 
            x={d.x} 
            y={d.y} 
          />
          <text
            class="key-label"
            dy={rotated ? "0.5em" : "1em"}
            fill={d.valuesSum > 0 ? "" : "#bbb"}
            text-anchor={rotated ? "end" : "middle"}
            transform={`
              translate(${d.x + barBandWidth/2 + (rotated ? -2 : 0)},${effectiveBottom + (rotated ? 1 : 0)})
              rotate(${rotated?"-90":"0"})
            `}
            x={0}
            y={0}
          >{d.label}</text>

          {#if d.valuesSum > 0}
            <text
              class="value-label"
              text-anchor={rotated ? "start" : "middle"}
              dy={rotated ? "0.35em" : 0}
              transform={`
                translate(${d.x + barBandWidth/2},${d.y - 2})
                rotate(${rotated?"-90":"0"})
              `}
              x={0}
              y={0}
            >{d.displayValuesSum}</text>
          {/if}
        {/each}
      </g>
  
      <text text-anchor="middle" x={0} y={0} transform={`translate(${(chartLeftOffset + (rotatedWidth-chartLeftOffset)/2)},${rotatedHeight - (rotated?18:0)}) rotate(${rotated?"180":"0"})`}>{xTitle}</text>
      <text text-anchor="middle" x={0} y={0} transform={`translate(0,${effectiveBottom/2}) rotate(-90)`} dy={chartLeftOffset - 3}>{yTitle}</text>
      <text text-anchor="middle" x={0} y={0} transform={`translate(0,${effectiveBottom/2}) rotate(-90)`} dy={paddingLeft - 3}>{stackedTitle}</text>
    </svg>
  </div>
</main>

<style>
	main {
		text-align: center;
	}

  rect {
    stroke: white;
    stroke-width: 1px;
    transition: 0.25s;
  }

  text {
    transition: 0.25s;
  }

  .key-label {
    font-size: 14px;
  }

  .value-label {
    font-size: 12px;
  }
</style>