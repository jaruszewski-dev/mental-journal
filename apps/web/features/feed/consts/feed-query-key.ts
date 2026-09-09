export const feedQueryKey = ['feed'] as const;

export function feedListQueryKey(tags: string[] = []) {
	return [...feedQueryKey, { tags: [...tags].sort() }] as const;
}
