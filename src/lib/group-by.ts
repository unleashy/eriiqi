export function groupBy<T, U>(xs: T[], f: (x: T) => U): Map<U, T[]> {
  let result = new Map<U, T[]>();

  for (let x of xs) {
    let y = f(x);

    let m = result.get(y);
    if (m) {
      m.push(x);
    } else {
      result.set(y, [x]);
    }
  }

  return result;
}
