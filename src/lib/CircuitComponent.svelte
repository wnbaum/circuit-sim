<script lang="ts">
	import Draggable from "./components/Draggable.svelte";
    import type { Component } from "$lib/types";
    import Node from "./components/Node.svelte";

	export let component: Component;
	export let bounds: DOMRect;

	let startX: number;
	let startY: number;
	let endX: number;
	let endY: number;

	let wireAngle: number = 0;
	let wireLength: number = 0;

	$: wireAngle = getWireAngle(startX, startY, endX, endY);
	$: wireLength = getWireLength(startX, startY, endX, endY);

	function getWireLength(startX: number, startY: number, endX: number, endY: number) {
		let width: number = endX - startX;
		let height: number = endY - startY;
		return Math.sqrt(width*width + height*height);
	}

	function getWireAngle(startX: number, startY: number, endX: number, endY: number) {
		let width: number = endX - startX;
		let height: number = endY - startY;
		return Math.atan2(height,width);
	}

	export function updateBounds() {
		
	}
</script>

<main>
	<div class="line" style="position: absolute; width: {wireLength}px; left: 10px; top: 8px; transform: translate({startX}px, {startY}px) translateX({-wireLength/2}px) rotate({wireAngle}rad) translateX({wireLength/2}px);">

	</div>
	<Draggable bind:x={startX} bind:y={startY} bounds={bounds}>
		<Node />
	</Draggable>
	<Draggable bind:x={endX} bind:y={endY} bounds={bounds}>
		<Node />
	</Draggable>
</main>

<style>
	.line {
		height: 4px;
		background-color: red;
	}
</style>