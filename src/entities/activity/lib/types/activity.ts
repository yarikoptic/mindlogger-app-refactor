import { ConditionalLogic } from './conditionalLogic';
import { FlankerSettings } from './flanker';

export type ActivityItemType =
  | 'AbTest'
  | 'DrawingTest'
  | 'Splash'
  | 'Flanker'
  | 'TextInput'
  | 'NumberSelect'
  | 'Slider'
  | 'Radio'
  | 'Geolocation'
  | 'TimeRange'
  | 'AudioPlayer'
  | 'StackedCheckbox'
  | 'StackedRadio'
  | 'StackedSlider'
  | 'Message'
  | 'Audio'
  | 'Photo'
  | 'Video'
  | 'Checkbox'
  | 'Date'
  | 'Time';

type AbTestConfig = {
  device: 'Phone' | 'Tablet';
};

type DrawingTestTestConfig = {
  imageUrl: string | null;
  backgroundImageUrl: string | null;
};

type TextInputConfig = {
  maxLength: number;
  isNumeric: boolean;
  shouldIdentifyResponse: boolean;
};

type SliderConfig = {
  leftTitle: string | null;
  rightTitle: string | null;
  minValue: number;
  maxValue: number;
  leftImageUrl: string | null;
  rightImageUrl: string | null;
  showTickMarks: boolean | null;
  showTickLabels: boolean | null;
  isContinuousSlider: boolean | null;
};

type NumberSelectConfig = {
  max: number;
  min: number;
};

type SplashConfig = {
  imageUrl: string;
};

type CheckboxConfig = {
  randomizeOptions: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  setPalette: boolean;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    score: number | null;
    tooltip: string | null;
    color: string | null;
    isHidden: boolean;
  }>;
};

type MessageConfig = null;

type AudioConfig = {
  maxDuration: number;
};

type AudioPlayerConfig = {
  file: string;
  playOnce: boolean;
};

type StackedCheckboxConfig = {
  randomizeOptions: boolean;
  addScores: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  rows: Array<{
    id: string;
    rowName: string;
    rowImage: string | null;
    tooltip: string | null;
  }>;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    tooltip: string | null;
  }>;
  dataMatrix: Array<{
    rowId: string;
    options: [
      {
        optionId: string;
        score: number;
        alert: string;
      },
    ];
  }>;
};

type StackedRadioConfig = {
  randomizeOptions: boolean;
  addScores: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  rows: Array<{
    id: string;
    rowName: string;
    rowImage: string | null;
    tooltip: string | null;
  }>;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    tooltip: string | null;
  }>;
  dataMatrix: Array<{
    rowId: string;
    options: [
      {
        optionId: string;
        score: number;
        alert: string;
      },
    ];
  }>;
};

type StackedSliderConfig = {
  addScores: boolean;
  setAlerts: boolean;
  rows: {
    id: string;
    label: string;
    leftTitle: string | null;
    rightTitle: string | null;
    minValue: number;
    maxValue: number;
    leftImageUrl: string | null;
    rightImageUrl: string | null;
  }[];
};

type RadioConfig = {
  randomizeOptions: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  setPalette: boolean;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    score: number | null;
    tooltip: string | null;
    color: string | null;
    isHidden: boolean;
  }>;
};

type PhotoConfig = null;

type VideoConfig = null;

type TimeConfig = null;

export type ActivityItemConfig =
  | AbTestConfig
  | DrawingTestTestConfig
  | TextInputConfig
  | NumberSelectConfig
  | SliderConfig
  | CheckboxConfig
  | MessageConfig
  | AudioConfig
  | AudioPlayerConfig
  | StackedCheckboxConfig
  | StackedSliderConfig
  | RadioConfig
  | SplashConfig
  | PhotoConfig
  | VideoConfig
  | TimeConfig
  | FlankerSettings
  | null;

