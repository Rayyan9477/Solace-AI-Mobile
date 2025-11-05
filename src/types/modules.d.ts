/**
 * Type declarations for external modules without built-in TypeScript support
 */

declare module "date-fns" {
  export function format(date: Date | number, format: string): string;
  export function addHours(date: Date | number, amount: number): Date;
  export function addDays(date: Date | number, amount: number): Date;
  export function startOfDay(date: Date | number): Date;
  export function isAfter(
    date: Date | number,
    dateToCompare: Date | number,
  ): boolean;
  export function isBefore(
    date: Date | number,
    dateToCompare: Date | number,
  ): boolean;
  export function parseISO(argument: string): Date;
  // Add other date-fns functions as needed
}

declare module "expo-device" {
  export const isDevice: boolean;
  // Add other expo-device exports as needed
}

declare module "expo-notifications" {
  export interface NotificationPermissionsStatus {
    status: string;
    expires?: number;
    allowsSound?: boolean;
    allowsAlert?: boolean;
    allowsBadge?: boolean;
  }

  export interface NotificationRequest {
    identifier: string;
    content: {
      title: string;
      body: string;
      data?: any;
      categoryIdentifier?: string;
    };
  }

  export interface Notification {
    identifier: string;
    date: Date | string;
    request: NotificationRequest;
    content?: {
      title?: string;
      body?: string;
      data?: any;
      categoryIdentifier?: string;
    };
  }

  export const AndroidImportance: {
    LOW: any;
    DEFAULT: any;
    HIGH: any;
    MAX: any;
  };

  export function setNotificationHandler(handler: {
    handleNotification: () => Promise<{
      shouldShowAlert: boolean;
      shouldPlaySound: boolean;
      shouldSetBadge: boolean;
    }>;
  }): void;

  export function getPermissionsAsync(): Promise<NotificationPermissionsStatus>;
  export function requestPermissionsAsync(
    options?: any,
  ): Promise<NotificationPermissionsStatus>;
  export function setNotificationChannelAsync(
    channelId: string,
    channel: any,
  ): Promise<any>;
  export function scheduleNotificationAsync(options: {
    identifier?: string;
    content: any;
    trigger: any;
  }): Promise<string>;
  export function getAllScheduledNotificationsAsync(): Promise<Notification[]>;
  export function cancelScheduledNotificationAsync(
    identifier: string,
  ): Promise<void>;
  export function cancelAllScheduledNotificationsAsync(): Promise<void>;
  // Add other expo-notifications exports as needed
}
