// src/providers/public/GlobalProvider/GlobalContext.ts
import { createContext } from 'react';
import type { NotificationInstance } from 'antd/es/notification/interface';

export type NotifyArgs = Parameters<NotificationInstance['open']>[0];

// სწორი ტიპი antd v5-სთვის + პატარა ჰელფერები
export type GlobalContextValue = {
  notificationApi?: NotificationInstance;
  notify: (args: NotifyArgs) => void;
  notifySuccess: (message: React.ReactNode, description?: React.ReactNode) => void;
  notifyError: (message: React.ReactNode, description?: React.ReactNode) => void;
};

export const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);
