<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { ComponentType, type Component } from "$lib/types";

	let components: Component[] = [
		{
			name: "Battery",
			type: ComponentType.Voltage,
			data: { voltage: 5 }
		},
		{
			name: "Resistor",
			type: ComponentType.Resistor,
			data: { resistance: 4 }
		},
		{
			name: "Capacitor",
			type: ComponentType.Capacitor,
			data: { capacitance: 1, voltage: 0 }
		},
		{
			name: "Inductor",
			type: ComponentType.Inductor,
			data: { inductance: 50, current: 0 }
		},
		{
			name: "Wire",
			type: ComponentType.Wire,
			data: {}
		},
		{
			name: "Current Source",
			type: ComponentType.CurrentSource,
			data: { current: 1 }
		},
		{
			name: "Voltmeter",
			type: ComponentType.Voltmeter,
			data: { voltage: 0, monitor: false },
			
		}
	];

	const dispatch = createEventDispatcher();

	function pickComponent(component: Component): void {
		dispatch("picked", {
			component: JSON.parse(JSON.stringify(component)), // create new component copy (hacky)
		});
	}
</script>

<main>
	<div class="picker">
		{#each components as component, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="component" on:click={(e) => pickComponent(component)}>
				{component.name}
			</div>
		{/each}
	</div>
</main>

<style>
	main {
		flex: var(--flex);
	}

	.picker {
		margin: 20px;
		margin-right: 0px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.component {
		cursor: pointer;
		padding: 10px;
		background-color: var(--dark-background-primary);
		width: calc(100%-20px);
		border-radius: 100px;
		text-align: center;
	}

	:global(.light) .component { 
		background-color: var(--background-primary);
	}
</style>
