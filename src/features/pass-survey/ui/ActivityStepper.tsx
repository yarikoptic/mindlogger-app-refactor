import { useRef } from 'react';

import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HourMinute } from '@app/shared/lib';
import { ActivityIndicator, Box, Center, Stepper, XStack } from '@shared/ui';

import ActivityItem from './ActivityItem';
import TutorialViewerItem, { TutorialViewerRef } from './TutorialViewerItem';
import {
  useActivityRecordInitialization,
  useActivityState,
  useActivityStepper,
} from '../model';
import useIdleTimer from '../model/hooks/useIdleTimer';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  idleTimer?: HourMinute | null;
  onClose: () => void;
  onFinish: () => void;
};

function ActivityStepper({
  appletId,
  activityId,
  eventId,
  idleTimer,
  onClose,
  onFinish,
}: Props) {
  const { t } = useTranslation();

  const { bottom } = useSafeAreaInsets();

  useActivityRecordInitialization({
    appletId,
    activityId,
    eventId,
  });

  const {
    activityStorageRecord,
    setStep: setCurrentStep,
    setAnswer,
    removeAnswer,
    setAdditionalAnswer,
  } = useActivityState({
    appletId,
    activityId,
    eventId,
  });

  const {
    isFirstStep,
    isLastStep,
    isTutorialStep,

    canMoveNext,
    canMoveBack,
    canReset,

    showTopNavigation,
    showBottomNavigation,

    isValid,
  } = useActivityStepper(activityStorageRecord);

  const { onActionToIdle, onClose: onCloseToIdle } = useIdleTimer({
    onFinish,
    hourMinute: idleTimer,
  });

  const currentStep = activityStorageRecord?.step ?? 0;

  const tutorialViewerRef = useRef<TutorialViewerRef>(null);

  const onNext = (nextStep: number) => {
    setCurrentStep(nextStep);
    onActionToIdle();
  };

  const onBack = (nextStep: number) => {
    setCurrentStep(nextStep);
    onActionToIdle();
  };

  const onBeforeNext = (): number => {
    if (!isValid()) {
      return 0;
    }

    if (isTutorialStep) {
      const moved = tutorialViewerRef.current?.next();

      !moved && onActionToIdle();

      return moved ? 0 : 1;
    }

    return 1;
  };

  const onBeforeBack = (): number => {
    if (isTutorialStep) {
      const moved = tutorialViewerRef.current?.back();

      !moved && onActionToIdle();

      return moved ? 0 : 1;
    }

    return 1;
  };

  const onUndo = () => {
    removeAnswer(currentStep);
  };

  if (!activityStorageRecord) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" color="$secondary" />
      </Center>
    );
  }

  return (
    <Box flex={1} pb={bottom}>
      <Stepper
        stepsCount={activityStorageRecord.items.length}
        startFrom={activityStorageRecord.step}
        onNext={onNext}
        onBack={onBack}
        onBeforeNext={onBeforeNext}
        onBeforeBack={onBeforeBack}
        onStartReached={() => {
          onClose();
          onCloseToIdle();
        }}
        onEndReached={onFinish}
        onUndo={() => {
          onUndo();
          onActionToIdle();
        }}
      >
        {showTopNavigation && (
          <Stepper.NavigationPanel mx={16}>
            {canMoveBack && <Stepper.BackButton isIcon />}
            {canReset && <Stepper.UndoButton isIcon />}
            {canMoveNext && <Stepper.NextButton isIcon />}
          </Stepper.NavigationPanel>
        )}

        <Stepper.ViewList
          renderItem={({ index }) => {
            const pipelineItem = activityStorageRecord.items[index];
            const value = activityStorageRecord.answers[index];

            return (
              <XStack
                flex={1}
                key={index}
                alignItems="center"
                onTouchStart={() => onActionToIdle()}
              >
                <>
                  {pipelineItem.type === 'Tutorial' && (
                    <TutorialViewerItem
                      {...pipelineItem.payload}
                      ref={tutorialViewerRef}
                    />
                  )}

                  {pipelineItem.type !== 'Tutorial' && (
                    // @ts-ignore
                    // TODO
                    // pipelineItem.type cannot be accepted as a valid type for some reason.
                    <ActivityItem
                      type={pipelineItem.type}
                      value={value}
                      pipelineItem={pipelineItem}
                      onResponse={response => {
                        setAnswer(currentStep, response);
                      }}
                      onAdditionalResponse={response => {
                        setAdditionalAnswer(currentStep, response);
                      }}
                    />
                  )}
                </>
              </XStack>
            );
          }}
        />

        <Stepper.Progress />

        {showBottomNavigation && (
          <Stepper.NavigationPanel mt={16} minHeight={24}>
            {canMoveBack && (
              <Stepper.BackButton>
                {t(
                  isFirstStep
                    ? 'activity_navigation:return'
                    : 'activity_navigation:back',
                )}
              </Stepper.BackButton>
            )}

            {canReset && (
              <Stepper.UndoButton>
                {t('activity_navigation:undo')}
              </Stepper.UndoButton>
            )}

            {canMoveNext && (
              <Stepper.NextButton>
                {t(
                  isLastStep
                    ? 'activity_navigation:done'
                    : 'activity_navigation:next',
                )}
              </Stepper.NextButton>
            )}
          </Stepper.NavigationPanel>
        )}
      </Stepper>
    </Box>
  );
}

export default ActivityStepper;
