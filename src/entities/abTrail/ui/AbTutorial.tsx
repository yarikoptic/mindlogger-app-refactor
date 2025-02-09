import { FC, useMemo, useState } from 'react';

import { Box, BoxProps, Text, XStack } from '@app/shared/ui';

import AbShapes from './AbShapes';
import { DeviceType, TestIndex } from '../lib';
import { transformCoordinates } from '../lib/utils';
import {
  MobileTests,
  MobileTutorials,
  TabletTests,
  TabletTutorials,
} from '../model';

type Props = {
  testIndex: TestIndex;
  tutorialStepIndex: number;
  deviceType: DeviceType;
} & BoxProps;

const ShapesRectPadding = 15;
const ContentPadding = 5;

const AbTutorial: FC<Props> = props => {
  const { testIndex, tutorialStepIndex, deviceType } = props;

  const [width, setWidth] = useState<number | null>(null);

  const { shapesData, tutorialRecord } = useMemo(() => {
    if (!width) {
      return {};
    }
    const tests = deviceType === 'Phone' ? MobileTests : TabletTests;

    const transformed = transformCoordinates(
      tests[testIndex],
      width - ContentPadding * 2,
    );

    const tutorials =
      deviceType === 'Phone' ? MobileTutorials : TabletTutorials;

    const textLine = tutorials[testIndex][tutorialStepIndex];

    return { shapesData: transformed, tutorialRecord: textLine };
  }, [width, deviceType, testIndex, tutorialStepIndex]);

  const getOrderIndexByLabel = (): number | null => {
    if (!tutorialRecord || !shapesData) {
      return null;
    }
    return (
      shapesData.nodes.find(
        x => x.label === tutorialRecord.nodeLabel?.toString(),
      )?.orderIndex ?? null
    );
  };

  return (
    <Box
      flex={1}
      onLayout={x =>
        setWidth(x.nativeEvent.layout.width - ShapesRectPadding * 2)
      }
    >
      {!!tutorialRecord && (
        <Text alignSelf="center" h={70} mx={ShapesRectPadding} fontSize={15}>
          {tutorialRecord.text}
        </Text>
      )}

      {width && (
        <XStack jc="center">
          <Box
            w={width}
            h={width}
            borderWidth={1}
            borderColor="$lightGrey2"
            p={ContentPadding}
          >
            {shapesData && (
              <AbShapes
                testData={shapesData}
                greenRoundOrder={getOrderIndexByLabel()}
                deviceType={deviceType}
              />
            )}
          </Box>
        </XStack>
      )}
    </Box>
  );
};

export default AbTutorial;
