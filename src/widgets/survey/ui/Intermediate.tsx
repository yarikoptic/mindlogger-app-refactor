import { useCallback, useEffect } from 'react';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { useActivityAnswersMutation } from '@app/entities/activity';
import { useAppletDetailsQuery, AppletModel } from '@app/entities/applet';
import {
  mapActivitiesFromDto,
  mapActivityFlowFromDto,
} from '@app/entities/applet/model';
import { PassSurveyModel } from '@app/features/pass-survey';
import {
  getUnixTimestamp,
  onApiRequestError,
  useAppDispatch,
} from '@app/shared/lib';
import { badge } from '@assets/images';
import { Center, YStack, Text, Button, Image, XStack } from '@shared/ui';

import { useFlowStorageRecord } from '../lib';
import { mapAnswersToDto } from '../model';

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;
  flowId: string;

  onClose: () => void;
  onFinish: () => void;
};

const ActivityBox = styled(Center, {
  padding: 25,
  mx: 20,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$grey',
});

function Intermediate({
  flowId,
  appletId,
  activityId,
  eventId,
  onClose,
  onFinish,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  let { data: activityFlow } = useAppletDetailsQuery(appletId, {
    select: response =>
      mapActivityFlowFromDto(
        response.data.result.activityFlows.find(o => o.id === flowId)!,
      ),
  });

  let { data: allActivities } = useAppletDetailsQuery(appletId, {
    select: r => mapActivitiesFromDto(r.data.result.activities),
  });

  const { flowStorageRecord } = useFlowStorageRecord({
    appletId,
    eventId,
    flowId,
  });

  const { step, pipeline } = flowStorageRecord!;

  const nextFlowItem = pipeline[step + 1];

  const activitiesPassed = pipeline
    .slice(0, step)
    .filter(o => o.type === 'Stepper').length;

  const totalActivities = activityFlow!.activityIds.length;

  const nextActivityId = nextFlowItem.payload.activityId;

  const nextActivity = allActivities?.find(x => x.id === nextActivityId);

  const { activityStorageRecord, clearActivityStorageRecord } =
    PassSurveyModel.useActivityState({
      appletId,
      activityId,
      eventId,
    });

  const {
    mutate: sendAnswers,
    isLoading: isSendingAnswers,
    isPaused: isOffline,
  } = useActivityAnswersMutation({
    onSuccess: () => {
      clearActivityStorageRecord();
      changeActivity();
      onFinish();
    },
    onError: error => {
      if (error.response.status !== 401 && error.evaluatedMessage) {
        onApiRequestError(error.evaluatedMessage);
      }
    },
  });

  const changeActivity = useCallback(() => {
    if (!nextActivity) {
      return;
    }

    dispatch(
      AppletModel.actions.flowUpdated({
        appletId,
        flowId,
        activityId: nextActivity.id,
        eventId,
        pipelineActivityOrder: activitiesPassed,
      }),
    );
  }, [appletId, dispatch, eventId, flowId, nextActivity, activitiesPassed]);

  function completeActivity() {
    if (!activityStorageRecord) {
      return;
    }

    sendAnswers({
      flowId,
      appletId,
      activityId,
      createdAt: getUnixTimestamp(Date.now()),
      version: activityStorageRecord.appletVersion,
      answers: mapAnswersToDto(
        activityStorageRecord.items,
        activityStorageRecord.answers,
      ),
    });
  }

  useEffect(() => {
    if (isOffline) {
      clearActivityStorageRecord();
      changeActivity();
      onFinish();
    }
  }, [changeActivity, clearActivityStorageRecord, isOffline, onFinish]);

  return (
    <YStack flex={1} mx={40} jc="center" bg="$white">
      <YStack space={25}>
        <Text textAlign="center" fontSize={16}>
          {t('additional:submit_flow_answers')}{' '}
          <Text fontWeight="bold">{t('additional:submit')}</Text>{' '}
          {t('additional:submit_flow_answers_ex')}
        </Text>

        <ActivityBox>
          <Text fontWeight="bold" mb={10} fontSize={16}>
            {nextActivity?.name ?? 'Activity'}
          </Text>

          <XStack>
            <Image src={badge} width={18} height={18} opacity={0.6} r={4} />

            <Text fontSize={14} color="$grey">
              {activitiesPassed + 1} of {totalActivities} {activityFlow!.name}
            </Text>
          </XStack>
        </ActivityBox>

        <YStack space={10}>
          <Button
            bg="$blue"
            onPress={completeActivity}
            isLoading={isSendingAnswers}
          >
            {t('change_study:submit')}
          </Button>

          <Text
            color="$blue"
            textAlign="center"
            fontSize={17}
            fontWeight="bold"
            onPress={onClose}
          >
            {t('activity_navigation:back')}
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
}

export default Intermediate;
