<script lang="ts">
	import Draggable from "./components/Draggable.svelte";
    import type { Component } from "$lib/types";
    import Node from "$lib/components/Node.svelte";
	import { createEventDispatcher } from "svelte";

	export let component: Component;
	export let bounds: DOMRect;

	export let startX: number = 0;
	export let startY: number = 0;
	export let endX: number = 0;
	export let endY: number = 0;

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

	let dispatch = createEventDispatcher();
</script>

<main>
	<div class="line" style="position: absolute; width: {wireLength}px; left: 10px; top: 8px; transform: translate({startX}px, {startY}px) translateX({-wireLength/2}px) rotate({wireAngle}rad) translateX({wireLength/2}px);"></div>
	<div style="text-align: center; position: absolute; width: {wireLength}px; left: 10px; transform: translate({startX}px, {startY}px) translateX({-wireLength/2}px) rotate({wireAngle}rad) translateX({wireLength/2}px) translateY(-20px);">{component.name}</div>

	<Draggable bind:x={startX} bind:y={startY} bounds={bounds} on:moved={() => dispatch("moved")}>
		<Node />
	</Draggable>
	<Draggable bind:x={endX} bind:y={endY} bounds={bounds} on:moved={() => dispatch("moved")}>
		<Node />
	</Draggable>
</main>

<style>
	main {
		user-select: none;
	}
	
	.line {
		height: 4px;
		background-color: red;
	}
</style>