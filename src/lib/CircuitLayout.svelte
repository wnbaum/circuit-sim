<script lang="ts">
    import CircuitComponent from "./CircuitComponent.svelte";
    import { ComponentType, type Component } from "$lib/types";
    import { createEventDispatcher, onMount } from "svelte";

	import { CircuitGraph } from "./analysis";
	import type { Edge } from "./analysis";

	interface DisplayComponent {
		component: Component;
		startX: number;
		startY: number;
		endX: number;
		endY: number;
	}

	let components: DisplayComponent[] = [];

	export function createComponent(component: Component): void {
		components.push({component: component, startX: 0, startY: 0, endX: 0, endY: 0})
		components = components;
	}

	let bounds: DOMRect;
	let circuitWindow: HTMLElement;

	function updateBounds() {
		bounds = circuitWindow.getBoundingClientRect();
	}

	onMount(() => {
		updateBounds()
	})

	let tickInterval: number;
	let circuitGraph: CircuitGraph;

	function updateCircuit() {
		circuitGraph = new CircuitGraph();

		components.forEach(c => {
			let startKey: string = c.startX + "," + c.startY;
			let endKey: string = c.endX + "," + c.endY;

			circuitGraph.addEdge(startKey, endKey, c.component, true);
			circuitGraph.addEdge(endKey, startKey, c.component, false);
		});

		circuitGraph.initGraph();
		clearInterval(tickInterval);
		tickInterval = setInterval(() => {
			circuitGraph.tick();
			onCircuitTick(circuitGraph.getTime());
		}, 100); // 10ms, i.e. try 100fps max

		resetGraphs();
	}

	function resetCircuit() {
		circuitGraph.reset();
		resetGraphs();
	}

	function clearCircuit() {
		components = [];
		circuitGraph.initGraph();
		clearInterval(tickInterval);
		resetGraphs();
	}

	function onCircuitTick(time: number) {
		dispatch("tick", { time: time });
	}

	let dispatch = createEventDispatcher();
	
	function resetGraphs() {
		let graphComponents: Component[] = [];
		components.forEach(c => {
			if (c.component.type == ComponentType.Voltmeter && c.component.data.monitor) {
				graphComponents.push(c.component)
			}
		})
		dispatch("resetGraphs", { components: graphComponents });
	}
	
</script>

<main>
	<button on:click={() => resetCircuit()}>Reset</button><button on:click={() => clearCircuit()}>Clear</button>
	<div bind:this={circuitWindow} class="window">
		{#each components as component, i}
			<CircuitComponent component={component.component} bounds={bounds} on:monitorToggle={() => resetGraphs()} on:moved={() => updateCircuit()} bind:startX={component.startX} bind:startY={component.startY} bind:endX={component.endX} bind:endY={component.endY}/>
		{/each}
	</div>
</main>

<svelte:window on:resize={updateBounds}/>

<style>
	main {
		border: 1px solid black;
		flex: var(--flex);
	}

	.window {
		border: 1px solid red;
		margin: 20px;
		height: calc(100% - 40px);
		position: relative;
	}
</style>