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