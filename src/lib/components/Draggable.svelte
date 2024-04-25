<script lang="ts">
	export let x: number = 0;
	export let y: number = 0;

	export let snap: number = 20;

	export let bounds: DOMRect;

	let startMouseX: number = 0;
	let startMouseY: number = 0;
	let startX: number = 0;
	let startY: number = 0;

	let moving = false;

	function onMouseDown(e: MouseEvent) {
		moving = true;
		startMouseX = e.clientX;
		startMouseY = e.clientY;
		startX = x;
		startY = y;
	}

	function onMouseMove(e: MouseEvent) {
		if (moving) {
			x = e.clientX - startMouseX + startX;
			y = e.clientY - startMouseY + startY;

			// bounds check
			if (x > bounds.width) x = bounds.width;
			if (x < 0) x = 0;
			if (y > bounds.height) y = bounds.height;
			if (y < 0) y = 0;

			x = Math.round(x/snap)*snap;
			y = Math.round(y/snap)*snap;
		}
	}

	function onMouseUp() {
		moving = false;
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:mousedown={onMouseDown}
	style="left: {x}px; top: {y}px;"
	class="draggable"
>
	<slot />
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.draggable {
		user-select: none;
		cursor: pointer;
		position: absolute;
	}
</style>