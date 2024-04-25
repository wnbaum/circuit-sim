<script lang="ts">
	import Picker from "$lib/Picker.svelte";
	import Graph from "$lib/Graph.svelte";
	import CircuitLayout from "$lib/CircuitLayout.svelte";
    import type { Component } from "$lib/types";

	function pickedComponent(e: CustomEvent): void {
		let component: Component = e.detail.component;
		
		createComponent(component);
	}

	let createComponent: (c: Component) => void;
</script>

<main>
	<div>
		Circuit Simulator
	</div>
	<div class="main-window">
		<Picker on:picked={pickedComponent} --flex={"0 0 200px"}/>
		<CircuitLayout bind:createComponent={createComponent} --flex={"2"}/>
		<Graph --flex={"1"}/>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
	}

	.main-window {
		display: flex;
		width: 100%;
		flex: 1;
	}
</style>