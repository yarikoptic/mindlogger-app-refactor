import React, { FC, PropsWithChildren } from 'react';

import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { createSecureAsyncStorage, ONE_HOUR, useSplash } from '@shared/lib';

const storage = createSecureAsyncStorage('cache-storage');

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      cacheTime: Infinity,
      retry: 0,
    },
    queries: {
      retry: 2,
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  },
});

const asyncPersist = createAsyncStoragePersister({
  key: 'OFFLINE_CACHE',
  storage,
  throttleTime: 1000,
});

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    const status =
      state.isConnected != null &&
      state.isConnected &&
      Boolean(state.isInternetReachable);

    setOnline(status);
  });
});

if (__DEV__) {
  import('react-query-native-devtools').then(({ addPlugin }) => {
    addPlugin({ queryClient });
  });
}

const ReactQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized } = useSplash();

  const onCacheRestored = () => {
    queryClient
      .resumePausedMutations()
      .then(() => queryClient.invalidateQueries());

    onModuleInitialized('cache');
  };

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        maxAge: ONE_HOUR * 24,
        persister: asyncPersist,
        buster: 'kill-cache',
      }}
      onSuccess={onCacheRestored}
    >
      {children}
    </PersistQueryClientProvider>
  );
};

export default ReactQueryProvider;
