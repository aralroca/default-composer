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

    if (isEmpty(originalObjectValue) && key in defaults) {
      result[key] = defaultsValue;
      continue;
    }

    if (
      typeof originalObjectValue === "object" &&
      originalObjectValue !== null &&
      !Array.isArray(originalObjectValue) &&
      defaultsValue
    ) {
      result[key] = compose(defaultsValue, originalObjectValue);
      continue;
    }

    result[key] = originalObjectValue;
  }

  return result;
}

function isEmptyObject<T>(object: T) {
  if (typeof object !== "object" || object === null) return false;
  return Object.keys(object).length === 0;
}

function isEmpty(value: any) {
  return (
    value === undefined ||
    value === "" ||
    value === null ||
    isEmptyObject(value)
  );
}
