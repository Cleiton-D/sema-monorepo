import { Story, Meta } from '@storybook/react';
import { UserPlus } from '@styled-icons/feather';
import UserLeft from 'assets/images/userLeft.svg';

import Card, { CardProps } from '.';

export default {
  title: 'Card',
  component: Card,
  argsTypes: {
    children: {
      type: 'string'
    },
    icon: {
      type: ''
    }
  }
} as Meta;

export const Default: Story<CardProps> = (args) => <Card {...args} />;

Default.args = {
  children: '150',
  description: 'Alunos ativos',
  link: '/'
};

export const Enrollments: Story<CardProps> = (args) => <Card {...args} />;

Enrollments.args = {
  description: 'Matrículas',
  icon: <UserPlus />,
  link: '/'
};

export const Transfers: Story<CardProps> = (args) => <Card {...args} />;

Transfers.args = {
  description: 'Transferência',
  icon: <UserLeft />,
  link: '/'
};
