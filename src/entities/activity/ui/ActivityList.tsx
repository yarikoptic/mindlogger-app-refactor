import { FC } from 'react';

import { Box, YStack } from '@app/shared/ui';

import ActivityCard from './ActivityCard';
import { ActivityListItem } from '../lib';

type Props = {
  activities: ActivityListItem[];
  onCardPress?: (activity: ActivityListItem) => void;
};

const ActivityList: FC<Props> = ({ activities, onCardPress }) => {
  return (
    <YStack space={10}>
      {activities.map(x => (
        <Box key={x.eventId}>
          <ActivityCard
            activity={x}
            disabled={false}
            onPress={() => onCardPress?.(x)}
          />
        </Box>
      ))}
    </YStack>
  );
};

export default ActivityList;
