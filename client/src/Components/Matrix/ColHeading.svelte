<script lang="ts">
  export let formatColHeading: Function = () => {}
  export let data = {name: "", count: 0}
  export let defaultHighlight: boolean = false
  export let index: number = 0
  export let mouseover: Function = () => {}
  export let mouseoverColIndex: number = 0
  export let mouseoverRowIndex: number = 0
  export let normalOpacity: number = 1
  export let notHighlightedOpacity: number = 0
  export let onClickHandler: Function = () => {}
  export let rectWidth: number = 0
  export let textOffset: number = 0
  export let transition: string = ""
  export let verticalTextSize: number = 0
  export let xScale: Function = () => {}
  export let yTitleSize: number = 0

  $: formattedHeading = formatColHeading(data.name, data.count)
  $: fullName = data.name + " " + formattedHeading[1]
</script>

<g
  on:click={e => onClickHandler(e, -1, index)}
  on:mouseover={e => mouseover(e, -1, index)}

  style={`
    opacity: ${(index===mouseoverColIndex || (mouseoverRowIndex===-1&&mouseoverColIndex===-1&&defaultHighlight)) ? normalOpacity : notHighlightedOpacity};
    font-weight: ${(index===mouseoverColIndex) ? "bold" : "normal"};
    transform: translateX(${xScale(index)}px) rotate(-90deg);
    transition: ${transition};
    transition-property: transform;
  `}
>
  <text x={textOffset} y={rectWidth/2} dy="0.32em" text-anchor="start">
    <title>{fullName}</title>
    {formattedHeading[0]}
  </text>

  <text x={textOffset + verticalTextSize - 10 - yTitleSize} y={rectWidth/2} dy="0.32em" text-anchor="end">
    <title>{fullName}</title>
    {formattedHeading[1]}
  </text>
</g>

<style>

</style>