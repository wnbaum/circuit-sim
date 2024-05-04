<script lang="ts">
	import Picker from "$lib/Picker.svelte";
	import Graphs from "$lib/Graphs.svelte";
	import CircuitLayout from "$lib/CircuitLayout.svelte";
	import type { Component } from "$lib/types";
	import { onMount } from "svelte";
  	import Chart from "chart.js/auto";

	let lightMode = false;

	function toggleLightMode() {
		lightMode = !lightMode;
        if (lightMode) {
			document.body.classList.add("light");
			updateGraphColor("#000000", "#CCCCCC");
        } else {
            document.body.classList.remove("light");
			updateGraphColor("#E9ECEF", "#141622");
        }
    }
	
	onMount(() => {
		updateGraphColor("#E9ECEF", "#141622");
	})

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
	let updateGraphColor: (color: string, color2: string) => void;
</script>

<main>
	
	<div class="nav">
		<div class="title">
			Circuit Simulator
		</div>
		<div class="subtitle">
			Made with 💜 by <a href="https://wnb.dev" target="_blank">Will Baumgartner</a>
		</div>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="lightmode" on:click={() => toggleLightMode()}>
		</div>
	</div>
	
	<div class="main-window">
		<Picker on:picked={pickedComponent} --flex={"0 0 200px"}/>
		<CircuitLayout on:tick={circuitTick} on:resetGraphs={resetGraphs} bind:createComponent={createComponent} --flex={"2"}/>
		<Graphs bind:updateGraphTick={updateGraphTick} bind:updateGraphColor={updateGraphColor} bind:resetGraphDisplay={resetGraphDisplay} --flex={"1"}/>
	</div>
</main>

<style>
	:root {
		/* Light mode background colors */
		--background-primary: #FFFFFF;
		--background-secondary: #F0F0F0;
		--background-tertiary: #E8E8E8;
		--background-quad: #E0E0E0;
		--text-color: #333333;

		/* Dark mode background colors */
		--dark-background-primary: #292D3E;
		--dark-background-secondary: #1f2130;
		--dark-background-tertiary: #191b29;
		--dark-background-quad: #141622;
		--dark-text-color: #E9ECEF;
	}

	main {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		font-family: "Open Sans", sans-serif;
		background-color: var(--dark-background-quad);
		color: var(--dark-text-color);
	}

	:global(.light) main {
        background-color: var(--background-quad);
		color: var(--text-color);
    }

	.main-window {
		background-color: var(--dark-background-secondary);
		display: flex;
		width: 100%;
		flex: 1;
		min-height: 0;
	}

	:global(.light) .main-window {
        background-color: var(--background-secondary);
    }

	.title {
		font-weight: bold;
		font-size: 36px;
	}

	.nav {
		margin: 20px;
		position: relative;
	}

	.lightmode {
		user-select: none;
		cursor: pointer;
		aspect-ratio: 1;
		height: 100%;
		position: absolute;
		right: 40px;
		top: 50%;
		transform: translateY(-50%);
		background-image: url("$lib/assets/moon.svg");
		background-size: 100% 100%;
	}
	:global(.light) .lightmode {
        background-image: url("$lib/assets/sun.svg");
		background-size: 50% 50%;
		background-repeat: no-repeat;
		background-position: 50% 50%;
    }

	a {
		color: inherit;
	}

</style>