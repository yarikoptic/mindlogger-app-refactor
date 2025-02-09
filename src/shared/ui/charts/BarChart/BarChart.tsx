import { FC, useMemo } from 'react';

import { format } from 'date-fns';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryScatter,
} from 'victory-native';

import {
  areDatesEqual,
  colors,
  DAYS_OF_WEEK_NUMBERS,
  DAYS_OF_WEEK_SHORT_NAMES,
  getCurrentWeekDates,
  range,
} from '@shared/lib';

import { ChartAxisDot, ChartItem } from '../types';

type BarChartDataItem = {
  date: string;
  value: number | null;
};

type Props = {
  data: Array<ChartItem>;
};

const BarChart: FC<Props> = ({ data }) => {
  const dateFormat = 'yyyy dd MM';
  const getXAxisDots = (): Array<ChartAxisDot> =>
    range(8).map(item => ({ dot: item + 1, value: 0 }));

  const barChartData: Array<BarChartDataItem> = useMemo(() => {
    const currentWeekDates = getCurrentWeekDates();

    return currentWeekDates.map(currentWeekDate => {
      return {
        date: format(currentWeekDate, dateFormat),
        value:
          data.find(dataItem => areDatesEqual(dataItem.date, currentWeekDate))
            ?.value || null,
      };
    });
  }, [data]);

  return (
    <VictoryChart>
      <VictoryScatter
        style={{ data: { fill: colors.lighterGrey } }}
        data={getXAxisDots()}
        x="dot"
        y="value"
        size={5}
      />

      <VictoryAxis
        tickValues={DAYS_OF_WEEK_NUMBERS}
        style={{
          axis: { stroke: colors.lighterGrey, fill: colors.lightGrey2 },
          axisLabel: { fill: colors.lighterGrey },
          tickLabels: { fill: colors.grey },
        }}
        tickCount={6}
        tickFormat={(_, index) => {
          return DAYS_OF_WEEK_SHORT_NAMES[index];
        }}
      />

      <VictoryBar
        style={{
          data: { fill: colors.primary },
          labels: { padding: -20, fill: colors.white },
        }}
        labels={({ datum }) => datum.value}
        data={barChartData}
        x="date"
        y="value"
      />
    </VictoryChart>
  );
};

export default BarChart;
