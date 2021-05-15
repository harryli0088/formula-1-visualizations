<script lang="ts">
  export let content: string = ""

  let popoverContainer 
  let show: boolean = true

  $: bounds = popoverContainer ? popoverContainer.getBoundingClientRect() : {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  }
  $: console.log(bounds)
  function getPositions(
    bounds: ClientRect,
    innerWidth: number,
  ) {
    const defaultWidth = 500
    let top = -15
    const popoverWidth = bounds.right - bounds.left
    let fixedCenter = (bounds.right + bounds.left) / 2
    let fixedLeft = (fixedCenter - defaultWidth / 2)
    let fixedRight = (fixedCenter + defaultWidth / 2)
    let left = popoverWidth/2 - defaultWidth/2
    let right = popoverWidth/2 - defaultWidth/2

    let leftOffset = Math.max(0, -fixedLeft)
    let rightOffset = Math.max(0, fixedRight - innerWidth)

    left += leftOffset
    right += rightOffset
    if(innerWidth > defaultWidth) {
      left -= rightOffset
      right -= leftOffset
    }
    

    return {
      top,
      left,
      right
    }
  }

  $: (
    {
      top,
      left,
      right
    } = getPositions(bounds, window.innerWidth)
  )

</script>

<span
  bind:this={popoverContainer}
  class="popover-container"
  on:click={() => show = !show}
  on:mouseover={() => show = true}
  on:mouseleave={() => show = false}
>
  <slot/>

  {#if show}
    <div class="popover" style={`top: ${top}px; left: ${left}px; right: ${right}px;`}>{content}</div>
  {/if}
</span>

<style>
  .popover-container {
    position: relative;
    display: inline-block;
  }

  .popover {
    position: absolute;
    transform: translateY(-100%);
    background: rgba(0,0,0,0.8);
    padding: 1em;
    border-radius: 5px;
    color: white;
    font-weight: normal;
    font-size: small;
  }
</style>