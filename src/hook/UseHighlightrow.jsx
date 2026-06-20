// hooks/useHighlightRow.js
//
// Reads ?highlight=<id> from the URL, scrolls that row into view,
// and returns the id so you can apply a highlight style to it.
// Auto-clears itself after a few seconds (fades out) and strips
// the query param from the URL so refreshing doesn't re-trigger it.

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const useHighlightRow = (rowRefGetter, { duration = 2500 } = {}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const highlightId = searchParams.get('highlight');
    const [activeId, setActiveId] = useState(highlightId);

    useEffect(() => {
        if (!highlightId) return;

        setActiveId(highlightId);

        // Scroll the row into view once it's rendered
        const scrollTimer = setTimeout(() => {
            const el = rowRefGetter?.(highlightId);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);

        // Remove the glow after `duration`
        const fadeTimer = setTimeout(() => setActiveId(null), duration);

        // Strip ?highlight= from the URL so a page refresh doesn't re-trigger it
        const cleanupTimer = setTimeout(() => {
            const next = new URLSearchParams(searchParams);
            next.delete('highlight');
            setSearchParams(next, { replace: true });
        }, duration);

        return () => {
            clearTimeout(scrollTimer);
            clearTimeout(fadeTimer);
            clearTimeout(cleanupTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [highlightId]);

    return activeId; // compare this to each row's id to decide whether to apply the glow class
};

export default useHighlightRow;