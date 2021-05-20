<script lang="ts">
  import arrayToObjectMap from "../../utils/arrayToObjectMap"
  import type { CircuitType } from '../../utils/types'
  import getCircuitName from "../../utils/getCircuitName"
  import getNearbyRaces from "../../utils/getNearbyRaces"

  import TypeaheadFilters from "./TypeaheadFilters.svelte"

  import {
    circuits,
    races,
  } from "../../stores/data"

  $: circuitIdMap = arrayToObjectMap($circuits, "circuitId")


  export let circuitFilter: CircuitType | null = null
  const setCircuitFilter = (circuit: CircuitType | null) => circuitFilter = circuit
  $: circuitFilterButtons = getNearbyRaces($races).map(r => getCircuitName(circuitIdMap[r.circuitId])) //map the race circuit ids to the circuits

</script>

<TypeaheadFilters
  data={$circuits}
  extract={getCircuitName}
  filterButtons={circuitFilterButtons}
  label="Filter by Circuit"
  setFilter={setCircuitFilter}
/>
