import { Story, Meta } from '@storybook/react';
import ListItem from '.';

export default {
  title: 'ListItem',
  component: ListItem,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'sema-white'
    }
  },
  argTypes: {
    children: {
      type: ''
    }
  }
} as Meta;

export const Default: Story = () => (
  <>
    <ul style={{ padding: 10, width: 400, margin: '0 auto' }}>
      <ListItem highlightOnHover>
        <div>this is a content of list item</div>
      </ListItem>
    </ul>
  </>
);
