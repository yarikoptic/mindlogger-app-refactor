/* eslint-disable react-native/no-inline-styles */
import { FC, useState } from 'react';

import { CachedImage } from '@georstat/react-native-image-cache';

import { Box, BoxProps, XStack } from '@app/shared/ui';

import DrawingBoard from './DrawingBoard';
import { DrawLine, DrawResult } from '../lib';

const RectPadding = 15;

type Props = {
  value: Array<DrawLine>;
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  onStarted: () => void;
  onResult: (result: DrawResult) => void;
  scrollEnabled: boolean;
  stopScrolling: () => void;
} & BoxProps;

const DrawingTest: FC<Props> = props => {
  const [width, setWidth] = useState<number | null>(null);

  const {
    value,
    //backgroundImageUrl,
    // imageUrl,
    onStarted,
    onResult,
    scrollEnabled,
    stopScrolling,
  } = props;

  const imageUrl =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Spiral-fermat-1.svg/1920px-Spiral-fermat-1.svg.png';

  const spiral =
    'https://www.shutterstock.com/image-vector/abstract-spiral-black-white-design-600w-1071243008.jpg';

  return (
    <Box
      {...props}
      onLayout={x => {
        const containerWidth = x.nativeEvent.layout.width - RectPadding * 2;

        if (containerWidth > 0) {
          setWidth(containerWidth);
        }
      }}
      mb={150}
    >
      {!!imageUrl && (
        <XStack jc="center" opacity={scrollEnabled ? 1 : 0.5}>
          <CachedImage
            source={imageUrl}
            style={{
              width: 300,
              height: 300,
              padding: 20,
              paddingBottom: 0,
              marginBottom: 20,
            }}
            resizeMode="contain"
          />
        </XStack>
      )}

      {!!width && (
        <XStack jc="center">
          <Box width={width} height={width} backgroundColor={'$grey'}>
            <Box
              width={width}
              height={width}
              backgroundColor="white"
              opacity={scrollEnabled ? 0.7 : 1}
            >
              {!!spiral && (
                <CachedImage
                  source={spiral}
                  style={{ position: 'absolute', width, height: width }}
                  resizeMode="contain"
                />
              )}

              <DrawingBoard
                scrollEnabled={scrollEnabled}
                stopScrolling={stopScrolling}
                value={value}
                onResult={onResult}
                onStarted={onStarted}
                width={width}
              />
            </Box>
          </Box>
        </XStack>
      )}
    </Box>
  );
};

export default DrawingTest;
