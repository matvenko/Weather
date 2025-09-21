// src/providers/public/GlobalProvider/GlobalProvider.tsx
import React, { PropsWithChildren, useMemo } from 'react';
import { GlobalContext } from './GlobalContext';
import { useNotification } from './hooks/useNotification';

export function GlobalProvider({ children }: PropsWithChildren) {
    const { notificationApi, contextHolder } = useNotification();

    const value = useMemo(() => {
        const notify = (args: Parameters<typeof notificationApi.open>[0]) =>
            notificationApi?.open(args);

        const notifySuccess = (message: React.ReactNode, description?: React.ReactNode) =>
            notificationApi?.success({ message, description });

        const notifyError = (message: React.ReactNode, description?: React.ReactNode) =>
            notificationApi?.error({ message, description });

        return {
            notificationApi,
            notify,
            notifySuccess,
            notifyError,
        };
    }, [notificationApi]);

    return (
        <GlobalContext.Provider value={value}>
            {contextHolder}
            {children}
        </GlobalContext.Provider>
    );
}
