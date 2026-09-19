import { Prisma } from '@prisma/client/extension';

export interface PrismaPage<T> {
  readonly items: readonly T[];
  readonly isLast: boolean;
  readonly pageCount: number;
  readonly totalCount: number;
}

export interface PrismaPaginateArgs {
  readonly take: number;
  readonly skip?: number;
  readonly where?: Record<string, unknown>;
}

type PaginateArgs<T> = Prisma.Args<T, 'findMany'> & {
  readonly take: number;
  readonly skip?: number;
  readonly where?: unknown;
};

export interface PrismaPaginateModel {
  count(args: Pick<PrismaPaginateArgs, 'where'>): Promise<number>;
  findMany(args: PrismaPaginateArgs): Promise<unknown[]>;
}

export async function loadPage<T extends PrismaPaginateModel, A>(
  model: T,
  args: Prisma.Exact<A, PaginateArgs<T>>,
): Promise<PrismaPage<Prisma.Result<T, A, 'findMany'>[number]>>;

export async function loadPage(
  model: PrismaPaginateModel,
  args: PrismaPaginateArgs,
): Promise<PrismaPage<unknown>> {
  const { skip = 0, take } = args;

  const [items, totalCount] = await Promise.all([
    model.findMany(args),
    model.count({ where: 'where' in args ? args.where : undefined }),
  ]);

  return {
    items,
    isLast: skip + items.length >= totalCount,
    pageCount: Math.ceil(totalCount / take),
    totalCount,
  };
}
