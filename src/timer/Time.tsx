import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * 60;

interface Props {
    milliseconds: number;
}

export const Time = ({ milliseconds }: Props) => {
    const totalSeconds =
        milliseconds < 0 ? 0 : roundUpToNearestSecond(milliseconds);

    const hours = Math.floor(totalSeconds / SECONDS_IN_HOUR);

    const minutes = Math.floor(
        (totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE,
    );

    const seconds = totalSeconds % SECONDS_IN_MINUTE;

    return (
        <View>
            <Text style={styles.centerText}>
                {hours > 0 ? `${hours}:` : ''}
                {minutes >= 10 ? minutes : `0${minutes}`}:
                {seconds >= 10 ? seconds : `0${seconds}`}
            </Text>
        </View>
    );
};

function roundUpToNearestSecond(ms: number) {
    return Math.ceil(ms / 1000);
}

const styles = StyleSheet.create({
    centerText: { textAlign: 'center' },
});
