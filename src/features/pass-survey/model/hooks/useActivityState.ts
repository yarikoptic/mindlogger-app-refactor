import { useActivityStorageRecord } from '../../lib';

type UseActivityPipelineArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
};

function useActivityState({
  appletId,
  activityId,
  eventId,
}: UseActivityPipelineArgs) {
  const {
    activityStorageRecord,
    upsertActivityStorageRecord,
    clearActivityStorageRecord,
  } = useActivityStorageRecord({
    appletId,
    activityId,
    eventId,
  });

  function setStep(step: number) {
    if (!activityStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...activityStorageRecord,
      step,
    });
  }

  function setAnswer(step: number, answer: any) {
    if (!activityStorageRecord) {
      return;
    }

    upsertActivityStorageRecord({
      ...activityStorageRecord,
      answers: {
        ...activityStorageRecord.answers,
        [step]: answer,
      },
    });
  }

  function removeAnswer(step: number) {
    if (!activityStorageRecord) {
      return;
    }

    const answers = { ...activityStorageRecord.answers };

    delete answers[step];

    if (activityStorageRecord) {
      upsertActivityStorageRecord({
        ...activityStorageRecord,
        answers,
      });
    }
  }

  return {
    activityStorageRecord,
    setStep,
    setAnswer,
    removeAnswer,
    clearActivityStorageRecord,
  };
}

export default useActivityState;
