type emptyCheckerType = (key: string, value: unknown) => boolean;

type Config = {
  emptyChecker?: emptyCheckerType;
};

let config: Config = {};

export function setConfig(newConfig: Config): void {
  config = newConfig;
}

export function defaultComposer<T>(...args: Partial<T>[]): T {
  return args.reduce(compose, args[0]) as T;
}

function compose<T>(defaults: Partial<T>, obj: Partial<T>): Partial<T> {
  const result: Partial<T> = {};
  const allKeys = new Set([defaults, obj].flatMap(Object.keys));
  const isEmptyFn = config.emptyChecker || isEmpty;

  for (let key of allKeys) {
    const defaultsValue = defaults[key];
    const originalObjectValue = obj[key];
    const hasDefault = key in defaults;

    if (hasDefault && isEmptyFn(key, originalObjectValue)) {
      result[key] = defaultsValue;
      continue;
    }

    if (isObject(defaultsValue) && isObject(originalObjectValue)) {
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

function isEmpty(key: string, value: unknown): boolean {
  return (
    value === undefined ||
    value === "" ||
    value === null ||
    isEmptyObjectOrArray(value)
  );
}
