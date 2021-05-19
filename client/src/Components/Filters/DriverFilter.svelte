<script lang="ts">
  import type { DriverType } from '../../utils/types'
  import getFullDriverName from '../../utils/getFullDriverName';

  import TypeaheadFilters from "../Filters/TypeaheadFilters.svelte"

  import { drivers } from "../../stores/data"

  export let driverFilter: DriverType | null = null

  const setDriverFilter = (driver: DriverType | null) => driverFilter = driver
</script>

<TypeaheadFilters
  data={$drivers}
  extract={getFullDriverName}
  filterButtons={[
    "Lewis Hamilton", "Max Verstappen", "Valtteri Bottas", "Lando Norris", "Charles Leclerc"
  ]}
  label="Filter by Driver"
  setFilter={setDriverFilter}
/>