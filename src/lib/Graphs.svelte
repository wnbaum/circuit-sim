<script lang="ts">
	import Chart from "./components/Chart.svelte";
	import type { ChartData, ChartOptions, ChartTypeRegistry } from "chart.js";
  	import type { Component } from "./types";

	interface ChartDataOptions {
		component: Component;
		type: keyof ChartTypeRegistry;
		data: ChartData;
		options: ChartOptions;
	}

	let charts: ChartDataOptions[] = [];

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

	function addChartDataPoint(chart: ChartDataOptions, t: number, y: number): void {
			chart.data.datasets[0].data.push(y);
			chart.data.labels!.push(t);
			// console.log(t, y)
	}

	export function updateGraphTick(time: number): void {
		charts.forEach(chart => {
			addChartDataPoint(chart, time, chart.component.data.voltage);
		})

		charts = [...charts]; // trigger Svelte reactivity
	}

	export function resetGraphDisplay(components: Component[]): void {
		let newCharts: ChartDataOptions[] = [];
		components.forEach(c => {
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
				elements: {
					point:{
						radius: 0
					}
				},
				plugins: {
					tooltip: {
						enabled: false
					}
				}
			};

			let t: number[] = [];
			let y: number[] = [];

			let data: ChartData = {
				labels: t,
				datasets: [
					{
						label: c.name,
						data: y,
						fill: false,
						borderColor: "rgb(75, 192, 192)",
					},
				],
			};

			newCharts.push({ component: c, type: "line", data: data, options: options })
		})
		charts = newCharts;
	}
</script>

<main>
	{#each charts as c}
		<Chart type={c.type} data={c.data} options={c.options} />
	{/each}
</main>

<style>
	main {
		border: 1px solid black;
		flex: var(--flex);
		margin: 20px;
	}
</style>
