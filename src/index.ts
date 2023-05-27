export default function defaultComposer<T>(...args: Partial<T>[]): T {
  return args.reduce(compose, args[0]) as T;
}

function compose(defaults, originalObject) {
  const result = {};
  const allKeys = new Set([
    ...Object.keys(defaults),
    ...Object.keys(originalObject),
  ]);

  for (let key of allKeys) {
    const defaultsValue = defaults[key];
    const originalObjectValue = originalObject[key];
    const hasDefault = key in defaults;

    if (isEmpty(originalObjectValue) && hasDefault) {
      result[key] = defaultsValue;
      continue;
    }

    if (isObject(originalObjectValue) && hasDefault) {
      result[key] = compose(defaultsValue, originalObjectValue);
      continue;
    }

    result[key] = originalObjectValue;
  }

  return result;
}

function isObject(value: any) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEmptyObjectOrArray<T>(object: T) {
  if (typeof object !== "object" || object === null) return false;
  return Object.keys(object).length === 0;
}

function isEmpty(value: any) {
  return (
    value === undefined ||
    value === "" ||
    value === null ||
    isEmptyObjectOrArray(value)
  );
}
