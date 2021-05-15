<script lang="ts">
  export let content: string = "" //string content of the popover
  export let fullWidth: number = 400 //the full width of the popover if the screen is wide enough

  let innerWidth: number //bound to the svelte window for responsiveness
  let popoverContainer //bound to the popover container element
  let show: boolean = false //controls whether or not to show the popover

  /**
   * Calculate the CSS positions for the popover
   * @param bounds      //output from getBoundingClientRect
   * @param fullWidth   //desired full width, if the screen is big enough
   * @param innerWidth  //current inner width of the screen
   */
  function getCssAbsolutePositions(
    bounds: ClientRect,
    fullWidth: number,
    innerWidth: number = 0,
  ) {
    const halfWidth = fullWidth / 2
    const fixedCenter = (bounds.right + bounds.left) / 2 //center of popover container, relative to the page, ie css position: fixed
    const fixedLeft = (fixedCenter - halfWidth) //left position of popover container
    const fixedRight = (fixedCenter + halfWidth) //right position of popover container
    const popoverContainerWidth = bounds.right - bounds.left //width of the popover container

    //Calculate the initial left and right values.
    //Ideally if the screen is big enough, and the popover does not extend off the page,
    //these values will not need to change.
    const idealStartingValues = popoverContainerWidth/2 - halfWidth
    let left = idealStartingValues
    let right = idealStartingValues

    //These offset values are used in case the popover extends too far off the page left or right.
    //If the popover does not extend off the page on a side, its respective offset will be zero. 
    let leftOffset = Math.max(0, -fixedLeft) //determine the left offset if the popover extends too far left off the page
    let rightOffset = Math.max(0, fixedRight - innerWidth) //determine the right offset if the popover extends too far right off the page

    //In case the popover extends off the page
    left += leftOffset //move the left value by the offset
    right += rightOffset //move the left value by the offset

    if(innerWidth > fullWidth) { //if the page is big enough for the full width
      //move the left and right values accordingly to take up the full width
      left -= rightOffset
      right -= leftOffset
    }
    
    return { top: -15, left, right }
  }

  $: bounds = (
    innerWidth && popoverContainer //if the popover is mounted, include inner width to make it responsive
    ? popoverContainer.getBoundingClientRect() //get the bounding client rectangle
    : { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0 } //else fake the client rect with zero values
  )

  //calculate the css positions for the popover
  $: ({ top, left, right } = getCssAbsolutePositions(bounds, fullWidth, innerWidth))
</script>

<svelte:window bind:innerWidth={innerWidth}/>

<span
  bind:this={popoverContainer}
  class="popover-container"
  on:click={() => show = !show}
  on:mouseover={() => show = true}
  on:mouseleave={() => show = false}
  style="--theme-color: rgba(0,0,0,0.9)"
>
  <slot/>

  {#if show}
    <div class="popover" style={`top: ${top}px; left: ${left}px; right: ${right}px;`}>{content}</div>
    <div class="arrow-down" style={`top: ${top}px;`}/>
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
    background: var(--theme-color);
    padding: 1em;
    border-radius: 5px;
    color: white;
    font-weight: normal;
    font-size: 14px;
  }

  .arrow-down {
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    
    border-top: 5px solid var(--theme-color);

    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
</style>