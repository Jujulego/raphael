import { Meta, StoryObj } from '@storybook/nextjs-vite';
import RepositoryTableSkeleton from './RepositoryTableSkeleton';

const meta = {
  title: 'Repositories/RepositoryTableSkeleton',
  component: RepositoryTableSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RepositoryTableSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
