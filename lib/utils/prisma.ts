import { Prisma } from '@prisma/client/extension';

export interface PrismaPage<T> {
  readonly items: T;
  readonly count: number;
}

interface PrismaPaginateArgs {
  readonly take: number;
  readonly where?: Readonly<Record<string, unknown>>;
}

interface PrismaPaginateModel {
  count(args: Pick<PrismaPaginateArgs, 'where'>): Promise<number>;
  findMany(args: PrismaPaginateArgs): Promise<unknown[]>;
}

export async function loadPrismaPage<T extends PrismaPaginateModel, A>(
  model: T,
  args: Prisma.Exact<A, Prisma.Args<T, 'findMany'> & { take: number }>,
): Promise<PrismaPage<Prisma.Result<T, A, 'findMany'>>>;
export async function loadPrismaPage(
  model: PrismaPaginateModel,
  args: PrismaPaginateArgs,
): Promise<PrismaPage<unknown[]>> {
  const [items, count] = await Promise.all([
    model.findMany(args),
    model.count({ where: 'where' in args ? args.where : undefined }),
  ]);

  return {
    items,
    count,
  };
}
