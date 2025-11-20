import type { OptionType } from '@/components/form/SelectInput.vue'; // Or your searchable select
import router from '@/router';
import type { RouteRecordNormalized } from 'vue-router';

/**
 * Gets all registered routes from the main router instance and processes them
 * into a structured array of select options.
 *
 * This function handles everything internally:
 * 1. It fetches routes using `router.getRoutes()`.
 * 2. It filters for unique, named routes, storing the name and its corresponding path.
 * 3. It sorts the routes alphabetically by their name (the label).
 * 4. It maps them to the desired { label: name, value: path } structure.
 *
 * @returns {OptionType[]} A unique, sorted array of options.
 */
export function getNamedRoutesAsSelectOptions(): OptionType[] {
  // Get all registered routes from the imported router instance.
  const allRoutes: RouteRecordNormalized[] = router.getRoutes();

  // Use a Map to store a unique mapping of route name to route path.
  // This correctly associates each name with its path.
  const routeMap = new Map<string, string>();

  allRoutes.forEach(route => {
    // We only care about routes with a string-based name.
    if (route.name && typeof route.name === 'string') {
      // If a name is duplicated (e.g., aliases), the last one found will be used.
      routeMap.set(route.name, route.path);
    }
  });

  // 1. Convert the Map into an array of [name, path] pairs.
  // 2. Sort the array alphabetically based on the route name (the label).
  // 3. Map the sorted array into the final { label, value } object structure.
  return Array.from(routeMap.entries())
    .sort((a, b) => {
      // a[0] is the name, b[0] is the name
      return a[0].localeCompare(b[0]);
    })
    .map(([name, path]) => ({ // Destructure the [name, path] array
      label: path,
      value: name, // Use the path as the value
    }));
}