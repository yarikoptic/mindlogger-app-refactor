import NetInfo from '@react-native-community/netinfo';

import { onNetworkUnavailable } from '../alerts';

export const isAppOnline = async (): Promise<boolean> => {
  const networkState = await NetInfo.fetch();

  const result =
    networkState.isConnected != null &&
    networkState.isConnected &&
    Boolean(networkState.isInternetReachable);

  return result;
};

export const executeIfOnline = (callback: (...args: any[]) => unknown) => {
  isAppOnline().then(isOnline => {
    if (isOnline) {
      callback();
    } else {
      onNetworkUnavailable();
    }
  });
};
