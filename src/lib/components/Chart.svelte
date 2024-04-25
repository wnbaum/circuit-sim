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

	function updateChart() {
		if (chart) {
			chart.data = data;
			chart.update();
		}
		
	}

	$: data, updateChart();
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		max-width: 100%;
	}
</style>
