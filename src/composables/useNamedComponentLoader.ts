import { ref, onMounted, computed } from "vue";
import { useGlobalStateStore } from "@/stores/global.state.store";

/**
 * A composable to manage component-level loading with global state tracking.
 *
 * @param name Unique key for the component (e.g., 'dashboard', 'profile')
 * @param fetchFn Async function that fetches data (called automatically on mount)
 */
export function useNamedComponentLoader(
	name: string,
	fetchFn: () => Promise<void>
) {
	const store = useGlobalStateStore();

	const execute = async () => {
		store.setComponentLoading(name, true);

		try {
			await fetchFn();
        } catch (err) {
            throw(err);
		} finally {
			store.setComponentLoading(name, false);
		}
	};

	onMounted(execute);

	return {
		isLoading: computed(() => store.isComponentLoading(name)),
		retry: execute,
	};
}
