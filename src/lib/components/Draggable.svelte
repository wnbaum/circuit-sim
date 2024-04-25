<script lang="ts">
	export let x = 0;
	export let y = 0;

	let moving = false;

	function onMouseDown() {
		moving = true;
	}

	function onMouseMove(e: MouseEvent) {
		if (moving) {
			x += e.movementX;
			y += e.movementY;
		}
	}

	function onMouseUp() {
		moving = false;
	}

	// 	$: console.log(moving);
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
		cursor: move;
		border: solid 1px gray;
		position: absolute;
	}
</style>