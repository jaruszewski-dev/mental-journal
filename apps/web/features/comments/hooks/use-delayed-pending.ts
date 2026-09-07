import { useEffect, useState } from 'react';

export function useDelayedPending(pending: boolean, delayMs = 280) {
	const [showPending, setShowPending] = useState(false);

	useEffect(() => {
		if (!pending) {
			setShowPending(false);
			return;
		}

		const id = window.setTimeout(() => setShowPending(true), delayMs);
		return () => window.clearTimeout(id);
	}, [pending, delayMs]);

	return pending && showPending;
}
