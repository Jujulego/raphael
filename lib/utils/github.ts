export function splitRepositoryFullName(fullName: string) {
  const [owner, name] = fullName.split('/');
  return { owner, name };
}
