import {
  addDays,
  differenceInMonths,
  isEqual,
  startOfDay,
  subMinutes,
  subMonths,
} from 'date-fns';
import { Parse, Day } from 'dayspan';

import { AvailabilityType, PeriodicityType } from '@app/abstract/lib';

import {
  EventAvailability,
  ScheduleEvent,
} from '../../lib/types/scheduledDateCalculator';

type EventParseInput = Parameters<typeof Parse.schedule>[0];

const setTime = (target: Date, availability: EventAvailability) => {
  if (availability.timeFrom) {
    target.setHours(availability.timeFrom.hours);
    target.setMinutes(availability.timeFrom.minutes);
  }
};

const calculateForMonthly = (
  selectedDate: Date,
  availability: EventAvailability,
): Date | null => {
  const today = startOfDay(new Date());

  let date = new Date(selectedDate!);

  const diff = differenceInMonths(date, today);
  let check = subMonths(date, diff);

  if (check > today) {
    date = subMonths(date, diff + 1);
  } else {
    date = check;
  }

  const aMonthAgo = subMonths(today, 1);

  const isBeyondOfDateBorders =
    date < aMonthAgo || (!!availability.endDate && date > availability.endDate);

  if (isBeyondOfDateBorders) {
    return null;
  }
  setTime(date, availability);

  return date;
};

const calculateForSpecificDay = (
  specificDay: Date,
  availability: EventAvailability,
): Date | null => {
  const today = startOfDay(new Date());

  if (specificDay < today) {
    return null;
  }

  const selectedYear = specificDay.getFullYear();
  const selectedMonth = specificDay.getMonth();
  const selectedDay = specificDay.getDate();

  const result = new Date(selectedYear!, selectedMonth!, selectedDay!);
  setTime(result, availability);
  return result;
};

const calculateScheduledAt = (event: ScheduleEvent): Date | null => {
  let { availability, selectedDate } = event;

  const now = new Date();

  if (selectedDate && !isEqual(selectedDate, startOfDay(selectedDate))) {
    throw new Error(
      '[ScheduledDateCalculator]: selectedDate contains time set',
    );
  }

  const alwaysAvailable =
    availability.availabilityType === AvailabilityType.AlwaysAvailable;

  const scheduled =
    availability.availabilityType === AvailabilityType.ScheduledAccess;

  if (alwaysAvailable) {
    return calculateForSpecificDay(startOfDay(now), availability);
  }

  if (scheduled && availability.periodicityType === PeriodicityType.Once) {
    return calculateForSpecificDay(selectedDate!, availability);
  }

  if (availability.periodicityType === PeriodicityType.Monthly) {
    return calculateForMonthly(selectedDate!, availability);
  }

  let parseInput: EventParseInput = {};

  if (availability.periodicityType === PeriodicityType.Weekly) {
    const dayOfWeek = selectedDate!.getDay();
    parseInput.dayOfWeek = [dayOfWeek];
  } else if (availability.periodicityType === PeriodicityType.Weekdays) {
    parseInput.dayOfWeek = [1, 2, 3, 4, 5];
  }

  if (availability.startDate) {
    parseInput.start = availability.startDate.getTime();
  }
  if (availability.endDate) {
    let endOfDay = addDays(availability.endDate, 1);
    endOfDay = subMinutes(endOfDay, 1);
    parseInput.end = endOfDay.getTime();
  }

  const parsedSchedule = Parse.schedule(parseInput!);

  const fromDate = Day.fromDate(now);

  const futureSchedule = parsedSchedule.forecast(fromDate!, true, 1, 0, true);

  const calculated = futureSchedule.first();

  if (!calculated) {
    return null;
  }

  const result = calculated[0].start.date;

  setTime(result, availability);

  return result;
};

const cache = new Map();

export const ScheduledDateCalculator = {
  calculate: (event: ScheduleEvent): Date | null => {
    const today = new Date().toDateString();

    const key =
      JSON.stringify(event.availability) +
      (event.selectedDate?.getTime() ?? '') +
      today;

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = calculateScheduledAt(event);
    cache.set(key, result);

    return result;
  },
};
