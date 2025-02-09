import { LogBox } from 'react-native';

import { RootNavigator } from '@screens';

import localization from '@jobs/localization';
import { jobRunner } from '@shared/lib';

import { AppProvider } from './ui';

const hideIosSimulatorErrorWarningBadges = true;

if (hideIosSimulatorErrorWarningBadges) {
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
}

jobRunner.runAll([localization]);

const App = () => {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
};

export default App;
