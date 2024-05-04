<script lang="ts">
	import ChartComp from "./components/Chart.svelte";
	import Chart from "chart.js/auto";
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

		charts = charts; // trigger Svelte reactivity
	}

	export function updateGraphColor(color: string, color2: string): void {
		charts.forEach(chart => {
			chart.options.scales!.x!.ticks!.color = color;
			chart.options.scales!.y!.ticks!.color = color;
			chart.options.scales!.x!.grid!.color = color2;
			chart.options.scales!.y!.grid!.color = color2;
			chart.options.plugins!.title!.color = color;
		})

		charts = charts; // trigger Svelte reactivity
	}

	export function resetGraphDisplay(components: Component[]): void {
		let newCharts: ChartDataOptions[] = [];
		let color: string = "#E9ECEF";
		let color2: string = "#292D3E";
		components.forEach(c => {
			const options: ChartOptions = {
				scales: {
					x: {
						type: "linear",
						position: "bottom",
						ticks: {
							color: color,
						},
						grid: {
							color: color2
						}
					},
					y: {
						beginAtZero: true,
						ticks: {
							color: color,
						},
						grid: {
							color: color2
						}
					}
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
					},
					legend: {
						display: false
					},
					title: {
						display: true,
						color: color,
						text: c.name
					}
				},
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
		<ChartComp type={c.type} data={c.data} options={c.options} />
	{/each}
</main>

<style>
	main {
		flex: var(--flex);
		padding: 20px;
		background-color: var(--dark-background-tertiary);
	}

	:global(.light) main {
		background-color: var(--background-tertiary);
	}
</style>
