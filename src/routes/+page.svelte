<script lang="ts">
	import Picker from "$lib/Picker.svelte";
	import Graphs from "$lib/Graphs.svelte";
	import CircuitLayout from "$lib/CircuitLayout.svelte";
    import type { Component } from "$lib/types";

	function pickedComponent(e: CustomEvent): void {
		let component: Component = e.detail.component;
		
		createComponent(component);
	}

	function resetGraphs(e: CustomEvent): void {
		let graphComponents: Component[] = e.detail.components;
		resetGraphDisplay(graphComponents);
	}

	function circuitTick(e: CustomEvent): void {
		updateGraphs(e.detail.time)
	}

	function updateGraphs(time: number): void {
		updateGraphTick(time);
	}

	let createComponent: (c: Component) => void;
	let resetGraphDisplay: (components: Component[]) => void;
	let updateGraphTick: (time: number) => void;
</script>

<main>
	<div class="nav">
		<div class="title">
			Circuit Simulator
		</div>
		<div class="subtitle">
			Made with 💜 by <a href="https://wnb.dev" target="_blank">Will Baumgartner</a>
		</div>
	</div>
	
	<div class="main-window">
		<Picker on:picked={pickedComponent} --flex={"0 0 200px"}/>
		<CircuitLayout on:tick={circuitTick} on:resetGraphs={resetGraphs} bind:createComponent={createComponent} --flex={"2"}/>
		<Graphs bind:updateGraphTick={updateGraphTick} bind:resetGraphDisplay={resetGraphDisplay} --flex={"1"}/>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		font-family: "Open Sans", sans-serif;
	}

	.main-window {
		display: flex;
		width: 100%;
		flex: 1;
	}

	.title {
		font-weight: bold;
		font-size: 36px;
	}

	.nav {
		margin: 20px;
	}
</style>