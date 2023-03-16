import { FC } from 'react';

import FlankerSandboxView from '@app/entities/flanker/ui/FlankerIOSSandbox/FlankerSandboxView';

const LoginScreen: FC = () => {
  return (
    <FlankerSandboxView
      message={'Hello, React Native IOS custom view'}
      onClick={(event: Object) => {
        console.log('Click event: ' + JSON.stringify(event));
      }}
      style={{ width: '100%', height: 100, marginTop: 100 }}
    />
  );
};

export default LoginScreen;
