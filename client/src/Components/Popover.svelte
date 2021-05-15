<script lang="ts">
  export let content: string = ""
  export let fullWidth: number = 400 //the full width of the popover if the screen is wide enough

  let innerWidth: number
  let popoverContainer 
  let show: boolean = true

  






  /**
   * Calculate the CSS positions for the popover
   * @param bounds      //output from getBoundingClientRect
   * @param fullWidth   //desired full width, if the screen is big enough
   * @param innerWidth  //current inner width of the screen
   */
  function getPositions(
    bounds: ClientRect,
    fullWidth: number,
    innerWidth: number = 0,
  ) {
    const fixedCenter = (bounds.right + bounds.left) / 2 //center of popover container, relative to the page, ie css position: fixed
    const fixedLeft = (fixedCenter - fullWidth / 2) //left position of popover container
    const fixedRight = (fixedCenter + fullWidth / 2) //right position of popover container
    const popoverContainerWidth = bounds.right - bounds.left //width of the popover container

    //calculate the initial left and right values
    const startingValue = popoverContainerWidth/2 - fullWidth/2
    let left = startingValue
    let right = startingValue

    let leftOffset = Math.max(0, -fixedLeft) //determine the left offset if the popover extends too far left off the page
    let rightOffset = Math.max(0, fixedRight - innerWidth) //determine the right offset if the popover extends too far right off the page

    left += leftOffset //move the left value by the offset
    right += rightOffset //move the left value by the offset
    if(innerWidth > fullWidth) { //if the page is big enough for the full width
      //move the left and right values accordingly
      left -= rightOffset
      right -= leftOffset
    }
    
    return { top: -15, left, right }
  }

  $: bounds = (
    innerWidth && popoverContainer //if the popover is mounted
    ? popoverContainer.getBoundingClientRect() //get the bounding client rectangle
    : { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0 } //else fake the client rect with zero values
  )

  $: (
    { top, left, right } = getPositions(bounds, fullWidth, innerWidth)
  )

</script>

<svelte:window bind:innerWidth={innerWidth}/>

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