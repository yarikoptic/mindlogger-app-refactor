import httpService from './httpService';
import { SuccessfulEmptyResponse } from '../types';

export const enum LogTrigger {
  AppMount = 'AppMount',
  FirstAppRun = 'FirstAppRun',
  RunBackgroundProcess = 'RunBackgroundProcess',
  EntityCompleted = 'ActivityOrFlowCompleted',
  PullToRefresh = 'PullToRefresh',
  GoToForeground = 'GoToForeground',
  LimitReachedNotification = 'LimitReachedNotification',
}

export const enum LogAction {
  ReSchedule = 'ReSchedule',
  ReStack = 'ReStack',
}

export type NotificationLogsRequest = {
  userId: string;
  deviceId: string;
  actionType: string;
  notificationDescriptions: string;
  notificationInQueue: string;
  scheduledNotifications: string;
};

export type NotificationLogsResponse = SuccessfulEmptyResponse;

function notificationService() {
  return {
    sendNotificationLogs(request: NotificationLogsRequest) {
      return httpService.post<NotificationLogsResponse>(
        '/logs/notification',
        request,
      );
    },
  };
}

export const NotificationService = notificationService();
