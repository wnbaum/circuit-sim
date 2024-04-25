<script lang="ts">
    import CircuitComponent from "./CircuitComponent.svelte";
    import type { Component } from "$lib/types";

	interface DisplayComponent {
		component: Component;
	}

	let components: DisplayComponent[] = [];

	export function createComponent(component: Component): void {
		components.push({component: component})
		components = components;
	}
</script>

<main>
	<div class="window">
		{#each components as component, i}
			<CircuitComponent component={component}/>
		{/each}
	</div>
</main>

<style>
	main {
		border: 1px solid black;
		flex: var(--flex);
		position: relative;
	}

	.window {
		margin: 20px;
	}
</style>