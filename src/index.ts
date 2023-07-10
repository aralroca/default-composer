export type isDefaultableValueInputType = {
  defaultableValue: boolean;
  key: PropertyKey;
  value: unknown;
};

export type isDefaultableValueType = ({
  defaultableValue,
  key,
  value,
}: isDefaultableValueInputType) => boolean;

export type Config = {
  isDefaultableValue?: isDefaultableValueType;
  mergeArrays?: boolean;
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
  const allKeys = new Set([defaults, obj].flatMap(getAllKeys));

  for (let key of allKeys) {
    const defaultsValue = defaults[key];
    const originalObjectValue = hasOwn(obj, key) ? obj[key] : undefined;
    const hasDefault = hasOwn(defaults, key);
    const checkOptions = { key, value: originalObjectValue };
    const defaultableValue = checkDefaultableValue(checkOptions);
    const defaultableValueFromConfig =
      config.isDefaultableValue?.({ ...checkOptions, defaultableValue }) ??
      defaultableValue;

    const shouldTakeDefault = hasDefault && defaultableValueFromConfig;

    if (
      shouldTakeDefault &&
      config.mergeArrays &&
      Array.isArray(defaultsValue) &&
      Array.isArray(originalObjectValue)
    ) {
      result[key] = [...new Set([...defaultsValue, ...originalObjectValue])];
      continue;
    }

    if (shouldTakeDefault) {
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
  return getAllKeys(object).length === 0;
}

function checkDefaultableValue({ value }: { value: unknown }): boolean {
  return (
    value === undefined ||
    value === "" ||
    value === null ||
    isEmptyObjectOrArray(value) ||
    (Boolean(config.mergeArrays) && Array.isArray(value))
  );
}

function hasOwn<T extends PropertyKey>(
  obj: Partial<Record<T, unknown>>,
  key: unknown,
): key is T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function getAllKeys(object: {}): PropertyKey[] {
  return [
    ...Object.keys(object),
    ...Object.getOwnPropertySymbols(object).filter(
      (key) => Object.getOwnPropertyDescriptor(object, key)?.enumerable,
    ),
  ];
}
