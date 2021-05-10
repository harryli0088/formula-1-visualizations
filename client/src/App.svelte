<script lang="ts">
  type ObjectMapType<T> = {
    [key:string]: T
  }

  type DriverType = {
    driverId: '854',
    driverRef: 'mick_schumacher',
    number: '47',
    code: 'MSC',
    forename: 'Mick',
    surname: 'Schumacher',
    dob: '1999-03-22',
    nationality: 'German',
    url: 'http://en.wikipedia.org/wiki/Mick_Schumacher'
  }

  type QualifyingType = {
    qualifyId: string,
    raceId: string,
    driverId: string,
    constructorId: string,
    number: string,
    position: string,
    q1: string,
    q2: string,
    q3: string,
  }

  type RaceType = {
    raceId: string,
    year: string,
    round: string,
    circuitId: string,
    name: string,
    date: string,
    time: string,
    url: string,
  }

  type ResultType = {
    resultId: string,
    raceId: string,
    driverId: string,
    constructorId: string,
    number: string,
    grid: string,
    position: string,
    positionText: string,
    positionOrder: string,
    points: string,
    laps: string,
    time: string,
    milliseconds: string,
    fastestLap: string,
    rank: string,
    fastestLapTime: string,
    fastestLapSpeed: string,
    statusId: string,
  }


  import { onMount } from "svelte";
  import arrayToObjectMap from './utils/arrayToObjectMap'
  import parseCsvFile from './utils/parseCsvFile'


	export let name: string;

  let drivers: ObjectMapType<DriverType> = {}

  onMount(async () => {
    drivers = await parseCsvFile('data/drivers.csv').then(d => arrayToObjectMap(d, "driverId"))
  console.log(drivers)
  })
  
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>