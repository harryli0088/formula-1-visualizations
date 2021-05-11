<script lang="ts">
  import type { QualifyingType, ResultType } from '../../utils/types'
  import QualToResBarChart from './QualToResBarChart.svelte'
  import QualToResMatrix from './QualToResMatrix.svelte'


  export let possiblePositions: string[] = []
  export let qualifying: QualifyingType[] = []
  export let results: ResultType[] = []

  $: defaultDistributionMap = possiblePositions.reduce((acc, p) => {
    acc[p] = 0
    return acc
  }, {})

  //2d array of qualifyings, where each row is all the qualifyings corresponding to its respective position
  //qualifyingsForPositions[qualifyingIndex] = [qualifyings for the given qualifyingIndex]
  $: qualifyingsForPositions = possiblePositions.map(p => qualifying.filter(q => q.position === p))

  //2d array of results, where each cell is the respective result of the originating qualifying
  //resultsForQualifyings[qualifyingIndex] = [results for the given qualifyingIndex]
  $: resultsForQualifyings = qualifyingsForPositions.map(
    qRow => qRow.map(
      q => results.find(
        r => (
          q.raceId === r.raceId
          && q.driverId === r.driverId
        )
      )
    )
  )

  //array of distribution maps that sum the results for the given qualifying
  //distributionMaps[qualifyingIndex] = for the given qualifyingIndex, a key-value object { [position]: number of results that ended in this position  }
  $: distributionMaps = resultsForQualifyings.map(
    filteredResults => filteredResults.reduce((acc, r) => {
      if(acc[r.position] === undefined) { //if this is an unexpected position
        console.warn(`Encountered unexpected position ${r.position}`)
      }
      else {
        acc[r.position]++ //increment the count for this position
      }

      return acc
    }, JSON.parse(JSON.stringify(defaultDistributionMap)))
  )
</script>

<main>
	<div>
    <QualToResBarChart
      {distributionMaps}
      {possiblePositions}
      {resultsForQualifyings}
    />

    <QualToResMatrix
      {distributionMaps}
      {possiblePositions}
    />
  </div>
</main>

<style>
</style>