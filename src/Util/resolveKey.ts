
export type KeyPropertyType = undefined|string|((...args: any) => undefined|string);

function resolveKey(key: KeyPropertyType, _default: string, args: any): string {
  if ([null, undefined].includes(key)) {
    return _default + JSON.stringify(args);
  }

  if (typeof key !== "function") {
    return key;
  }

  const result = key(...args);

  if ([null, undefined].includes(result)) {
    return _default + JSON.stringify(args);
  }

  return result;
}

export default resolveKey;