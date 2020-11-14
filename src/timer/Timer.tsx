import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { Time } from './Time';

export const Timer = () => {
    const duration = 5 * 60 * 1000;

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

    const stop = () => {
        setActive(false);
        cancelAnimationFrame(requestRef.current);
        setRemaining(duration);
    };

    return (
        <View style={styles.container}>
            <Time time={remaining} />
            <Button onPress={start}>Start</Button>
            <Button onPress={stop}>Stop</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});
