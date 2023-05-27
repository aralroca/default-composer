import mergeWith from "lodash/mergeWith"

export default function defaultComposer<T>(...args: Partial<T>[]): T {
  return args.reduce(_defaultComposer<Partial<T>>, {} as T) as T
}

function _defaultComposer<T>(defaults: T, originalObject: T): T {
  return mergeWith(defaults, originalObject, (defaultsValue: T[keyof T], originalObjectValue) => {
    if ((originalObjectValue === undefined || originalObjectValue === '' || originalObjectValue === null) && defaultsValue) {
      return defaultsValue
    }
    if (isEmptyObject(originalObjectValue) && !isEmptyObject(defaultsValue)) {
      return defaultsValue
    }
    if (typeof originalObjectValue === 'object' && !Array.isArray(originalObjectValue) && defaultsValue) {
      return _defaultComposer(defaultsValue, originalObjectValue)
    }
    return originalObjectValue
  }) as T
}

function isEmptyObject<T>(object: T) {
  if (typeof object !== 'object' || object === null) return false;
  return Object.keys(object).length === 0;
}
