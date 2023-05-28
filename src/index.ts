export default function defaultComposer<T>(...args: Partial<T>[]): T {
  return args.reduce(compose, args[0]) as T;
}

function compose<T>(defaults: Partial<T>, obj: Partial<T>): Partial<T> {
  const result: Partial<T> = {};
  const allKeys = new Set([defaults, obj].flatMap(Object.keys));

  for (let key of allKeys) {
    const defaultsValue = defaults[key];
    const originalObjectValue = obj[key];
    const hasDefault = key in defaults;

    if (hasDefault && isEmpty(originalObjectValue)) {
      result[key] = defaultsValue;
      continue;
    }

    if (hasDefault && isObject(originalObjectValue)) {
      result[key] = compose(defaultsValue, originalObjectValue);
      continue;
    }

    result[key] = originalObjectValue;
  }

  return result;
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEmptyObjectOrArray<T>(object: T): boolean {
  if (typeof object !== "object" || object === null) return false;
  return Object.keys(object).length === 0;
}

function isEmpty(value: any): boolean {
  return (
    value === undefined ||
    value === "" ||
    value === null ||
    isEmptyObjectOrArray(value)
  );
}
