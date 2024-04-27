<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { ComponentType, type Component } from "$lib/types";

	let components: Component[] = [
		{
			name: "Battery",
			type: ComponentType.Voltage,
			data: { "voltage": 5 }
		},
		{
			name: "Resistor",
			type: ComponentType.Resistor,
			data: { "resistance": 10 }
		},
		{
			name: "Capacitor",
			type: ComponentType.Capacitor,
			data: { "capacitance": 5 }
		},
	];

	const dispatch = createEventDispatcher();

	function pickComponent(component: Component): void {
		dispatch("picked", {
			component: component,
		});
	}
</script>

<main>
	<div class="picker">
		{#each components as component, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div style="border: 1px solid black;" on:click={(e) => pickComponent(component)}>
				{component.name}
			</div>
		{/each}
	</div>
</main>

<style>
	main {
		border: 1px solid black;
		flex: var(--flex);
	}

	.picker {
		margin: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
