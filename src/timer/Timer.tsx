import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { Time } from './Time';
import { useTimer } from './useTimer';

export const Timer = () => {
    const duration = 5 * 60 * 1000;

    const { remaining, start, reset } = useTimer(duration);

    return (
        <View style={styles.container}>
            <Time milliseconds={remaining} />
            <Button onPress={start}>Start</Button>
            <Button onPress={reset}>Reset</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});
