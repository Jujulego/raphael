import { Meta, StoryObj } from '@storybook/nextjs-vite';
import ActivityGraph from './ActivityGraph';

const meta = {
  title: 'Repositories/ActivityGraph',
  component: ActivityGraph,
  tags: ['autodocs'],
} satisfies Meta<typeof ActivityGraph>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [
      { date: new Date('2026-09-11'), pullRequests: 4 },
      { date: new Date('2026-09-15'), pullRequests: 4 },
      { date: new Date('2026-09-20'), pullRequests: 5 },
      { date: new Date('2026-09-25'), pullRequests: 3 },
      { date: new Date('2026-10-11'), pullRequests: 1 },
    ],
  },
};
