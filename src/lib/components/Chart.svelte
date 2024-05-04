<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";
	import type { ChartData, ChartOptions, ChartType } from "chart.js/auto";

	export let type: ChartType;
	export let data: ChartData;
	export let options: ChartOptions = {};
	let chart: Chart;
	let canvas: HTMLCanvasElement;

	onMount(() => {
		chart = new Chart(canvas, {
			type,
			data,
			options,
		});
	});

	export function updateChart() {
		if (chart) {
			chart.data = data;
			chart.options = options;
			chart.update();
		}
	}

	$: data, updateChart();
	$: options, updateChart();

	function download() {
		const rows = [
			chart.data.labels,
			chart.data.datasets[0].data
		];

		let floatRows: number[][] = []

		rows.forEach(row => {
			let newRow: number[] = [];
			row?.forEach(e => {
				newRow.push(parseFloat("" + e));
			});
			floatRows.push(newRow);
		});

		let csvContent = "data:text/csv;charset=utf-8," + floatRows.map(e => e.join(",")).join("\n");

		var encodedUri = encodeURI(csvContent);
		window.open(encodedUri);
	}
</script>

<main>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="dl" on:click={e => {download()}}>
	</div>
	<canvas bind:this={canvas}></canvas>
</main>


<style>
	main {
		position: relative;
	}

	canvas {
		max-width: 100%;
	}

	.dl {
		position: absolute;
		right: 20px;
		top: 0px;
		height: 30px;
		width: 30px;
		background-image: url("$lib/assets/download.svg");
		cursor: pointer;
		background-size: 30px;
		filter: invert();
	}

	:global(.light) .dl {
		filter: none;
	}
</style>
