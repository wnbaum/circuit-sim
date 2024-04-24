<script lang="ts">
	import Picker from "$lib/Picker.svelte";
	import Graph from "$lib/Graph.svelte";
	import CircuitLayout from "$lib/CircuitLayout.svelte";
</script>

<main>
	<div>
		Circuit Simulator
	</div>
	<div class="main-window">
		<Picker />
		<Graph />
		<CircuitLayout />
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