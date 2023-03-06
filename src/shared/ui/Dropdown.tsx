import { FC, useState } from 'react';

import { Select } from '.';

type DropdownProps = {
  placeholder: string;
  items: Array<number | string>;
  value?: number | string;
  onValueChange: (value: number | string) => void;
};

const Dropdown: FC<DropdownProps> = ({
  placeholder,
  value = '',
  onValueChange,
  items,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const onOpen = () => {
    setIsOpened(!isOpened);
  };
  return (
    <Select
      open={isOpened}
      value={String(value)}
      onOpenChange={onOpen}
      onValueChange={onValueChange}
    >
      <Select.Trigger jc="center">
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>

      {isOpened && (
        <Select.Content>
          {items?.map((item, index) => (
            <Select.Item index={index} key={item} value={String(item)}>
              <Select.ItemText
                width="100%"
                textAlign="center"
                color="$darkGrey"
              >
                {item}
              </Select.ItemText>
            </Select.Item>
          ))}
        </Select.Content>
      )}
    </Select>
  );
};

export default Dropdown;
