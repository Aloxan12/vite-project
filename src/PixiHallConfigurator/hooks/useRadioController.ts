import { useCallback, useState } from 'react';

export const useRadioController = (initialRadius?: number) => {
    const [radius, setRadius] = useState(initialRadius || 5);
    const MIN_RADIUS = 3;
    const MAX_RADIUS = 15;

    const incRadius = useCallback(() => {
        setRadius((prev) => Math.min(prev + 1, MAX_RADIUS));
    }, []);

    const decRadius = useCallback(() => {
        setRadius((prev) => Math.max(prev - 1, MIN_RADIUS));
    }, []);

    return { radius, incRadius, decRadius };
};
