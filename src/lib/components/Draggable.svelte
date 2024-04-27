<script lang="ts">
    import { onMount, type EventDispatcher } from "svelte";
	import { createEventDispatcher } from "svelte";

	let main: HTMLElement;

	export let x: number = 0;
	export let y: number = 0;

	let width: number;
	let height: number;

	export let snap: number = 20;

	export let bounds: DOMRect;

	let startMouseX: number = 0;
	let startMouseY: number = 0;
	let startX: number;
	let startY: number;

	let moving = false;

	onMount(() => {
		let rect: DOMRect = main.getBoundingClientRect();
		width = rect.width;
		height = rect.height;

		startX = x;
		startY = y
	});

	function onMouseDown(e: MouseEvent) {
		moving = true;
		startMouseX = e.clientX;
		startMouseY = e.clientY;
	}

	function onMouseMove(e: MouseEvent) {
		if (moving) {
			x = e.clientX - startMouseX + startX;
			y = e.clientY - startMouseY + startY;

			// bounds check
			if (x+width > bounds.width) x = bounds.width-width;
			if (x < 0) x = 0;
			if (y+height > bounds.height) y = bounds.height-height;
			if (y < 0) y = 0;

			x = Math.round(x/snap)*snap;
			y = Math.round(y/snap)*snap;
		}
	}

	let dispatch = createEventDispatcher();

	function onMouseUp() {
		moving = false;

		if (startX != x || startY != y) {
			dispatch("moved");
		}

		startX = x;
		startY = y;
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main
	bind:this={main}
	on:mousedown={onMouseDown}
	style="left: {x}px; top: {y}px;"
>
	<slot />
</main>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	main {
		user-select: none;
		cursor: pointer;
		position: absolute;
	}
</style>