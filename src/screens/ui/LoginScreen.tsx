import { FC } from 'react';

import FlankerSandboxView from '@app/entities/flanker/ui/FlankerIOSSandbox/FlankerSandboxView';

const LoginScreen: FC = () => {
  return (
    <FlankerSandboxView
      message={'Hello, React Native IOS custom view'}
      imageUrl="https://cdn.cocoacasts.com/cc00ceb0c6bff0d536f25454d50223875d5c79f1/above-the-clouds.jpg"
      onClick={(event: Object) => {
        console.log('Click event: ' + JSON.stringify(event));
      }}
      style={{ width: '100%', height: 400, marginTop: 100 }}
    />
  );
};

export default LoginScreen;
