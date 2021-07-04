import { Story, Meta } from '@storybook/react';
import SectionContent from '.';

export default {
  title: 'SectionContent',
  component: SectionContent,
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    children: {
      type: ''
    }
  }
} as Meta;

export const Default: Story = () => (
  <>
    <div style={{ padding: 10, width: 320, margin: '0 auto' }}>
      <SectionContent>
        <div>this is a content of section</div>
        <div>this is a second line of section</div>
      </SectionContent>
    </div>
  </>
);
