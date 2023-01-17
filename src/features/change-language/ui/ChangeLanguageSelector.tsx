import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { languageModel } from '@entities/language';
import { YStack, BoxProps, RowButton } from '@shared/ui';

type Props = {
  onLanguageChanged: () => void;
} & BoxProps;

const ChangeLanguageSelector: FC<Props> = props => {
  const { onLanguageChanged } = props;
  const { t, i18n } = useTranslation();
  const languagesAvailable = Object.keys(i18n.services.resourceStore.data);
  const { resolvedLanguage } = i18n;

  const onLanguagePress = async (locale: string) => {
    await languageModel.actions.changeLanguage(locale);
    onLanguageChanged();
  };

  return (
    <YStack {...props}>
      {languagesAvailable.map(locale => {
        return (
          <RowButton
            onPress={() => onLanguagePress(locale)}
            key={`${locale}`}
            bg={resolvedLanguage === locale ? '$aqua' : 'transparent'}
            title={t(`language_screen:${locale}`)}
          />
        );
      })}
    </YStack>
  );
};

export default ChangeLanguageSelector;
