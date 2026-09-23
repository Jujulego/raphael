import { makeRepositories } from '@/stories/mocks/repositories';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { getRouter } from '@storybook/nextjs-vite/navigation.mock';
import { expect, fn, mocked } from 'storybook/test';
import RepositoryTable from './RepositoryTable';

const meta = {
  title: 'Repositories/RepositoryTable',
  component: RepositoryTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    className: 'max-h-screen overflow-auto',
    pageSize: 10,
    loadMoreAction: fn(() => Promise.resolve([])),
  },
} satisfies Meta<typeof RepositoryTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    firstPage: makeRepositories(10),
    totalCount: 10,
  },
  play: async ({ canvas, userEvent }) => {
    const nameHeader = canvas.getByRole('columnheader', { name: /name/i });

    await userEvent.click(nameHeader);

    await expect(getRouter().replace).toHaveBeenCalled();

    const url = new URL(mocked(getRouter().replace).mock.lastCall![0]);
    await expect(url.searchParams.get('sort')).toEqual('name:asc');
  },
};

export const HalfLoaded: Story = {
  args: {
    firstPage: makeRepositories(10),
    totalCount: 20,
  },
};

export const SortedAsc: Story = {
  args: {
    firstPage: makeRepositories(10),
    totalCount: 10,
  },
  parameters: {
    nextjs: {
      navigation: {
        query: {
          sort: 'name:asc',
        },
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const nameHeader = canvas.getByRole('columnheader', { name: /name/i });

    await userEvent.click(nameHeader);

    await expect(getRouter().replace).toHaveBeenCalled();

    const url = new URL(mocked(getRouter().replace).mock.lastCall![0]);
    await expect(url.searchParams.get('sort')).toEqual('name:desc');
  },
};

export const SortedDesc: Story = {
  args: {
    firstPage: makeRepositories(10),
    totalCount: 10,
  },
  parameters: {
    nextjs: {
      navigation: {
        query: {
          sort: 'name:desc',
        },
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const nameHeader = canvas.getByRole('columnheader', { name: /name/i });

    await userEvent.click(nameHeader);

    await expect(getRouter().replace).toHaveBeenCalled();

    const url = new URL(mocked(getRouter().replace).mock.lastCall![0]);
    await expect(url.searchParams.get('sort')).toBeNull();
  },
};
