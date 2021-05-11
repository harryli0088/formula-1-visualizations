<script lang="ts">
  import { scaleBand, scaleLinear } from 'd3'
import App from '../App.svelte';

  type BarChartDataType = {
    key: string,
    value: number,
  }

  export let colorFunction: (value: any) => string = () => "black"
  export let data: BarChartDataType[] = []
  export let height: number = 500
  export let keyHoverIndex: number = -1
  export let margin: {bottom: number, left: number, right:number, top: number} = {bottom: 40, left: 20, right:0, top: 0}
  export let rotated: boolean = false
  export let stackedTitle: string = ""
  export let width = 500
  export let xTitle: string = ""
  export let yTitle: string = ""

  function setKeyHoverIndex(index: number) {
    keyHoverIndex = index
  }
  
  let stackedBarsWidth = 25
  let gap = 50
  $: chartLeftOffset = stackedBarsWidth + gap + margin.left

  $: effectiveHeight = height - margin.bottom
  $: keys = data.map(d => d.key)
  $: values = data.map(d => d.value)
  $: maxValue = Math.max(...values)
  $: sum = values.reduce((acc, v) => acc + v, 0)
  $: xScale = scaleBand().domain(keys).range([chartLeftOffset, width])
  $: yScale = scaleLinear().domain([0, maxValue]).range([effectiveHeight, 0])
  $: stackedScale = scaleLinear().domain([0, sum || 0]).range([effectiveHeight, 0])

  $: barBandWidth = xScale.bandwidth()

  $: stackedData = data.map(d => ({ ...d, lastValue: 0 }))
  $: data.reduce((acc, d, i) => {
    stackedData[i].lastValue = acc
    acc += d.value
    return acc
  }, 0)

  $: extendedData = data.map(d => ({
    ...d,
    height: yScale(0) - yScale(d.value),
    width: barBandWidth,
    x: xScale(d.key),
    y: yScale(d.value),
  }))
</script>

<main>
  <svg {height} {width} style={`transform: rotate(${rotated?"90":"0"}deg)`}>
    <g>
      {#each stackedData as d, i}
        <rect
          fill={colorFunction(d.key)}
          height={stackedScale(sum - d.value)}
          on:mouseover={e => setKeyHoverIndex(i)}
          on:mouseout={e => setKeyHoverIndex(-1)}
          opacity={keyHoverIndex===i || keyHoverIndex===-1 ? 1 : 0.5}
          width={stackedBarsWidth}
          x={margin.left}
          y={stackedScale(d.value + d.lastValue)}
        />
      {/each}
    </g>
    <g>
      {#each extendedData as d, i}
        <rect 
          fill={colorFunction(d.key)}
          height={d.height}
          on:mouseover={e => setKeyHoverIndex(i)}
          on:mouseout={e => setKeyHoverIndex(-1)}
          opacity={keyHoverIndex===i || keyHoverIndex===-1 ? 1 : 0.5}
          width={d.width} 
          x={d.x} 
          y={d.y} 
        />
        <text
          class="position-label"
          dy="1em"
          text-anchor={rotated ? "end" : "middle"}
          transform={`
            translate(${d.x + (rotated ? 0 : barBandWidth/2)},${effectiveHeight + (rotated ? 1 : 0)})
            rotate(${rotated?"-90":"0"})
          `}
          x={0}
          y={0}
        >{d.key}</text>
      {/each}
    </g>

    <text text-anchor="middle" x={0} y={0} transform={`translate(${width/2},${height - (rotated?18:0)}) rotate(${rotated?"180":"0"})`}>{xTitle}</text>
    <text text-anchor="middle" x={0} y={0} transform={`translate(0,${effectiveHeight/2}) rotate(-90)`} dy={chartLeftOffset - 3}>{yTitle}</text>
    <text text-anchor="middle" x={0} y={0} transform={`translate(0,${effectiveHeight/2}) rotate(-90)`} dy={margin.left - 3}>{stackedTitle}</text>
  </svg>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

  rect {
    stroke: white;
    stroke-width: 1px;
    transition: 0.25s;
  }

  .position-label {
    font-size: 0.5em;
  }
</style>