export const notNull = <T extends unknown>(value: T | null): value is T => value !== null;
export const isString = (value: unknown): value is string => typeof value === "string";
