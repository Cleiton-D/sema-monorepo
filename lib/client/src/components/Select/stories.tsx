import { Story, Meta } from '@storybook/react';
import { Form } from '@unform/web';

import Select from '.';

export default {
  title: 'Form/Select',
  component: Select,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'sema-white'
    }
  },
  args: {
    name: 'inputname',
    label: 'Input label'
  }
} as Meta;

export const Default: Story = (args) => (
  <>
    <Form
      style={{ padding: 10, width: 400, margin: '0 auto' }}
      onSubmit={(values) => console.log(values)}
    >
      <Select
        label="inputlabel"
        name="name"
        options={[
          { label: 'essa é a opcao 1', value: 1 },
          { label: 'essa é a opcao 2', value: 2 }
        ]}
      />
      <button type="submit">submit</button>
    </Form>
  </>
);
