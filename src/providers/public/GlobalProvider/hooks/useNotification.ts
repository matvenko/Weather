import { notification } from 'antd';

export function useNotification() {
  const [api, contextHolder] = notification.useNotification();

  return { contextHolder, notificationApi: api };
}
