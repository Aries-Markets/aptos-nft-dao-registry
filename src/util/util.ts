import { stringify } from "safe-stable-stringify";

export function jsonStringify(value: any): string {
  return stringify(value, null, 2)!;
}

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}
