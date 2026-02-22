export type RouteSearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function extractSearchParam(
  searchParams: RouteSearchParams | undefined,
  name: string,
): Promise<null | string> {
  const params = (await searchParams) ?? {};
  const values = params[name] ?? [];

  if (Array.isArray(values)) {
    return values[0] ?? null;
  }

  return values;
}
