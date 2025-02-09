import { QueryClient } from '@tanstack/react-query';

import {
  ActivityPipelineType,
  StoreProgress,
  convertProgress,
} from '@app/abstract/lib';
import { EventModel, ScheduleEvent } from '@app/entities/event';
import { mapEventsFromDto } from '@app/entities/event/model/mappers';
import { AppletDetailsResponse, AppletEventsResponse } from '@app/shared/api';
import {
  getAppletDetailsKey,
  getDataFromQuery,
  getEventsKey,
} from '@app/shared/lib';

import {
  Activity,
  ActivityFlow,
  ActivityListGroup,
  Entity,
  EventEntity,
} from '../../lib';
import { createActivityGroupsBuilder } from '../factories/ActivityGroupsBuilder';
import { mapActivitiesFromDto, mapActivityFlowsFromDto } from '../mappers';

type BuildResult = {
  groups: ActivityListGroup[];
};

const createActivityGroupsBuildManager = () => {
  const buildIdToEntityMap = (
    activities: Activity[],
    activityFlows: ActivityFlow[],
  ): Record<string, Entity> => {
    return [...activities, ...activityFlows].reduce<Record<string, Entity>>(
      (acc, current) => {
        acc[current.id] = current;
        return acc;
      },
      {},
    );
  };

  const sort = (eventEntities: EventEntity[]) => {
    let flows = eventEntities.filter(
      x => x.entity.pipelineType === ActivityPipelineType.Flow,
    );
    let activities = eventEntities.filter(
      x => x.entity.pipelineType === ActivityPipelineType.Regular,
    );

    flows = flows.sort((a, b) => a.entity.order - b.entity.order);
    activities = activities.sort((a, b) => a.entity.order - b.entity.order);

    return [...flows, ...activities];
  };

  const process = (
    appletId: string,
    entitiesProgress: StoreProgress,
    queryClient: QueryClient,
  ): BuildResult => {
    const appletResponse = getDataFromQuery<AppletDetailsResponse>(
      getAppletDetailsKey(appletId),
      queryClient,
    )!;

    const activities: Activity[] = mapActivitiesFromDto(
      appletResponse.result.activities,
    );

    const activityFlows: ActivityFlow[] = mapActivityFlowsFromDto(
      appletResponse.result.activityFlows,
    );

    const eventsResponse = getDataFromQuery<AppletEventsResponse>(
      getEventsKey(appletId),
      queryClient,
    )!;

    const events: ScheduleEvent[] = mapEventsFromDto(
      eventsResponse.result.events,
    );

    const idToEntity = buildIdToEntityMap(activities, activityFlows);

    const builder = createActivityGroupsBuilder({
      allAppletActivities: activities,
      appletId: appletId,
      progress: convertProgress(entitiesProgress),
    });

    let entityEvents = events
      .map<EventEntity>(event => ({
        entity: idToEntity[event.entityId],
        event,
      }))
      // @todo - remove after fix on BE
      .filter(entityEvent => !!entityEvent.entity);

    const calculator = EventModel.ScheduledDateCalculator;

    for (let eventActivity of entityEvents) {
      const date = calculator.calculate(eventActivity.event);
      eventActivity.event.scheduledAt = date;
    }

    entityEvents = entityEvents.filter(x => x.event.scheduledAt);

    entityEvents = entityEvents.filter(x => !x.entity.isHidden);

    entityEvents = sort(entityEvents);

    const groupAvailable = builder!.buildAvailable(entityEvents);
    const groupInProgress = builder!.buildInProgress(entityEvents);
    const groupScheduled = builder!.buildScheduled(entityEvents);

    return {
      groups: [groupInProgress, groupAvailable, groupScheduled],
    };
  };

  return {
    process,
  };
};

export default createActivityGroupsBuildManager();
