import { useEffect, useRef, useState } from 'react';

export const useFpsCounter = () => {
    const [fps, setFps] = useState(0);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastTimeRef.current;

            if (elapsed >= 1000) {
                setFps(Math.round(frameCountRef.current / (elapsed / 1000)));
                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }
        }, 100);

        const handleFrame = () => {
            frameCountRef.current++;
            requestAnimationFrame(handleFrame);
        };

        handleFrame();

        return () => clearInterval(interval);
    }, []);

    return fps;
};
