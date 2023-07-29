/**
 * a helpful function to assert that an item is not null
 *
 * @see isNull - complement function
 *
 * @param item item to check
 * @returns if item is not null
 */
export function notNull<T>(item: T | undefined | null): item is T {
    return item !== undefined && item !== null;
}

/**
 * a helpful function to asset that an item is undefined or null
 *
 * @see notNull - complement function
 *
 * @param item item to check
 * @returns if item is null or undefined
 */
export function isNull<T>(item: T | undefined | null): item is undefined | null {
    return item == undefined || item == null;
}