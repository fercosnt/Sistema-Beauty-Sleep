export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
    .split(' ')
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(' ')
}

