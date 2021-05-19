<script lang="ts">
  import { scaleBand, scaleLinear } from 'd3'

  import sum from "../../utils/sum"
  import type {
    BarChartDataType,
    ExtendedBarChartDataType,
    RectDataType,
    ScaledBarChartDataType,
    StackDataType
  } from './types';

  export let colorFunction: (key: string) => string = () => "black"
  export let data: BarChartDataType[] = []
  export let font:string = "16px Arial"
  export let height: number = 500
  export let hover: {labelIndex: number, keyIndex: number} = {labelIndex: -1, keyIndex: -1}
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

  function setHover(labelIndex: number, keyIndex: number) {
    hover = {labelIndex, keyIndex}
  }

  //scaling
  $: valueScale = scale==="log" ? (value: number) => Math.log(value + 1) : (value: number) => value
  $: scaledData = data.map((d): ScaledBarChartDataType => {
    const displayValues = d.values //used to display the label
    const values = d.values.map(valueScale) //scale the values

    //calculate last sums to determine where to draw values as rects
    //for an index i, lastSum[i] is the sum of all previous values, values[0] to values[i-1]
    const lastSums: number[] = [] //initialize an empty array
    values.reduce((lastSum, v) => { //reduce the values
      lastSums.push(lastSum) //push the last sum
      return lastSum + v //return the next sum
    }, 0)

    return {
      ...d,
      displayValues,
      labelDisplayValue: sum(displayValues), //the sum of all display values for this one label
      labelValue: sum(values), //the sum of all the values for this one label
      lastSums,
      values,
    }
  })

  //data calculations
  $: labels = scaledData.map(d => d.label)
  $: longestLabel = labels.reduce( (acc, k) => acc.length > k.length ? acc : k, "" )
  $: labelValues = scaledData.map(d => d.labelValue) //array of all labelValues
  $: maxDisplayValue = Math.max(...scaledData.map(d => d.labelDisplayValue))
  $: maxValue = Math.max(...labelValues)
  $: totalSum = labelValues.reduce((acc, v) => acc + v, 0) //total sum of all the values

  //pixel calculations
  let width = 500
  $: rotatedHeight = rotated ? width: height
  $: rotatedWidth = rotated ? height: width

  $: paddingBottom = (
    (rotated ? ctx.measureText(longestLabel).width + 10 : textHeight)
    + (xTitle ? textHeight : 0)
  )
  $: paddingLeft = (stackedTitle ? textHeight : 0)
  $: paddingTop = (rotated ? ctx.measureText(maxDisplayValue.toString()).width + 10 : textHeight)

  $: effectiveBottom = rotatedHeight - paddingBottom
  $: chartLeftOffset = stackedBarsWidth + gap + paddingLeft
  $: xScale = scaleBand().domain(labels).range([chartLeftOffset, rotatedWidth])
  $: yScale = scaleLinear().domain([0, maxValue]).range([effectiveBottom, paddingTop])
  $: stackedScale = scaleLinear().domain([0, totalSum || 0]).range([effectiveBottom, paddingTop])

  $: barBandWidth = xScale.bandwidth()

  $: stackedData = scaledData.map( //iterate over all the labels
    (d,i) => d.values.map( //iterate over all the values
      (v,j): StackDataType => ({ //return a new object with all the necessary data for the stack
        label: d.label,
        labelIndex: i,
        key: d.keys[j],
        keyIndex: j,
        value: v,
        lastSum: 0, //to be calculated later
      })
    )
  ).flat().sort((a,b) => b.value - a.value) //flatten and sort the values
  $: stackedData.reduce((acc, d) => { //calculate last sums after flattening
    d.lastSum = acc
    acc += d.value
    return acc
  }, 0)

  $: extendedData = scaledData.map((d):ExtendedBarChartDataType => {
    //calculate all the pixel data for each value
    const pixelValues:RectDataType[] = d.values.map((v, i) => {
      const lastSum = d.lastSums[i] //get the last sum

      return {
        height: yScale(0) - yScale(v),
        width: barBandWidth,
        x: xScale(d.label),
        y: yScale(v + lastSum),
      }
    })

    return {
      ...d,
      pixelValues,

      //calculate overall pixel values for labels
      height: yScale(0) - yScale(d.labelValue),
      width: barBandWidth,
      x: xScale(d.label),
      y: yScale(d.labelValue),
    }
  })
</script>

<main>
  <div bind:clientWidth={width} style={`height: ${height}px`}>
    <svg 
      height={rotatedHeight}
      style={`margin-top: ${(rotatedWidth - width)/2}px; margin-left: ${Math.min((width - rotatedWidth)/2, 0)}px; transform: rotate(${rotated?"90":"0"}deg)`}
      width={rotatedWidth}
    >
      <g>
        {#each stackedData as d}
          <rect
            fill={colorFunction(d.key)}
            height={stackedScale(totalSum - d.value) - stackedScale(totalSum)}
            on:mouseover={e => setHover(d.labelIndex, d.keyIndex)}
            on:mouseout={e => setHover(-1, -1)}
            opacity={(
              (hover.labelIndex===d.labelIndex && hover.keyIndex===d.keyIndex) || hover.labelIndex===-1
              ? 1 : 0.5
            )}
            width={stackedBarsWidth}
            x={paddingLeft}
            y={stackedScale(d.value + d.lastSum)}
          />
        {/each}
      </g>
      <g>
        {#each extendedData as d, i}
          {#each d.pixelValues as p, j}
            <rect 
              fill={colorFunction(d.keys[j])}
              height={p.height}
              on:mouseover={e => setHover(i,j)}
              on:mouseout={e => setHover(-1,-1)}
              opacity={(
                (hover.labelIndex===i && hover.keyIndex===j) || hover.labelIndex===-1 
                ? 1 : 0.5
              )}
              width={p.width} 
              x={p.x} 
              y={p.y} 
            />
          {/each}
          <text
            class="key-label"
            dy={rotated ? "0.5em" : "1em"}
            fill={d.labelValue > 0 ? "" : "#bbb"}
            text-anchor={rotated ? "end" : "middle"}
            transform={`
              translate(${d.x + barBandWidth/2 + (rotated ? -2 : 0)},${effectiveBottom + (rotated ? 1 : 0)})
              rotate(${rotated?"-90":"0"})
            `}
            x={0}
            y={0}
          >{d.label}</text>

          {#if d.labelValue > 0}
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
            >{d.labelDisplayValue}</text>
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