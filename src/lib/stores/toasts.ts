import { writable } from 'svelte/store';
import uniquid from 'uniqid';

type ToastMessage = {
	type: 'info' | 'warning' | 'error' | 'success';
	message: string;
	id: string;
};

function createToastsStore() {
	const { subscribe, update } = writable<ToastMessage[]>([]);

	function addToast({
		type,
		message,
		id,
		timeout = 3000
	}: {
		type: ToastMessage['type'];
		message: string;
		id: string;
		timeout?: number;
	}) {
		update((toasts) => [{ type, message, id }, ...toasts]);
		if (timeout) {
			setTimeout(() => {
				removeToast(id);
			}, timeout);
		}
	}

	function removeToast(id: string) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		info: (message: string, timeout?: number) =>
			addToast({
				type: 'info',
				message,
				timeout,
				id: uniquid()
			}),
		warning: (message: string, timeout?: number) =>
			addToast({
				type: 'warning',
				message,
				timeout,
				id: uniquid()
			}),
		error: (message: string, timeout?: number) =>
			addToast({
				type: 'error',
				message,
				timeout,
				id: uniquid()
			}),
		success: (message: string, timeout?: number) =>
			addToast({
				type: 'success',
				message,
				timeout,
				id: uniquid()
			}),
		remove: (id: string) => removeToast(id)
	};
}

export default createToastsStore();
