import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';

import { Time } from './Time';

describe('Time', () => {
    it('displays negative time as 00:00', () => {
        const testCases: [number, string][] = [
            [-1, '00:00'],
            [-2, '00:00'],
            [-213873, '00:00'],
        ];

        testCases.forEach((testCase) => {
            const { queryByText } = render(<Time milliseconds={testCase[0]} />);

            expect(queryByText(testCase[1])).not.toBeNull();
        });
    });

    it('displays 00:00 if there are 0 milliseconds', () => {
        const { queryByText } = render(<Time milliseconds={0} />);

        expect(queryByText('00:00')).not.toBeNull();
    });

    it('rounds up to the nearest second', () => {
        const testCases: [number, string][] = [
            [1, '00:01'],
            [2, '00:01'],
            [100, '00:01'],
            [555, '00:01'],
            [999, '00:01'],
            [1000, '00:01'],
            [1001, '00:02'],
        ];

        testCases.forEach((testCase) => {
            const { queryByText } = render(<Time milliseconds={testCase[0]} />);

            expect(queryByText(testCase[1])).not.toBeNull();
        });
    });

    it('pads seconds with a 0 if there is only 1 digit', () => {
        const testCases: [number, string][] = [
            [1000, '00:01'],
            [1001, '00:02'],
            [2000, '00:02'],
            [3000, '00:03'],
            [4000, '00:04'],
            [5000, '00:05'],
            [6000, '00:06'],
            [7000, '00:07'],
            [8000, '00:08'],
            [9000, '00:09'],
            [9001, '00:10'],
            [9999, '00:10'],
            [10000, '00:10'],
            [59000, '00:59'],
        ];

        testCases.forEach((testCase) => {
            const { queryByText } = render(<Time milliseconds={testCase[0]} />);

            expect(queryByText(testCase[1])).not.toBeNull();
        });
    });

    it('pads minutes with a 0 if there is only 1 digit', () => {
        const testCases: [number, string][] = [
            [59001, '01:00'],
            [60000, '01:00'],
            [120000, '02:00'],
            [180000, '03:00'],
            [240000, '04:00'],
            [300000, '05:00'],
            [360000, '06:00'],
            [420000, '07:00'],
            [480000, '08:00'],
            [540000, '09:00'],
            [600000, '10:00'],
            [3540000, '59:00'],
        ];

        testCases.forEach((testCase) => {
            const { queryByText } = render(<Time milliseconds={testCase[0]} />);

            expect(queryByText(testCase[1])).not.toBeNull();
        });
    });

    it('does not display anything for hours if there are none', () => {
        const { queryByText } = render(<Time milliseconds={63000} />);

        expect(queryByText('01:03')).not.toBeNull();
        expect(queryByText(':01:03')).toBeNull();
    });

    it('displays anything for hours if there are at least one', () => {
        const { queryByText } = render(<Time milliseconds={3663000} />);

        expect(queryByText('1:01:03')).not.toBeNull();
    });

    it('does not pad hours with extra 0s', () => {
        const { queryByText } = render(<Time milliseconds={3663000} />);

        expect(queryByText('1:01:03')).not.toBeNull();
        expect(queryByText('01:01:03')).toBeNull();
    });
});
