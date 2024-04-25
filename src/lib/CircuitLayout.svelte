<script lang="ts">
    import CircuitComponent from "./CircuitComponent.svelte";
    import type { Component } from "$lib/types";
    import { onMount } from "svelte";

	interface DisplayComponent {
		component: Component;
	}

	let components: DisplayComponent[] = [];

	export function createComponent(component: Component): void {
		components.push({component: component})
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
</script>

<main>
	<div bind:this={circuitWindow} class="window">
		{#each components as component, i}
			<CircuitComponent component={component.component} bounds={bounds}/>
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