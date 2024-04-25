<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "./components/Chart.svelte";
	import type { ChartData, ChartOptions } from "chart.js";

	const options: ChartOptions = {
		scales: {
			x: {
				type: "linear",
				position: "bottom",
			},
			y: {
				beginAtZero: true,
			},
		},
		animation: {
			duration: 0
			// duration: 100
		},
		// animations: {
		// 	y: {
		// 		duration: 0
		// 	}
		// }
	};

	let t: number[] = [];
	let y: number[] = [];

	let data: ChartData = {
		labels: t,
		datasets: [
			{
				label: "My First Dataset",
				data: y,
				fill: false,
				borderColor: "rgb(75, 192, 192)",
			},
		],
	};

	let count = 0;

	// onMount(() => {
	// 	setInterval(() => {
	// 		t.push(count);
	// 		count++;
	// 		y.push(Math.sin(count/10.0));
	// 		data.datasets[0].data = y;
	// 		data.labels = t;
	// 		data = { ...data }; // Trigger reactivity in Svelte
	// 	}, 10); // Update every second
	// });
</script>

<main>
	<Chart type={"line"} {data} {options} />
</main>

<style>
	main {
		border: 1px solid black;
		flex: var(--flex);
		margin: 20px;
	}
</style>
