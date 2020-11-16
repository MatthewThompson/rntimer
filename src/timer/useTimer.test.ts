
import { act, renderHook } from '@testing-library/react-hooks';

import { useTimer } from './useTimer';

const baseTime = Date.now();

function advanceFakeTime(ms: number) {

    const currentFakeTime = Date.now();
    global.Date.now = jest.fn(() => currentFakeTime + ms);
    jest.advanceTimersByTime(ms);
}

describe('useTimer', () => {

    // This is chosen as a fake time per frame. It should be noted that the
    // timer only advances each frame, so advancing time by 50 won't have any
    // effect.
    const frameTime = 100;

    beforeAll(() => {

        jest.useFakeTimers();
        jest.spyOn(global, 'requestAnimationFrame').
            mockImplementation(cb => {
                const f = () => cb(Date.now());
                // Simulate waiting for the next frame by waiting a fixed amount of
                // time before calling the callback.
                setTimeout(f, frameTime);
                return 0;
            },
        );
    });

    beforeEach(() => {
        global.Date.now = jest.fn(() => baseTime);
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.useRealTimers();
    });

    test('The remaining value starts as the given duration.', () => {
        const { result } = renderHook(() => useTimer(5000));
        expect(result.current.remaining).toBe(5000);
    });

    test('Advancing time will not change the remaining time.', () => {
        const { result } = renderHook(() => useTimer(5000));

        act(() => {
            advanceFakeTime(100);
        });

        expect(result.current.remaining).toBe(5000);
    });

    describe('start', () => {

        afterEach(() => {
            jest.clearAllTimers();
        });

        test('After start is called, the remaining value will go down each frame.', () => {
            const { result } = renderHook(() => useTimer(5000));

            act(() => {
                result.current.start();
                advanceFakeTime(100);
            });
            expect(result.current.remaining).toBe(4900);

            act(() => {
                advanceFakeTime(100);
            });
            expect(result.current.remaining).toBe(4800);

            act(() => {
                advanceFakeTime(100);
                advanceFakeTime(100);
                advanceFakeTime(100);
            });
            expect(result.current.remaining).toBe(4500);

            act(() => {
                advanceFakeTime(1000);
            });
            expect(result.current.remaining).toBe(3500);
        });

        test('After start is called, remaining is not updated until the next frame, even if time passes.', () => {
            const { result } = renderHook(() => useTimer(5000));

            act(() => {
                result.current.start();
                advanceFakeTime(50);
            });
            expect(result.current.remaining).toBe(5000);

            act(() => {
                advanceFakeTime(50);
            });
            expect(result.current.remaining).toBe(4900);
        });

        test('Can be initialised and started with a different duration.', () => {
            const { result } = renderHook(() => useTimer(24000));

            expect(result.current.remaining).toBe(24000);
            act(() => {
                result.current.start();
                advanceFakeTime(200);
            });
            expect(result.current.remaining).toBe(23800);

            act(() => {
                advanceFakeTime(100);
            });
            expect(result.current.remaining).toBe(23700);
        });
    });

    describe('reset', () => {

        test('Calling reset sets the remaining back to the duration.', () => {
            const { result } = renderHook(() => useTimer(10000));

            act(() => {
                result.current.start();
                advanceFakeTime(1000);
            });
            expect(result.current.remaining).toBe(9000);

            act(() => {
                result.current.reset();
            });
            expect(result.current.remaining).toBe(10000);

            act(() => {
                result.current.start();
                advanceFakeTime(200);
            });
            expect(result.current.remaining).toBe(9800);

            act(() => {
                result.current.reset();
            });
            expect(result.current.remaining).toBe(10000);
        });
    });
});
