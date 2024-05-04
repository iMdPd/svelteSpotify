<script lang="ts" context="module">
	let current: HTMLAudioElement;
</script>

<script lang="ts">
	import { Pause, Play } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	type Track = SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified;
	export let track: Track;

	const dispatch = createEventDispatcher<{
		play: { track: Track };
		pause: { track: Track };
	}>();

	let audio: HTMLAudioElement;
	let paused = true;

	function handlePlay() {
		if (paused) {
			audio.play();
		} else {
			audio.pause();
		}
	}

	function onPlay() {
		if (current && current !== audio) {
			current.currentTime = 0;
			current.pause();
		}

		current = audio;
		dispatch('play', { track });
	}
	function onPause() {
		dispatch('pause', { track });
	}
</script>

<div class="player">
	<audio
		on:play={onPlay}
		on:pause={onPause}
		bind:this={audio}
		bind:paused
		controls
		src={track.preview_url}
		preload="none"
	/>

	<button aria-label={paused ? `Play ${track.name}` : `Pause ${track.name}`} on:click={handlePlay}>
		{#if paused}
			<Play color="var(--text-color)" aria-hidden focusable="false" />
		{:else}
			<Pause color="var(--text-color)" aria-hidden focusable="false" />
		{/if}
	</button>
</div>

<style lang="scss">
	.player {
		audio {
			display: none;
		}
		button {
			width: 12px;
			height: 12px;
			background: none;
			border: none;
			cursor: pointer;

			:global(svg) {
				fill: var(--text-color);
				width: 12px;
				height: 12px;
			}
		}
	}
</style>
