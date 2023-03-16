// @ts-ignore

import React from 'react';
import { requireNativeComponent } from 'react-native';

type Props = {
  message: string;
  onClick: (event: any) => void;
  style: any;
};

const RCTFlankerSandboxView =
  requireNativeComponent<Props>('FlankerSandboxView');

const MyNativeCustomView: React.FC<Props> = props => {
  const { message, onClick, style } = props;
  const _onClick = (event: any) => {
    if (!onClick) {
      return;
    }

    onClick(event.nativeEvent);
  };

  return (
    <RCTFlankerSandboxView message={message} onClick={_onClick} style={style} />
  );
};

export default MyNativeCustomView;

// export default RCTFlankerSandboxView;
