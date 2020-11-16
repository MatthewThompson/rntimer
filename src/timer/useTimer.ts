import React, { useState, useCallback, useEffect } from 'react';

export function useTimer(duration: number) {

    const [remaining, setRemaining] = useState(duration);
    const [endTime, setEndTime] = useState(0);
    const [active, setActive] = useState(false);

    const requestRef = React.useRef(0);

    const animateTime = useCallback(
        (time: number) => {
            requestRef.current = requestAnimationFrame(animateTime);
            setRemaining(endTime - time);
        },
        [endTime],
    );

    useEffect(() => {
        if (active) {
            requestRef.current = requestAnimationFrame(animateTime);
        }

        return () => cancelAnimationFrame(requestRef.current);
    }, [active, animateTime]);

    const start = () => {
        setActive(true);
        setEndTime(Date.now() + duration);
    };

    const reset = () => {
        setActive(false);
        cancelAnimationFrame(requestRef.current);
        setRemaining(duration);
    };

    return { remaining, start, reset };
}
