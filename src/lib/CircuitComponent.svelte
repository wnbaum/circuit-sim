<script lang="ts">
	import Draggable from "./components/Draggable.svelte";
    import type { Component } from "$lib/types";

	export let component: Component;
</script>

<main>
	<Draggable>
		<h1>Start</h1>
	</Draggable>
	<Draggable>
		<h1>End</h1>
	</Draggable>
</main>

<style>
	
</style>