type ActivityItemBase = {
  id: string;
  name?: string;
  inputType: ActivityItemType;
  config: ActivityItemConfig;
  timer: number | null;
  isSkippable: boolean;
  hasAlert: boolean;
  hasScore: boolean;
  isAbleToMoveBack: boolean;
  hasTextResponse: boolean;
  canBeReset: boolean;
  hasTopNavigation: boolean;
  isHidden: boolean;
  order: number;
  question: string;
  validationOptions?: {
    correctAnswer?: string;
  };
  additionalText?: {
    required: boolean;
  };
  conditionalLogic?: ConditionalLogic;
};

interface AbTestActivityItem extends ActivityItemBase {
  inputType: 'AbTest';
  config: AbTestConfig;
}

interface SplashActivityItem extends ActivityItemBase {
  inputType: 'Splash';
  config: SplashConfig;
}

interface DrawingTestTestActivityItem extends ActivityItemBase {
  inputType: 'DrawingTest';
  config: DrawingTestTestConfig;
}

interface FlankerActivityItem extends ActivityItemBase {
  inputType: 'Flanker';
  config: FlankerSettings;
}

interface TextInputActivityItem extends ActivityItemBase {
  inputType: 'TextInput';
  config: TextInputConfig;
}

interface SliderActivityItem extends ActivityItemBase {
  inputType: 'Slider';
  config: SliderConfig;
}

interface NumberSelectActivityItem extends ActivityItemBase {
  inputType: 'NumberSelect';
  config: NumberSelectConfig;
}

interface CheckboxActivityItem extends ActivityItemBase {
  inputType: 'Checkbox';
  config: CheckboxConfig;
}

interface AudioActivityItem extends ActivityItemBase {
  inputType: 'Audio';
  config: AudioConfig;
}
interface MessageActivityItem extends ActivityItemBase {
  inputType: 'Message';
  config: MessageConfig;
}
interface AudioPlayerActivityItem extends ActivityItemBase {
  inputType: 'AudioPlayer';
  config: AudioPlayerConfig;
}

interface StackedCheckboxActivityItem extends ActivityItemBase {
  inputType: 'StackedCheckbox';
  config: StackedCheckboxConfig;
}

interface StackedRadioActivityItem extends ActivityItemBase {
  inputType: 'StackedRadio';
  config: StackedRadioConfig;
}

interface StackedSliderActivityItem extends ActivityItemBase {
  inputType: 'StackedSlider';
  config: StackedSliderConfig;
}

interface TimeRangeActivityItem extends ActivityItemBase {
  inputType: 'TimeRange';
  config: null;
}

interface RadioActivityItem extends ActivityItemBase {
  inputType: 'Radio';
  config: RadioConfig;
}
interface GeolocationActivityItem extends ActivityItemBase {
  inputType: 'Geolocation';
  config: null;
}

interface DateActivityItem extends ActivityItemBase {
  inputType: 'Date';
  config: null;
}

interface PhotoActivityItem extends ActivityItemBase {
  inputType: 'Photo';
  config: PhotoConfig;
}

interface VideoActivityItem extends ActivityItemBase {
  inputType: 'Video';
  config: VideoConfig;
}

interface TimeActivityItem extends ActivityItemBase {
  inputType: 'Time';
  config: TimeConfig;
}

export type ActivityItem =
  | AbTestActivityItem
  | SplashActivityItem
  | DrawingTestTestActivityItem
  | TextInputActivityItem
  | FlankerActivityItem
  | NumberSelectActivityItem
  | SliderActivityItem
  | CheckboxActivityItem
  | GeolocationActivityItem
  | AudioActivityItem
  | MessageActivityItem
  | AudioPlayerActivityItem
  | StackedSliderActivityItem
  | StackedCheckboxActivityItem
  | StackedRadioActivityItem
  | TimeRangeActivityItem
  | RadioActivityItem
  | DateActivityItem
  | PhotoActivityItem
  | TimeActivityItem
  | VideoActivityItem;

export type ActivityDetails = {
  id: string;
  name: string;
  description: string;
  splashScreen: string | null;
  image: string | null;
  showAllAtOnce: boolean;
  isSkippable: boolean;
  isReviewable: boolean;
  responseIsEditable: boolean;
  order: number;
  isHidden: boolean;
  items: ActivityItem[];
};
