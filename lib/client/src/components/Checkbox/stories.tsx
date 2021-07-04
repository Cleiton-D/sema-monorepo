import { Story, Meta } from '@storybook/react';
import Checkbox, { CheckboxProps } from '.';

export default {
  title: 'Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    onCheck: {
      action: 'checked'
    },
    disabled: {
      type: 'boolean'
    }
  }
} as Meta;

export const Default: Story<CheckboxProps> = (args) => (
  <>
    <div style={{ padding: 10 }}>
      <Checkbox name="frequency" labelFor="frequency" {...args} />
    </div>
  </>
);
