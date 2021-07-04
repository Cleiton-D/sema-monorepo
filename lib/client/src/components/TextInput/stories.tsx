import { Story, Meta } from '@storybook/react';
import { Form } from '@unform/web';

import TextInput, { TextInputProps } from '.';

export default {
  title: 'Form/TextInput',
  component: TextInput,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'sema-white'
    }
  },
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['input', 'textarea']
    }
  },
  args: {
    name: 'inputname',
    label: 'Input label'
  }
} as Meta;

export const Default: Story<TextInputProps> = (args) => (
  <Form
    style={{ padding: 10, width: 400, margin: '0 auto' }}
    onSubmit={(values) => console.log(values)}
  >
    <TextInput {...args} />
  </Form>
);

export const TextArea: Story<TextInputProps> = (args) => (
  <>
    <Form
      style={{ padding: 10, width: 400, margin: '0 auto' }}
      onSubmit={(values) => console.log(values)}
    >
      <TextInput {...args} />
    </Form>
  </>
);

TextArea.args = {
  as: 'textarea'
};
