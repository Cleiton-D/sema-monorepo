import { Story, Meta } from '@storybook/react';
import { PlusCircle } from '@styled-icons/feather';

import Button, { ButtonProps } from '.';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    children: {
      type: 'string'
    },
    icon: {
      type: ''
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large']
    },
    styleType: {
      control: { type: 'select' },
      options: ['normal', 'rounded', 'outlined']
    }
  }
} as Meta;

export const Default: Story<ButtonProps> = (args) => <Button {...args} />;

Default.args = {
  children: 'Pesquisar'
};

export const withIcon: Story<ButtonProps> = (args) => <Button {...args} />;

withIcon.args = {
  size: 'large',
  children: 'Adicionar Pessoa',
  icon: <PlusCircle />
};
