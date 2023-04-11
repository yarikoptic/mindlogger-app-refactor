import { useEffect } from 'react';
import { useRef } from 'react';

import { HourMinute, getMsFromHours, getMsFromMinutes } from '@app/shared/lib';
import { AppTimer } from '@app/shared/lib/timers';

type UseIdleTimerInput = {
  onFinish: () => void;
  hourMinute?: HourMinute | null;
};

type UseIdleTimerResult = {
  onActionToIdle: () => void;
  onClose: () => void;
};

const useIdleTimer = (input: UseIdleTimerInput): UseIdleTimerResult => {
  const { onFinish, hourMinute } = input;

  const duration = hourMinute
    ? getMsFromHours(hourMinute.hours) + getMsFromMinutes(hourMinute.minutes)
    : 0;

  const idleLogicIsUsed = duration > 0;

  const timerRef = useRef<AppTimer | null>(null);

  const timer = timerRef.current;

  useEffect(() => {
    if (!idleLogicIsUsed) {
      console.log('useEffect-timer.return!');
      return () => {};
    }

    timerRef.current = new AppTimer(onIdleElapsed, false, duration);

    console.log('useEffect-timer.start()!', duration, idleLogicIsUsed);

    timerRef.current!.start();

    return () => {
      console.log('useEffect-timer.stop()!', duration);
      timerRef.current!.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onIdleElapsed = () => {
    console.log('onIdleElapsed!');
    onFinish();
  };

  const onClose = () => {
    console.log('onClose!');
    timer?.stop();
  };

  const onAction = () => {
    console.log('onAction!!');
    timer?.restart();
  };

  return {
    onActionToIdle: onAction,
    onClose,
  };
};

export default useIdleTimer;
