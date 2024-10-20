export function intersperse<T>(xs: T[], sep: T): T[] {
  let result: T[] = [];

  for (let x of xs) result.push(x, sep);

  return result.slice(0, result.length - 1);
}
