/* eslint-disable react-native/no-inline-styles */
import { FC, useState } from 'react';

import { CachedImage } from '@georstat/react-native-image-cache';

import { IS_ANDROID } from '@app/shared/lib';
import { Box, BoxProps, Button, XStack } from '@app/shared/ui';

import DrawingBoard from './DrawingBoard';
import { DrawLine, DrawResult } from '../lib';

const RectPadding = 15;

type Props = {
  value: Array<DrawLine>;
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  onStarted: () => void;
  onResult: (result: DrawResult) => void;
  onStartDrawing: () => void;
  onStopDrawing: () => void;
} & BoxProps;

const DrawingTest: FC<Props> = props => {
  const [width, setWidth] = useState<number | null>(null);

  const {
    value,
    backgroundImageUrl,
    imageUrl,
    onStarted,
    onResult,
    onStartDrawing,
    onStopDrawing,
  } = props;

  const [drawingStarted, setDrawingStarted] = useState(false);

  return (
    <Box
      {...props}
      onLayout={x => {
        const containerWidth = x.nativeEvent.layout.width - RectPadding * 2;

        if (containerWidth > 0) {
          setWidth(containerWidth);
        }
      }}
      mb={drawingStarted ? (IS_ANDROID ? 50 : 150) : 0}
    >
      {!!imageUrl && (
        <XStack jc="center" opacity={drawingStarted ? 0 : 1}>
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

      <Box paddingHorizontal={16} mb={20}>
        <Button
          borderRadius={4}
          backgroundColor="$blue"
          zIndex={1000}
          onPress={() => {
            setDrawingStarted(!drawingStarted);
            if (drawingStarted) {
              onStopDrawing();
            } else {
              onStartDrawing();
            }
          }}
        >
          {!drawingStarted ? 'Start drawing' : 'Stop drawing'}
        </Button>
      </Box>

      {!!width && (
        <XStack
          jc="center"
          backgroundColor={drawingStarted ? '$white' : '$grey'}
          opacity={!drawingStarted ? 0.3 : 1}
        >
          {!!backgroundImageUrl && (
            <CachedImage
              source={backgroundImageUrl}
              style={{ position: 'absolute', width, height: width }}
              resizeMode="contain"
            />
          )}

          <DrawingBoard
            value={value}
            onResult={onResult}
            onStarted={onStarted}
            width={width}
            drawingStarted={drawingStarted}
          />
        </XStack>
      )}
    </Box>
  );
};

export default DrawingTest;
