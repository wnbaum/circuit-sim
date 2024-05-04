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
			<div class="component custombutton" on:click={(e) => pickComponent(component)}>
				<span>{component.name}</span>
				{#if component.type == ComponentType.Voltage}
					<div>
						<input placeholder="Voltage" bind:value={component.data.voltage} on:click={e => e.stopPropagation()}>
						<div class="unit">V</div>
					</div>
				{/if}
				{#if component.type == ComponentType.Resistor}
				<div>
					<input placeholder="Resistance" bind:value={component.data.resistance} on:click={e => e.stopPropagation()}>
					<div class="unit">Ω</div>
				</div>
				{/if}
				{#if component.type == ComponentType.Capacitor}
				<div>
					<input placeholder="Capacitance" bind:value={component.data.capacitance} on:click={e => e.stopPropagation()}>
					<div class="unit">F</div>
				</div>
				{/if}
				{#if component.type == ComponentType.Inductor}
				<div>
					<input placeholder="Inductance" bind:value={component.data.inductance} on:click={e => e.stopPropagation()}>
					<div class="unit">H</div>
				</div>
				{/if}
				{#if component.type == ComponentType.CurrentSource}
				<div>
					<input placeholder="Current" bind:value={component.data.current} on:click={e => e.stopPropagation()}>
					<div class="unit">A</div>
				</div>
				{/if}
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
		padding-left: 20px;
		padding-right: 20px;
		background-color: var(--dark-background-primary);
		width: calc(100% - 40px);
		border-radius: 100px;
		text-align: center;
		transition: background-color 0.2s linear, color 0.1s ease-out;
		display: flex;
		justify-content: space-between;
	}

	:global(.light) .component { 
		background-color: var(--background-primary);
	}

	.component:hover {
		background-color: var(--dark-text-color);
		color: var(--text-color);
	}
	:global(.light) .component:hover { 
		background-color: var(--text-color);
		color: var(--dark-text-color);
	}

	input {
		background: var(--dark-background-secondary);
		border: none;
		outline: none;
		font-size: inherit;
		width: 30px;
		color: inherit;
		text-align: right;
		padding: 8px;
		border-radius: 8px;
		color: var(--dark-text-color);
	}

	:global(.light) input {
		background: var(--background-secondary);
		color: var(--text-color);
	}

	.component span {
		height: auto;
		display: inline-flex;
  		align-items: center;
	}

	.component .unit {
		width: 10px;
		display: inline-block;
	}
</style>
